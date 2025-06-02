import { Injectable } from '@nestjs/common';
import { DocumentType, ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private readonly userModel: ReturnModelType<typeof User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<DocumentType<User>> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findByEmail(email: string): Promise<DocumentType<User> | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findByEmailForLogin(email: string): Promise<DocumentType<User> | null> {
    return this.userModel.findOne({ email }).select('+password').exec();
  }

  async findById(id: string): Promise<DocumentType<User> | null> {
    return this.userModel.findById(id).exec();
  }

  async findAll(): Promise<DocumentType<User>[]> {
    return this.userModel.find().exec();
  }

}
