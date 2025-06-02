import { Injectable, CanActivate, ExecutionContext, ForbiddenException, NotFoundException } from '@nestjs/common';
import { ProductService } from '../../modules/product/product.service';
import { IJwtPayload } from '../../modules/auth-client/dto/jwt-payload.dto';

@Injectable()
export class OwnerGuard implements CanActivate {
  constructor(private readonly productService: ProductService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user: IJwtPayload = request.user; 
    const productId = request.params.id;

    if (!user || !user.id) {
      throw new ForbiddenException('User not authenticated.');
    }

    if (!productId) {
      console.warn('OwnerGuard used on a route without an ID parameter. Check route configuration.');
      return true; 
    }

    const product = await this.productService.findById(productId);

    if (!product) {
      throw new NotFoundException(`Product with ID "${productId}" not found.`);
    }

    if (product.ownerId !== user.id) {
      throw new ForbiddenException('You do not have permission to perform this action on this product.');
    }

    return true;
  }
}
