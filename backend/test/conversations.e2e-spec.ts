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

const createConversationTableSql = `
  CREATE TABLE IF NOT EXISTS "Conversation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Conversation_userId_fkey"
      FOREIGN KEY ("userId") REFERENCES "User" ("id")
      ON DELETE CASCADE ON UPDATE CASCADE
  )
`;

const createConversationIndexSql = `
  CREATE INDEX IF NOT EXISTS "Conversation_userId_updatedAt_idx"
  ON "Conversation"("userId", "updatedAt")
`;

const createMessageTableSql = `
  CREATE TABLE IF NOT EXISTS "Message" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "conversationId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Message_conversationId_fkey"
      FOREIGN KEY ("conversationId") REFERENCES "Conversation" ("id")
      ON DELETE CASCADE ON UPDATE CASCADE
  )
`;

const createMessageIndexSql = `
  CREATE INDEX IF NOT EXISTS "Message_conversationId_createdAt_idx"
  ON "Message"("conversationId", "createdAt")
`;

describe('Conversations API contract (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let databaseDir: string;

  beforeAll(async () => {
    databaseDir = await mkdtemp(join(tmpdir(), 'conversations-e2e-'));
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
    await prisma.$executeRawUnsafe(createConversationTableSql);
    await prisma.$executeRawUnsafe(createConversationIndexSql);
    await prisma.$executeRawUnsafe(createMessageTableSql);
    await prisma.$executeRawUnsafe(createMessageIndexSql);
  });

  afterEach(async () => {
    await prisma.$executeRawUnsafe('DELETE FROM "Message"');
    await prisma.$executeRawUnsafe('DELETE FROM "Conversation"');
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }

    if (databaseDir) {
      await rm(databaseDir, { recursive: true, force: true });
    }
  });

  it('creates conversations, lists only owned titles, and rejects foreign detail access', async () => {
    const primaryAgent = request.agent(app.getHttpServer());
    const secondaryAgent = request.agent(app.getHttpServer());

    const primaryCredentials = {
      email: 'primary@example.com',
      password: 'password1234',
    };
    const secondaryCredentials = {
      email: 'secondary@example.com',
      password: 'password1234',
    };

    await primaryAgent.post('/auth/signup').send(primaryCredentials).expect(201);
    await secondaryAgent.post('/auth/signup').send(secondaryCredentials).expect(201);

    await primaryAgent.post('/auth/login').send(primaryCredentials).expect(200);
    await secondaryAgent.post('/auth/login').send(secondaryCredentials).expect(200);

    const createResponse = await primaryAgent
      .post('/conversations')
      .send({})
      .expect(201);

    expect(createResponse.body).toEqual({
      id: expect.any(String),
      title: '새 대화',
    });

    await primaryAgent.post('/conversations').send({}).expect(201);
    await secondaryAgent.post('/conversations').send({}).expect(201);

    const listResponse = await primaryAgent.get('/conversations').expect(200);

    expect(listResponse.body).toEqual([
      { id: expect.any(String), title: '새 대화' },
      { id: expect.any(String), title: '새 대화' },
    ]);

    expect(
      listResponse.body.every(
        (conversation: { id: string; title: string }) =>
          typeof conversation.id === 'string' && conversation.title === '새 대화',
      ),
    ).toBe(true);

    const foreignConversation = await secondaryAgent
      .post('/conversations')
      .send({})
      .expect(201);

    await primaryAgent
      .get(`/conversations/${foreignConversation.body.id}`)
      .expect(404);
  });
});
