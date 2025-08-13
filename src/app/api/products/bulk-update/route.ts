import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';

// POST - Cập nhật hàng loạt sản phẩm
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { ids, type_tag } = body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'Danh sách ID sản phẩm là bắt buộc và phải là mảng' 
      }, { status: 400 });
    }

    if (type_tag === undefined || type_tag === null) {
      return NextResponse.json({ 
        success: false, 
        error: 'Type tag là bắt buộc' 
      }, { status: 400 });
    }

    await connectDB();
    
    // Tìm tất cả sản phẩm có ID trong danh sách
    const productsToUpdate = await Product.find({ ID: { $in: ids } });
    
    if (productsToUpdate.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'Không tìm thấy sản phẩm nào với ID đã cung cấp' 
      }, { status: 404 });
    }

    console.log(`Tìm thấy ${productsToUpdate.length} sản phẩm để cập nhật`);

    // Cập nhật tất cả sản phẩm
    const updateResult = await Product.updateMany(
      { ID: { $in: ids } },
      { type_tag }
    );

    console.log(`Đã cập nhật ${updateResult.modifiedCount} sản phẩm`);

    // Lấy danh sách sản phẩm đã cập nhật
    const updatedProducts = await Product.find({ ID: { $in: ids } });

    return NextResponse.json({ 
      success: true, 
      data: {
        totalFound: productsToUpdate.length,
        totalUpdated: updateResult.modifiedCount,
        products: updatedProducts
      },
      message: `Đã cập nhật thành công ${updateResult.modifiedCount} sản phẩm`
    }, { status: 200 });
  } catch (error) {
    console.error('Error bulk updating products:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Không thể cập nhật sản phẩm: ' + (error instanceof Error ? error.message : String(error))
    }, { status: 500 });
  }
}
