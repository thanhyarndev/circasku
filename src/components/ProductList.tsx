'use client';

import { useState } from 'react';

interface Product {
  _id: string;
  ID: number;
  Product_name: string;
  type_tag: number; // -1: Chưa xác định, 0: tem thường, 1: tem gập
  createdAt?: string;
  updatedAt?: string;
}

interface ProductListProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

export default function ProductList({ products, onEdit, isLoading = false }: ProductListProps) {
  const [editingProducts, setEditingProducts] = useState<{ [key: string]: number }>({});
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  
  // States cho bộ lọc và tìm kiếm
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<number>(-2); // -2: Tất cả, -1: Chưa xác định, 0: Tem thường, 1: Tem gập

  const showToastMessage = (message: string, type: 'success' | 'error') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Lọc và tìm kiếm sản phẩm
  const filteredProducts = products.filter(product => {
    // Lọc theo loại tem
    if (filterType !== -2 && product.type_tag !== filterType) {
      return false;
    }
    
    // Tìm kiếm theo tên hoặc ID
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const nameMatch = product.Product_name.toLowerCase().includes(searchLower);
      const idMatch = product.ID.toString().includes(searchTerm);
      return nameMatch || idMatch;
    }
    
    return true;
  });

  const getTagTypeColor = (typeTag: number) => {
    switch (typeTag) {
      case 0:
        return 'bg-green-100 text-green-800';
      case 1:
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTagTypeLabel = (typeTag: number) => {
    switch (typeTag) {
      case 0: return 'Tem thường';
      case 1: return 'Tem gập';
      default: return 'Chưa xác định';
    }
  };

  const handleTypeTagChange = (productId: string, newTypeTag: number) => {
    setEditingProducts(prev => ({
      ...prev,
      [productId]: newTypeTag
    }));
  };

  const handleSave = async (product: Product) => {
    const newTypeTag = editingProducts[product._id];
    if (newTypeTag === undefined || newTypeTag === product.type_tag) {
      // Không có thay đổi
      setEditingProducts(prev => {
        const newState = { ...prev };
        delete newState[product._id];
        return newState;
      });
      return;
    }

    try {
      const response = await fetch(`/api/products/${product._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type_tag: newTypeTag
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Cập nhật local state
        onEdit({ ...product, type_tag: newTypeTag });
        
        // Xóa khỏi editing state
        setEditingProducts(prev => {
          const newState = { ...prev };
          delete newState[product._id];
          return newState;
        });
        
        showToastMessage('Cập nhật loại tem thành công!', 'success');
      } else {
        showToastMessage('Không thể cập nhật sản phẩm: ' + (data.error || 'Lỗi không xác định'), 'error');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      showToastMessage('Lỗi kết nối mạng', 'error');
    }
  };

  const handleCancel = (productId: string) => {
    setEditingProducts(prev => {
      const newState = { ...prev };
      delete newState[productId];
      return newState;
    });
  };

  const isEditing = (productId: string) => {
    return editingProducts[productId] !== undefined;
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterType(-2);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <p className="text-gray-500 text-lg">Không có sản phẩm nào</p>
        <p className="text-gray-400 text-sm mt-2">Hãy thêm sản phẩm đầu tiên!</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header với bộ lọc và tìm kiếm */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Danh sách Sản phẩm</h3>
              <p className="text-sm text-gray-500 mt-1">
                Tổng cộng: {filteredProducts.length} / {products.length} sản phẩm
              </p>
            </div>
            
            {/* Bộ lọc và tìm kiếm */}
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              {/* Tìm kiếm */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm theo tên hoặc ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              
              {/* Bộ lọc loại tem */}
              <select
                value={filterType}
                onChange={(e) => setFilterType(parseInt(e.target.value))}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={-2}>Tất cả loại tem</option>
                <option value={-1}>Chưa xác định</option>
                <option value={0}>Tem thường</option>
                <option value={1}>Tem gập</option>
              </select>
              
              {/* Nút xóa bộ lọc */}
              {(searchTerm || filterType !== -2) && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors"
                >
                  Xóa bộ lọc
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Bảng sản phẩm */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tên sản phẩm
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Loại tem
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
                      </svg>
                      <h3 className="mt-2 text-sm font-medium text-gray-900">Không tìm thấy sản phẩm</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {searchTerm ? `Không có sản phẩm nào khớp với "${searchTerm}"` : 'Hãy thử thay đổi bộ lọc'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {product.ID}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                        {product.Product_name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <select
                          value={editingProducts[product._id] ?? product.type_tag}
                          onChange={(e) => handleTypeTagChange(product._id, parseInt(e.target.value))}
                          className={`text-sm font-semibold rounded-full px-3 py-2 border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 ${getTagTypeColor(editingProducts[product._id] ?? product.type_tag)}`}
                        >
                          <option value={-1}>Chưa xác định</option>
                          <option value={0}>Tem thường</option>
                          <option value={1}>Tem gập</option>
                        </select>
                        
                        {isEditing(product._id) && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleSave(product)}
                              className="bg-green-600 text-white text-xs font-medium px-3 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                            >
                              Xác nhận
                            </button>
                            <button
                              onClick={() => handleCancel(product._id)}
                              className="bg-gray-500 text-white text-xs font-medium px-3 py-2 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                            >
                              Hủy bỏ
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 right-4 z-50">
          <div className={`rounded-lg shadow-lg p-4 max-w-sm transform transition-all duration-300 ${
            toastType === 'success' 
              ? 'bg-green-500 text-white' 
              : 'bg-red-500 text-white'
          }`}>
            <div className="flex items-center space-x-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                toastType === 'success' ? 'bg-green-600' : 'bg-red-600'
              }`}>
                {toastType === 'success' ? (
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>
              <p className="font-medium">{toastMessage}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
