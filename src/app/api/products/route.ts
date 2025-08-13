import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';

// GET - Lấy tất cả products
export async function GET() {
  try {
    await connectDB();
    
    const products = await Product.find({}).sort({ createdAt: -1 });
    
    return NextResponse.json({ 
      success: true, 
      data: products 
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch products' 
    }, { status: 500 });
  }
}

// POST - Tạo product mới
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ID, Product_name, type_tag } = body;

    if (!ID || !Product_name) {
      return NextResponse.json({ 
        success: false, 
        error: 'Product ID and Product name are required' 
      }, { status: 400 });
    }

    await connectDB();
    
    // Kiểm tra xem ID đã tồn tại chưa
    const existingProduct = await Product.findOne({ ID });
    if (existingProduct) {
      return NextResponse.json({ 
        success: false, 
        error: 'Product ID already exists' 
      }, { status: 400 });
    }
    
    const product = await Product.create({
      ID,
      Product_name,
      type_tag: type_tag || -1
    });

    console.log('Created product:', JSON.stringify(product, null, 2));

    return NextResponse.json({ 
      success: true, 
      data: product 
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to create product' 
    }, { status: 500 });
  }
}
