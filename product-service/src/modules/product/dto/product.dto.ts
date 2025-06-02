import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';

export class ProductDto {
  @ApiProperty({ description: 'Unique identifier of the product', example: '60c72b2f9b1d4c001c8e4d1b' })
  @Expose()
  @Transform(({ obj }) => obj._id.toHexString())
  id: string;

  @ApiProperty({ description: 'Name of the product', example: 'Macbook Pro M4' })
  @Expose()
  name: string;

  @ApiProperty({ description: 'Description of the product', example: 'High-performance laptop for professionals.' })
  @Expose()
  description: string;

  @ApiProperty({ description: 'Price of the product', example: 1890.50 })
  @Expose()
  price: number;

  @ApiProperty({ description: 'Stock quantity of the product', example: 50 })
  @Expose()
  stock: number;

  @ApiProperty({ description: 'ID of the user who owns this product', example: '60c72b2f9b1d4c001c8e4d1a' })
  @Expose()
  ownerId: string;

  @ApiProperty({ description: 'Date and time when the product was created', example: '2023-10-27T10:00:00.000Z' })
  @Expose()
  createdAt: Date;

  @ApiProperty({ description: 'Date and time when the product was last updated', example: '2023-10-27T10:30:00.000Z' })
  @Expose()
  updatedAt: Date;
}
