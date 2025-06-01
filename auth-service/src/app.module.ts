import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configuration } from './config/configuration';
import { validationSchema } from './config/validation.schema';
import { DatabaseModule } from './database/database.module';
import { RmqModule } from './rmq/rmq.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { TypegooseModule } from 'nestjs-typegoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
      load: [configuration], 
      validationSchema: validationSchema,
      envFilePath: '.env',
    }),
    DatabaseModule,
    RmqModule,
    AuthModule,
    UsersModule,
    TypegooseModule      
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

