import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import * as express from 'express';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const appEnv = configService.get<string>('appEnv') || 'dev';
  
  // 启用 CORS
  app.enableCors();
  
  // 生产环境：提供静态文件服务
  const isProduction = appEnv === 'prod';
  if (isProduction) {
    const staticPath = path.join(__dirname, '../../dist');
    app.use(express.static(staticPath));
    
    // SPA 回退：所有非 API 路由返回 index.html
    app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
      if (!req.path.startsWith('/api') && !req.path.startsWith('/health')) {
        res.sendFile(path.join(staticPath, 'index.html'));
      } else {
        next();
      }
    });
  }
  
  // 生产环境使用 5000 端口，开发环境使用 8000 端口
  const port = configService.get<number>('port') ?? (isProduction ? 5000 : 8000);
  await app.listen(port);
  
  console.log(`JinPikaStoryboards Server running on port ${port}`);
}

bootstrap();
