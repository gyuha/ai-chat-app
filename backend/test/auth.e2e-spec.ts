import { ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import type { INestApplication } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import request from 'supertest';

import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

const createUserTableSql = `
  CREATE TABLE IF NOT EXISTS "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
  )
`;

const createUserEmailIndexSql = `
  CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email")
`;

describe('Auth API contract (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let databaseDir: string;

  beforeAll(async () => {
    databaseDir = await mkdtemp(join(tmpdir(), 'auth-e2e-'));
    process.env.DATABASE_URL = `file:${join(databaseDir, 'test.db')}`;
    process.env.JWT_ACCESS_SECRET = 'access-secret-access-secret-access';
    process.env.JWT_REFRESH_SECRET = 'refresh-secret-refresh-secret-refresh';
    process.env.JWT_ACCESS_TTL = '15m';
    process.env.JWT_REFRESH_TTL = '7d';
    process.env.OPENROUTER_API_KEY = 'test-openrouter-key';
    process.env.OPENROUTER_MODEL = 'openrouter/test-model';
    process.env.FRONTEND_ORIGIN = 'http://localhost:5173';
    process.env.PORT = '0';
    process.env.NODE_ENV = 'test';

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.use(cookieParser());
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();

    prisma = app.get(PrismaService);
    await prisma.$executeRawUnsafe(createUserTableSql);
    await prisma.$executeRawUnsafe(createUserEmailIndexSql);
  });

  afterEach(async () => {
    if (prisma) {
      await prisma.user.deleteMany();
    }
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }

    if (databaseDir) {
      await rm(databaseDir, { recursive: true, force: true });
    }
  });

  it('supports signup, duplicate rejection, login cookies, refresh, session restore, and logout clearing', async () => {
    const signupResponse = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        email: 'user@example.com',
        password: 'password1234',
      })
      .expect(201);

    expect(signupResponse.body).toEqual({
      user: {
        id: expect.any(String),
        email: 'user@example.com',
      },
    });
    expect(JSON.stringify(signupResponse.body)).not.toContain('passwordHash');
    expect(JSON.stringify(signupResponse.body)).not.toContain('OPENROUTER_API_KEY');
    expect(JSON.stringify(signupResponse.body)).not.toContain('OPENROUTER_MODEL');

    await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        email: 'user@example.com',
        password: 'password1234',
      })
      .expect(409);

    const agent = request.agent(app.getHttpServer());
    const loginResponse = await agent.post('/auth/login').send({
      email: 'user@example.com',
      password: 'password1234',
    });

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body).toEqual({
      user: {
        id: expect.any(String),
        email: 'user@example.com',
      },
    });

    const setCookie = loginResponse.headers['set-cookie'];
    expect(setCookie).toEqual(
      expect.arrayContaining([
        expect.stringContaining('access_token='),
        expect.stringContaining('refresh_token='),
        expect.stringContaining('HttpOnly'),
        expect.stringContaining('SameSite=Lax'),
        expect.stringContaining('Path=/'),
      ]),
    );

    await agent.get('/auth/session').expect(200, {
      user: {
        id: signupResponse.body.user.id,
        email: 'user@example.com',
      },
    });

    const refreshResponse = await agent.post('/auth/refresh').expect(200);
    expect(refreshResponse.body).toEqual({
      user: {
        id: signupResponse.body.user.id,
        email: 'user@example.com',
      },
    });
    expect(JSON.stringify(refreshResponse.body)).not.toContain('passwordHash');
    expect(JSON.stringify(refreshResponse.body)).not.toContain('OPENROUTER_API_KEY');
    expect(JSON.stringify(refreshResponse.body)).not.toContain('OPENROUTER_MODEL');

    const logoutResponse = await agent.post('/auth/logout').expect(200);
    expect(logoutResponse.body).toEqual({ ok: true });
    expect(logoutResponse.headers['set-cookie']).toEqual(
      expect.arrayContaining([
        expect.stringContaining('access_token=;'),
        expect.stringContaining('refresh_token=;'),
      ]),
    );

    await agent.get('/auth/session').expect(401);
  });

  it('returns 401 for missing or invalid session cookies', async () => {
    await request(app.getHttpServer()).get('/auth/session').expect(401);

    await request(app.getHttpServer())
      .get('/auth/session')
      .set('Cookie', ['access_token=invalid-token'])
      .expect(401);
  });
});
