import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { Product } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductDto } from './dto/product.dto';
import { plainToInstance } from 'class-transformer'; 

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);

  constructor(
    @InjectModel(Product) private readonly productModel: ReturnModelType<typeof Product>,
  ) {}


  async create(createProductDto: CreateProductDto, ownerId: string): Promise<ProductDto> {
    const createdProduct = new this.productModel({
      ...createProductDto,
      ownerId,
    });
    const product = await createdProduct.save();
    this.logger.log(`Product created with ID: ${product._id} by owner: ${ownerId}`);
    return plainToInstance(ProductDto, product.toObject());
  }

  async findAll(): Promise<ProductDto[]> {
    const products = await this.productModel.find().exec();
    return products.map(product => plainToInstance(ProductDto, product.toObject()));
  }

  async findById(id: string): Promise<ProductDto> {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException(`Product with ID "${id}" not found.`);
    }
    return plainToInstance(ProductDto, product.toObject());
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<ProductDto> {
    const updatedProduct = await this.productModel.findByIdAndUpdate(
      id,
      updateProductDto,
      { new: true }
    ).exec();

    if (!updatedProduct) {
      throw new NotFoundException(`Product with ID "${id}" not found.`);
    }
    this.logger.log(`Product updated with ID: ${updatedProduct._id}`);
    return plainToInstance(ProductDto, updatedProduct.toObject());
  }
  
  async remove(id: string): Promise<void> {
    const result = await this.productModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Product with ID "${id}" not found.`);
    }
    this.logger.log(`Product deleted with ID: ${id}`);
  }
}
