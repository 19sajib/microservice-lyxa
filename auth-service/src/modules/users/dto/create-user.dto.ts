import { Role } from '../../../common/role.enum';

export class CreateUserDto {
  email: string;
  password?: string;
  name: string;
  roles: Role[];
}
