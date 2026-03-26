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

function createStreamingResponse(...frames: string[]) {
  const encoder = new TextEncoder();

  return new Response(
    new ReadableStream({
      start(controller) {
        for (const frame of frames) {
          controller.enqueue(encoder.encode(frame));
        }

        controller.close();
      },
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'text/event-stream',
      },
    },
  );
}

describe('Conversations chat API contract (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let databaseDir: string;
  let fetchMock: jest.SpiedFunction<typeof fetch>;

  beforeAll(async () => {
    databaseDir = await mkdtemp(join(tmpdir(), 'conversations-chat-e2e-'));
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

    fetchMock = jest.spyOn(global, 'fetch');

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
    fetchMock.mockReset();
    await prisma.$executeRawUnsafe('DELETE FROM "Message"');
    await prisma.$executeRawUnsafe('DELETE FROM "Conversation"');
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    fetchMock.mockRestore();

    if (app) {
      await app.close();
    }

    if (databaseDir) {
      await rm(databaseDir, { recursive: true, force: true });
    }
  });

  it('streams assistant output, persists the final assistant message, and returns chronological detail', async () => {
    fetchMock.mockResolvedValueOnce(
      createStreamingResponse(
        ': OPENROUTER PROCESSING\n\n',
        'data: {"choices":[{"delta":{"content":"안녕"},"finish_reason":null}]}\n\n',
        'data: {"choices":[{"delta":{"content":"하세요"},"finish_reason":"stop"}]}\n\n',
        'data: [DONE]\n\n',
      ),
    );

    const agent = request.agent(app.getHttpServer());
    const credentials = {
      email: 'stream-owner@example.com',
      password: 'password1234',
    };

    await agent.post('/auth/signup').send(credentials).expect(201);
    await agent.post('/auth/login').send(credentials).expect(200);

    const conversation = await agent.post('/conversations').send({}).expect(201);

    const chatResponse = await agent
      .post(`/conversations/${conversation.body.id}/chat`)
      .send({ content: '안녕하세요?' })
      .expect(201);

    expect(chatResponse.headers['content-type']).toContain('text/event-stream');
    expect(chatResponse.text).toContain('안녕');
    expect(chatResponse.text).toContain('하세요');
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0]?.[0]).toBe('https://openrouter.ai/api/v1/chat/completions');
    expect(String(fetchMock.mock.calls[0]?.[1]?.body)).toContain('"model":"openrouter/test-model"');
    expect(String(fetchMock.mock.calls[0]?.[1]?.body)).toContain('"stream":true');

    const detailResponse = await agent
      .get(`/conversations/${conversation.body.id}`)
      .expect(200);

    expect(detailResponse.body).toEqual({
      id: conversation.body.id,
      title: '새 대화',
      messages: [
        {
          id: expect.any(String),
          role: 'user',
          content: '안녕하세요?',
        },
        {
          id: expect.any(String),
          role: 'assistant',
          content: '안녕하세요',
        },
      ],
    });
  });

  it('rejects foreign detail access and foreign chat sends with 404', async () => {
    fetchMock.mockResolvedValue(
      createStreamingResponse('data: {"choices":[{"delta":{"content":"x"},"finish_reason":"stop"}]}\n\n'),
    );

    const primaryAgent = request.agent(app.getHttpServer());
    const secondaryAgent = request.agent(app.getHttpServer());
    const primaryCredentials = {
      email: 'primary-chat@example.com',
      password: 'password1234',
    };
    const secondaryCredentials = {
      email: 'secondary-chat@example.com',
      password: 'password1234',
    };

    await primaryAgent.post('/auth/signup').send(primaryCredentials).expect(201);
    await secondaryAgent.post('/auth/signup').send(secondaryCredentials).expect(201);
    await primaryAgent.post('/auth/login').send(primaryCredentials).expect(200);
    await secondaryAgent.post('/auth/login').send(secondaryCredentials).expect(200);

    const foreignConversation = await secondaryAgent.post('/conversations').send({}).expect(201);

    await primaryAgent.get(`/conversations/${foreignConversation.body.id}`).expect(404);
    await primaryAgent
      .post(`/conversations/${foreignConversation.body.id}/chat`)
      .send({ content: '침범 시도' })
      .expect(404);
  });
});
