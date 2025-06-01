import { prop, modelOptions } from '@typegoose/typegoose';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { Role } from '../../../common/role.enum';

@modelOptions({
  schemaOptions: {
    timestamps: true, 
    collection: 'users',
  },
})
export class User extends TimeStamps {
  @prop({ required: true, unique: true, index: true })
  email: string;

  @prop({ required: true, select: false }) 
  password?: string;

  @prop({ required: true })
  name: string;

  @prop({ type: () => [String], enum: Role, default: [Role.User] })
  roles: Role[];
  
}
