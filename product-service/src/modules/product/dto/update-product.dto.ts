import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdateProductDto {
  @ApiPropertyOptional({ description: 'Optional: New name of the product', example: 'MacBook Pro (2024)' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: 'Optional: New description of the product', example: 'Updated model with enhanced features.' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'Optional: New price of the product', example: 1250.00 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: number;

  @ApiPropertyOptional({ description: 'Optional: New stock quantity of the product', example: 45 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  stock?: number;
}
