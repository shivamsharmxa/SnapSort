import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for frontend development
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:5174'], // Vite dev server
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  });
  
  await app.listen(process.env.PORT ?? 3000);
  console.log('🚀 Backend running on http://localhost:3000');
  console.log('✅ CORS enabled for frontend');
}
bootstrap();
