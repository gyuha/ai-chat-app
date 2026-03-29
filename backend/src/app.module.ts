import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 모든 모듈에서 ConfigModule 접근 가능
      envFilePath: ".env",
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
