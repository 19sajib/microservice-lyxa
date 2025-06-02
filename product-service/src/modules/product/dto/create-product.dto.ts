import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ description: 'Name of the product', example: 'Asus ROG Strix SCAR 18' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Description of the product', example: 'High-performance laptop for gamer.' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Price of the product', example: 1200.50 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ description: 'Stock quantity of the product', example: 50 })
  @IsNumber()
  @Min(0)
  stock: number;
}
