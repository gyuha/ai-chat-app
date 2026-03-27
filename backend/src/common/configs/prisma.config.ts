export const prismaConfig = {
  datasource: {
    type: 'sqlite' as const,
    url: process.env.DATABASE_URL,
  },
};

export default prismaConfig;
