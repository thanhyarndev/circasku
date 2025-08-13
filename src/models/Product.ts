import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  ID: number;
  Product_name: string;
  type_tag: number; // -1: Chưa xác định, 0: tem thường, 1: tem gập
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema({
  ID: {
    type: Number,
    required: [true, 'Product ID is required'],
    unique: true
  },
  Product_name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [200, 'Product name cannot be more than 200 characters']
  },
  type_tag: {
    type: Number,
    required: [true, 'Type tag is required'],
    enum: [-1, 0, 1],
    default: -1
  }
}, {
  timestamps: true,
  strict: false, // Cho phép linh hoạt với collection có sẵn
  collection: undefined // Để sử dụng collection thực tế
});

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
