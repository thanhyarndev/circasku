'use client';

import { useState, useEffect } from 'react';

interface Product {
  _id?: string;
  ID: number;
  Product_name: string;
  type_tag: number; // -1: Chưa xác định, 0: tem thường, 1: tem gập
}

interface ProductFormProps {
  product?: Product;
  onSubmit: (product: Omit<Product, '_id'>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function ProductForm({ product, onSubmit, onCancel, isLoading = false }: ProductFormProps) {
  const [formData, setFormData] = useState<Omit<Product, '_id'>>({
    ID: 0,
    Product_name: '',
    type_tag: -1
  });

  useEffect(() => {
    if (product) {
      setFormData({
        ID: product.ID,
        Product_name: product.Product_name,
        type_tag: product.type_tag
      });
    }
  }, [product]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.ID > 0 && formData.Product_name.trim()) {
      onSubmit(formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'ID' ? parseInt(value) || 0 : value
    }));
  };

  const getTagTypeLabel = (type: number) => {
    switch (type) {
      case 0: return 'Tem thường';
      case 1: return 'Tem gập';
      default: return 'Chưa xác định';
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">
        {product ? 'Chỉnh sửa Sản phẩm' : 'Thêm Sản phẩm mới'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="ID" className="block text-sm font-medium text-gray-700 mb-1">
            ID Sản phẩm *
          </label>
          <input
            type="number"
            id="ID"
            name="ID"
            value={formData.ID}
            onChange={handleChange}
            required
            min="1"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Nhập ID sản phẩm"
          />
        </div>

        <div>
          <label htmlFor="Product_name" className="block text-sm font-medium text-gray-700 mb-1">
            Tên sản phẩm *
          </label>
          <input
            type="text"
            id="Product_name"
            name="Product_name"
            value={formData.Product_name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Nhập tên sản phẩm"
          />
        </div>

        <div>
          <label htmlFor="type_tag" className="block text-sm font-medium text-gray-700 mb-1">
            Loại tem
          </label>
          <select
            id="type_tag"
            name="type_tag"
            value={formData.type_tag}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={-1}>Chưa xác định</option>
            <option value={0}>Tem thường</option>
            <option value={1}>Tem gập</option>
          </select>
        </div>

        <div className="flex space-x-3 pt-4">
          <button
            type="submit"
            disabled={isLoading || formData.ID <= 0 || !formData.Product_name.trim()}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Đang xử lý...' : (product ? 'Cập nhật' : 'Thêm mới')}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
}
