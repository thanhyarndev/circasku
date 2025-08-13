import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';

// GET - Lấy product theo ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json({ 
        success: false, 
        error: 'Product ID is required' 
      }, { status: 400 });
    }

    await connectDB();
    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json({ 
        success: false, 
        error: 'Product not found' 
      }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      data: product 
    }, { status: 200 });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch product' 
    }, { status: 500 });
  }
}

// PUT - Cập nhật product
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const { type_tag } = body;

    if (!id) {
      return NextResponse.json({ 
        success: false, 
        error: 'Product ID is required' 
      }, { status: 400 });
    }

    if (type_tag === undefined || type_tag === null) {
      return NextResponse.json({ 
        success: false, 
        error: 'Type tag is required' 
      }, { status: 400 });
    }

    await connectDB();
    
    // Tìm sản phẩm trước khi cập nhật
    const existingProduct = await Product.findById(id);
    
    if (!existingProduct) {
      return NextResponse.json({ 
        success: false, 
        error: 'Product not found' 
      }, { status: 404 });
    }
    
    // Cập nhật type_tag
    const updateResult = await Product.updateOne(
      { _id: id },
      { type_tag }
    );
    
    if (updateResult.matchedCount === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'Product not found for update' 
      }, { status: 404 });
    }
    
    // Lấy sản phẩm sau khi cập nhật
    const updatedProduct = await Product.findById(id);

    if (!updatedProduct) {
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to fetch updated product' 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      data: updatedProduct 
    }, { status: 200 });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to update product: ' + (error instanceof Error ? error.message : String(error))
    }, { status: 500 });
  }
}

// DELETE - Xóa product
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json({ 
        success: false, 
        error: 'Product ID is required' 
      }, { status: 400 });
    }

    await connectDB();
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return NextResponse.json({ 
        success: false, 
        error: 'Product not found' 
      }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Product deleted successfully' 
    }, { status: 200 });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to delete product' 
    }, { status: 500 });
  }
}
