import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { RpcExceptionFilter } from './common/rpc-exception.filter';



async function bootstrap() {
  // Create a hybrid application (HTTP server + Microservice)
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // --- HTTP Server Setup ---
  const httpPort = configService.get<number>('PORT');
  app.setGlobalPrefix('api/v1'); 

  // Enable validation for DTOs
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Setup Swagger API documentation
  const config = new DocumentBuilder()
    .setTitle('Auth Service API')
    .setDescription('API documentation for the authentication microservice')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // --- RabbitMQ Microservice Setup ---
  // Create a separate microservice instance for RabbitMQ communication
  const rmqApp = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [configService.get<string>('RABBITMQ_URI')],
        queue: 'auth_queue', // The queue this service will listen on
        queueOptions: {
          durable: false // Queue will be deleted when no consumers are connected
        },
      },
    },
  );

  // Apply the custom RPC exception filter to the microservice
  rmqApp.useGlobalFilters(new RpcExceptionFilter());

  // Start both the HTTP server and the RabbitMQ microservice
  await app.listen(httpPort);
  await rmqApp.listen();

  console.log(`Auth Service HTTP server running on port ${httpPort}`);
  console.log(`Auth Service RabbitMQ microservice listening on auth_queue`);
  console.log(`Swagger documentation available at http://localhost:${httpPort}/api/docs`);
}
bootstrap();

