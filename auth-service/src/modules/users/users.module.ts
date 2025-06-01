import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './schemas/user.schema';
import { TypegooseModule } from 'nestjs-typegoose';

@Module({
  imports: [
    TypegooseModule.forFeature([User]),
  ],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}