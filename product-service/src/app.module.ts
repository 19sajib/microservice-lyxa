import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configuration } from './config/configuration';
import { validationSchema } from './config/validation.schema';
import { DatabaseModule } from './modules/database/database.module';
import { RmqModule } from './modules/rmq/rmq.module';
import { ProductModule } from './modules/product/product.module';
import { AuthClientModule } from './modules/auth-client/auth-client.module';

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
    AuthClientModule, 
    ProductModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
