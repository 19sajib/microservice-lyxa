import { prop, modelOptions } from '@typegoose/typegoose';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';


@modelOptions({
  schemaOptions: {
    timestamps: true, 
    collection: 'products',
  },
})
export class Product extends TimeStamps {
  @prop({ required: true })
  name: string;

  @prop({ required: true })
  description: string;

  @prop({ required: true })
  price: number;

  @prop({ required: true })
  stock: number;

  @prop({ required: true, index: true })
  ownerId: string;

}
