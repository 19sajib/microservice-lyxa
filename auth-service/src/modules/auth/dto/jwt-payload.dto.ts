import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../../common/role.enum';

export interface IJwtPayload {
  id: string;
  email: string;
  roles: string[];
}

export class JwtPayloadDto implements IJwtPayload {
  @ApiProperty({ description: 'User ID', example: '60c72b2f9b1d4c001c8e4d1a' })
  id: string;

  @ApiProperty({ description: 'User email', example: 'john.doe@example.com' })
  email: string;

  @ApiProperty({ description: 'User roles', example: ['user', 'admin'], enum: Role, isArray: true })
  roles: string[];
}
