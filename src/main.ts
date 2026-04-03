/*import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Mantec3 API')
    .setDescription('API para o sistema Mantec3')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();*/
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Configuração Swagger
  const config = new DocumentBuilder()
    .setTitle('Mantec3 API')
    .setDescription('API para o sistema Mantec3')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // --- Endpoint para listar todas as rotas ---
  app.getHttpAdapter().getInstance().get('/__rotas', (_, res) => {
    const server = app.getHttpAdapter().getInstance();
    const rotas: string[] = [];

    server._router.stack.forEach((r: any) => {
      if (r.route && r.route.path) {
        // Inclui método HTTP + path
        const methods = Object.keys(r.route.methods)
          .map((m) => m.toUpperCase())
          .join(', ');
        rotas.push(`${methods} ${r.route.path}`);
      }
    });

    res.json(rotas);
  });
  // --------------------------------------------

  await app.listen(3000);
}
bootstrap();

