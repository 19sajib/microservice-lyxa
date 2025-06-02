import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { TypegooseModule } from 'nestjs-typegoose';
import { Product } from './schemas/product.schema';
import { AuthClientModule } from '../auth-client/auth-client.module';

@Module({
  imports: [
    TypegooseModule.forFeature([Product]),
    AuthClientModule, 
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
