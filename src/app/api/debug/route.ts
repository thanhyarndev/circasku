import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import mongoose from 'mongoose';

// GET - Debug endpoint để kiểm tra MongoDB
export async function GET() {
  try {
    console.log('=== DEBUG API ===');
    await connectDB();
    
    // Kiểm tra collections - sử dụng mongoose.connection thay vì Product.db.db
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database connection not available');
    }
    
    const collections = await db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));
    
    // Kiểm tra collection đầu tiên
    if (collections.length > 0) {
      const firstCollection = collections[0].name;
      console.log('First collection:', firstCollection);
      
      // Lấy một document mẫu từ collection đầu tiên
      const sampleDoc = await db.collection(firstCollection).findOne({});
      console.log('Sample document from first collection:', sampleDoc);
      
      // Kiểm tra cấu trúc của document
      if (sampleDoc) {
        console.log('Document keys:', Object.keys(sampleDoc));
        console.log('Document structure:', JSON.stringify(sampleDoc, null, 2));
      }
    }
    
    // Kiểm tra model Product
    const productCount = await Product.countDocuments();
    console.log('Product model count:', productCount);
    
    if (productCount > 0) {
      const sampleProduct = await Product.findOne({});
      console.log('Sample product from model:', sampleProduct);
    }
    
    return NextResponse.json({ 
      success: true, 
      data: {
        collections: collections.map(c => c.name),
        productCount,
        sampleProduct: productCount > 0 ? await Product.findOne({}) : null
      }
    }, { status: 200 });
  } catch (error) {
    console.error('Debug API error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Debug failed: ' + (error instanceof Error ? error.message : String(error))
    }, { status: 500 });
  }
}
