'use client';

import { useState, useEffect } from 'react';
import ProductList from './ProductList';

interface Product {
  _id: string;
  ID: number;
  Product_name: string;
  type_tag: number; // -1: Chưa xác định, 0: tem thường, 1: tem gập
  createdAt?: string;
  updatedAt?: string;
}

export default function ProductManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Fetch products
  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/products');
      const data = await response.json();
      
      if (data.success) {
        console.log('Fetched products:', data.data); // Debug log
        setProducts(data.data);
      } else {
        setMessage({ type: 'error', text: 'Không thể tải danh sách sản phẩm' });
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setMessage({ type: 'error', text: 'Lỗi kết nối mạng' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Update product (chỉ loại tem)
  const handleUpdateProduct = async (updatedProduct: Product) => {
    try {
      const response = await fetch(`/api/products/${updatedProduct._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ID: updatedProduct.ID,
          Product_name: updatedProduct.Product_name,
          type_tag: updatedProduct.type_tag
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'Cập nhật loại tem thành công!' });
        // Cập nhật local state
        setProducts(prevProducts => 
          prevProducts.map(p => 
            p._id === updatedProduct._id ? updatedProduct : p
          )
        );
      } else {
        setMessage({ type: 'error', text: data.error || 'Không thể cập nhật sản phẩm' });
      }
    } catch (error) {
      console.error('Error updating product:', error);
      setMessage({ type: 'error', text: 'Lỗi kết nối mạng' });
    }
  };

  // Clear message after 5 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý Sản phẩm</h1>
        <p className="text-gray-600">Hệ thống quản lý sản phẩm với MongoDB Atlas</p>
      </div>

      {/* Message */}
      {message && (
        <div className={`mb-6 p-4 rounded-md ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      {/* Product List */}
      <ProductList
        products={products}
        onEdit={handleUpdateProduct}
        onDelete={() => {}} // Không sử dụng
        isLoading={isLoading}
      />
    </div>
  );
}
