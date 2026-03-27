import { ConfigService } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';

export const prismaConfig = {
  datasource: {
    type: 'postgres' as const,
    url: process.env.DATABASE_URL,
  } satisfies DataSourceOptions,
};

export default prismaConfig;
