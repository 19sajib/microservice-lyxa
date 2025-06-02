import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
  Param,
  Put,
  Delete,
  Logger,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductDto } from './dto/product.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { OwnerGuard } from '../../common/guards/owner.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@ApiTags('Products') 
@Controller('products')
@UseGuards(JwtAuthGuard) 
export class ProductController {
  private readonly logger = new Logger(ProductController.name);

  constructor(private readonly productsService: ProductService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({ status: 201, description: 'Product successfully created.', type: ProductDto })
  @ApiResponse({ status: 400, description: 'Bad Request (e.g., validation errors).' })
  @ApiBearerAuth()
  async create(
    @Body() createProductDto: CreateProductDto,
    @CurrentUser('id') userId: string,
  ): Promise<ProductDto> {
    this.logger.log(`User ${userId} attempting to create product.`);
    return this.productsService.create(createProductDto, userId);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({ status: 200, description: 'List of products.', type: [ProductDto] })
  @ApiBearerAuth()
  async findAll(): Promise<ProductDto[]> {
    return this.productsService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a product by ID' })
  @ApiResponse({ status: 200, description: 'Product data.', type: ProductDto })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  @ApiBearerAuth()
  async findOne(@Param('id') id: string): Promise<ProductDto> {
    return this.productsService.findById(id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update a product by ID (owner only)' })
  @ApiResponse({ status: 200, description: 'Product successfully updated.', type: ProductDto })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 403, description: 'Forbidden (not product owner).' })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  @ApiBearerAuth()
  @UseGuards(OwnerGuard)
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<ProductDto> {
    this.logger.log(`Updating product ${id}.`);
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a product by ID (owner only)' })
  @ApiResponse({ status: 204, description: 'Product successfully deleted.' })
  @ApiResponse({ status: 403, description: 'Forbidden (not product owner).' })
  @ApiResponse({ status: 404, description: 'Product not found.' })
  @ApiBearerAuth()
  @UseGuards(OwnerGuard)
  async remove(@Param('id') id: string): Promise<void> {
    this.logger.log(`Deleting product ${id}.`);
    await this.productsService.remove(id);
  }
}
