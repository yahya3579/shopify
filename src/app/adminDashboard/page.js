'use client';

import { Plus, Trash2, MoreHorizontal } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '../../components/AdminLayout';
import { fetchInventoryByProduct } from '../../lib/inventoryApi';
import { toast } from 'sonner';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('all');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showMoreActionsMenu, setShowMoreActionsMenu] = useState(false);
  const [inventoryData, setInventoryData] = useState({});
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchField, setShowSearchField] = useState(false);
  const moreActionsRef = useRef(null);
  const searchInputRef = useRef(null);
  const router = useRouter();

  // Fetch products
  const fetchProducts = async () => {
    try {
      setProductsLoading(true);
      const params = new URLSearchParams();
      
      if (selectedTab === 'active') params.append('status', 'Active');
      if (selectedTab === 'draft') params.append('status', 'Draft');
      if (selectedTab === 'archived') params.append('status', 'Archived');
      
      console.log('Fetching products with params:', params.toString());
      const response = await fetch(`/api/products?${params.toString()}`);
      const data = await response.json();
      
      console.log('Products API Response:', data);
      
      if (data.success) {
        console.log('Setting products:', data.data);
        const productsData = data.data || [];
        setProducts(productsData);
        
        // Fetch inventory data for each product
        await fetchInventoryForProducts(productsData);
      } else {
        console.error('API returned success: false', data);
        setProducts([]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setProductsLoading(false);
    }
  };

  // Fetch inventory data for all products
  const fetchInventoryForProducts = async (productsData) => {
    try {
      const inventoryPromises = productsData.map(async (product) => {
        try {
          const response = await fetchInventoryByProduct(product._id);
          return {
            productId: product._id,
            inventory: response.data
          };
        } catch (error) {
          console.error(`Error fetching inventory for product ${product._id}:`, error);
          return {
            productId: product._id,
            inventory: {
              available: 0,
              onHand: 0
            }
          };
        }
      });

      const results = await Promise.all(inventoryPromises);
      
      const inventoryMap = {};
      results.forEach(({ productId, inventory }) => {
        inventoryMap[productId] = inventory;
      });
      
      setInventoryData(inventoryMap);
    } catch (error) {
      console.error('Error fetching inventory data:', error);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/');
        return;
      }

      // Verify token is still valid by calling the API
      try {
        const response = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          // Token is invalid, remove it and redirect
          localStorage.removeItem('token');
          router.push('/');
        }
      } catch (error) {
        console.error('Auth check error:', error);
        localStorage.removeItem('token');
        router.push('/');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  // Fetch products when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchProducts();
    }
  }, [isAuthenticated, selectedTab]);

  // Close more actions menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (moreActionsRef.current && !moreActionsRef.current.contains(event.target)) {
        setShowMoreActionsMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Bulk action handlers
  const handleSetAsDraft = async () => {
    if (selectedProducts.length === 0) return;
    
    try {
      // Update each selected product to Draft status
      const updatePromises = selectedProducts.map(productId =>
        fetch(`/api/products/update/${productId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'Draft' })
        })
      );
      
      await Promise.all(updatePromises);
      
      // Refresh products list
      await fetchProducts();
      setSelectedProducts([]);
      toast.success('Products updated to Draft status successfully!');
    } catch (error) {
      console.error('Error updating products:', error);
      toast.error('Failed to update products');
    }
  };

  const handleSetAsActive = async () => {
    if (selectedProducts.length === 0) return;
    
    try {
      // Update each selected product to Active status
      const updatePromises = selectedProducts.map(productId =>
        fetch(`/api/products/update/${productId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'Active' })
        })
      );
      
      await Promise.all(updatePromises);
      
      // Refresh products list
      await fetchProducts();
      setSelectedProducts([]);
      toast.success('Products updated to Active status successfully!');
    } catch (error) {
      console.error('Error updating products:', error);
      toast.error('Failed to update products');
    }
  };

  const handleDeleteProducts = async () => {
    if (selectedProducts.length === 0) return;
    
    // Show confirmation toast
    toast.error(
      `Are you sure you want to delete ${selectedProducts.length} product(s)? This action cannot be undone.`,
      {
        duration: 10000, // Show for 10 seconds
        action: {
          label: 'Delete',
          onClick: () => confirmDeleteProducts(),
        },
        cancel: {
          label: 'Cancel',
          onClick: () => {},
        },
      }
    );
  };

  const confirmDeleteProducts = async () => {
    try {
      const deletePromises = selectedProducts.map(productId =>
        fetch(`/api/products/update/${productId}`, {
          method: 'DELETE'
        })
      );
      
      await Promise.all(deletePromises);
      
      // Refresh products list
      await fetchProducts();
      setSelectedProducts([]);
      toast.success('Products deleted successfully!');
    } catch (error) {
      console.error('Error deleting products:', error);
      toast.error('Failed to delete products');
    }
  };

  // Export products handler
  const handleExportProducts = async () => {
    try {
      const params = new URLSearchParams();
      
      // Add current filter status to export
      if (selectedTab === 'active') params.append('status', 'Active');
      if (selectedTab === 'draft') params.append('status', 'Draft');
      if (selectedTab === 'archived') params.append('status', 'Archived');
      
      const response = await fetch(`/api/products/export?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to export products');
      }
      
      // Get the blob data
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      
      // Get filename from response headers or create default
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = 'products-export.csv';
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }
      
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success('Products exported successfully!');
    } catch (error) {
      console.error('Error exporting products:', error);
      toast.error('Failed to export products');
    }
  };

  // Download CSV template handler
  const handleDownloadTemplate = () => {
    const headers = [
      'Title',
      'Description', 
      'Category',
      'Price',
      'Compare At Price',
      'Cost Per Item',
      'SKU',
      'Barcode',
      'Inventory Tracked',
      'Quantity',
      'Physical Product',
      'Weight Value',
      'Weight Unit',
      'Status',
      'Product Type',
      'Vendor',
      'Tags',
      'Theme Template',
      'Publishing Channels',
      'Is Gift Card',
      'Denominations',
      'Gift Card Template',
      'Media URLs',
      'Created At'
    ];

    const sampleRow = [
      'Sample Product',
      'This is a sample product description',
      'Electronics',
      '99.99',
      '119.99',
      '50.00',
      'SAMPLE-001',
      '123456789',
      'TRUE',
      '100',
      'TRUE',
      '1.5',
      'kg',
      'Active',
      'Electronics',
      'Sample Vendor',
      'sample, electronics, test',
      'Default product',
      'Online Store, Point of Sale',
      'FALSE',
      '',
      '',
      'https://example.com/image1.jpg, https://example.com/image2.jpg',
      new Date().toISOString()
    ];

    const csvContent = [headers.join(','), sampleRow.join(',')].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'products-template.csv';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    toast.success('CSV template downloaded!');
  };

  // Import products handler
  const handleImportProducts = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    // Reset the input value so the same file can be selected again
    event.target.value = '';
    
    if (!file.name.endsWith('.csv')) {
      toast.error('Please select a CSV file');
      return;
    }
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      toast.loading('Importing products...', { id: 'import-toast' });
      
      const response = await fetch('/api/products/import', {
        method: 'POST',
        body: formData,
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast.success(
          `Successfully imported ${result.imported} products! ${result.skipped > 0 ? `${result.skipped} rows were skipped.` : ''}`,
          { id: 'import-toast' }
        );
        
        // Show errors if any
        if (result.errors && result.errors.length > 0) {
          console.warn('Import errors:', result.errors);
          toast.warning(`Some rows had errors: ${result.errors.slice(0, 3).join(', ')}${result.errors.length > 3 ? '...' : ''}`);
        }
        
        // Refresh products list
        await fetchProducts();
      } else {
        toast.error(result.error || 'Failed to import products', { id: 'import-toast' });
        
        // Show expected headers if provided
        if (result.expectedHeaders) {
          console.log('Expected CSV headers:', result.expectedHeaders);
          toast.error(`CSV format error. Expected headers: ${result.expectedHeaders.slice(0, 5).join(', ')}...`);
        }
      }
    } catch (error) {
      console.error('Error importing products:', error);
      toast.error('Failed to import products', { id: 'import-toast' });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#f1f1f1]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#303030] mx-auto mb-4"></div>
          <p className="text-[#303030]">Loading...</p>
        </div>
      </div>
    );
  }

  // Helper functions
  const toggleProductSelection = (productId) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter(id => id !== productId));
    } else {
      setSelectedProducts([...selectedProducts, productId]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map(p => p._id));
    }
  };

  const getTotalInventory = (product) => {
    if (!product.inventory || product.inventory.length === 0) return 0;
    // Check for 'Shop location' and return its quantity
    const shopLocation = product.inventory.find(inv => inv.location === 'Shop location');
    return shopLocation ? shopLocation.quantity || 0 : 0;
  };

  const getVariantsCount = (product) => {
    if (!product.variants || product.variants.length === 0) return 0;
    return product.variants.reduce((total, variant) => {
      return total + (variant.optionValues?.length || 0);
    }, 0) || 1;
  };

  // Filter products based on search query
  const filteredProducts = products.filter(product => {
    if (!searchQuery.trim()) return true;
    return product.title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (!isAuthenticated) {
    return null;
  }

  // Check if products exist
  const hasProducts = products.length > 0;
  const hasFilteredProducts = filteredProducts.length > 0;

  // Check if all selected products are Draft
  const selectedProductsData = products.filter(p => selectedProducts.includes(p._id));
  const allSelectedAreDraft = selectedProductsData.length > 0 && selectedProductsData.every(p => p.status === 'Draft');
  const allSelectedAreActive = selectedProductsData.length > 0 && selectedProductsData.every(p => p.status === 'Active');

  return (
    <AdminLayout>
      <div className="bg-[#f1f1f1]">
            {/* Products Page */}
            <div className="mb-4 sm:mb-6">
              {/* Page Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 flex items-center justify-center">
                    <svg className="w-4 h-4 text-[#303030]" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M11 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2"></path>
                      <path fillRule="evenodd" d="M9.276 1.5c-1.02 0-1.994.415-2.701 1.149l-4.254 4.417a2.75 2.75 0 0 0 .036 3.852l2.898 2.898a2.5 2.5 0 0 0 3.502.033l4.747-4.571a3.25 3.25 0 0 0 .996-2.341v-2.187a3.25 3.25 0 0 0-3.25-3.25zm-1.62 2.19a2.24 2.24 0 0 1 1.62-.69h1.974c.966 0 1.75.784 1.75 1.75v2.187c0 .475-.194.93-.536 1.26l-4.747 4.572a1 1 0 0 1-1.401-.014l-2.898-2.898a1.25 1.25 0 0 1-.016-1.75l4.253-4.418Z"></path>
                    </svg>
                  </div>
                  <h1 className="text-[18px] sm:text-[20px] font-semibold text-[#303030]">Products</h1>
                </div>

                {/* Action Buttons - Only show when products exist */}
                {hasProducts && (
                  <div className="flex flex-wrap items-center gap-2">
                    <button 
                      onClick={handleExportProducts}
                      className="px-3 sm:px-4 py-2 border border-[#c9cccf] text-[#303030] text-[12px] sm:text-[13px] font-medium rounded-lg hover:bg-gray-50"
                    >
                      Export
                    </button>
                    {/* <button 
                      onClick={handleDownloadTemplate}
                      className="px-3 sm:px-4 py-2 border border-[#c9cccf] text-[#303030] text-[12px] sm:text-[13px] font-medium rounded-lg hover:bg-gray-50"
                    >
                      Download Template
                    </button> */}
                    <label className="px-3 sm:px-4 py-2 border border-[#c9cccf] text-[#303030] text-[12px] sm:text-[13px] font-medium rounded-lg hover:bg-gray-50 cursor-pointer">
                      Import
                      <input
                        type="file"
                        accept=".csv"
                        onChange={handleImportProducts}
                        className="hidden"
                      />
                    </label>
                    <a href="/adminDashboard/AddProduct" className="px-3 sm:px-4 py-2 bg-[#303030] text-white text-[12px] sm:text-[13px] font-semibold rounded-lg hover:bg-[#1a1a1a] whitespace-nowrap">
                      Add product
                    </a>
                  </div>
                )}
              </div>

              {/* Rounded Card Container */}
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                {/* Index Filters */}
                <div className="border-b border-[#e1e1e1]">
                  <div className="px-4 sm:px-6 py-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      {/* Tabs */}
                      <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto">
                        <button 
                          onClick={() => setSelectedTab('all')}
                          className={`px-3 sm:px-4 py-2 text-[12px] sm:text-[13px] font-medium rounded-lg whitespace-nowrap ${selectedTab === 'all' ? 'text-[#303030] bg-[#f1f1f1]' : 'text-[#5c5f62] hover:bg-gray-100'}`}
                        >
                          All
                        </button>
                        <button 
                          onClick={() => setSelectedTab('active')}
                          className={`px-3 sm:px-4 py-2 text-[12px] sm:text-[13px] font-medium rounded-lg whitespace-nowrap ${selectedTab === 'active' ? 'text-[#303030] bg-[#f1f1f1]' : 'text-[#5c5f62] hover:bg-gray-100'}`}
                        >
                          Active
                        </button>
                        <button 
                          onClick={() => setSelectedTab('draft')}
                          className={`px-3 sm:px-4 py-2 text-[12px] sm:text-[13px] font-medium rounded-lg whitespace-nowrap ${selectedTab === 'draft' ? 'text-[#303030] bg-[#f1f1f1]' : 'text-[#5c5f62] hover:bg-gray-100'}`}
                        >
                          Draft
                        </button>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => {
                            setShowSearchField(!showSearchField);
                            if (!showSearchField && searchInputRef.current) {
                              setTimeout(() => searchInputRef.current.focus(), 100);
                            }
                          }}
                          className="p-2 text-[#5c5f62] hover:bg-gray-100 rounded"
                        >
                          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                            <path fillRule="evenodd" d="M10.323 11.383a5.5 5.5 0 1 1-3.323-9.883 5.5 5.5 0 0 1 4.383 8.823l2.897 2.897a.749.749 0 1 1-1.06 1.06zm.677-4.383c0 2.21-1.79 4-4 4s-4-1.79-4-4 1.79-4 4-4 4 1.79 4 4"></path>
                          </svg>
                        </button>
                        <button className="hidden sm:block p-2 text-[#5c5f62] hover:bg-gray-100 rounded">
                          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M1 4a.75.75 0 0 1 .75-.75h12.5a.75.75 0 0 1 0 1.5h-12.5a.75.75 0 0 1-.75-.75"></path>
                            <path d="M4.75 12a.75.75 0 0 1 .75-.75h5a.75.75 0 0 1 0 1.5h-5a.75.75 0 0 1-.75-.75"></path>
                            <path d="M3.5 7.25a.75.75 0 0 0 0 1.5h9a.75.75 0 0 0 0-1.5z"></path>
                          </svg>
                        </button>
                        <button className="hidden sm:block p-2 text-[#5c5f62] hover:bg-gray-100 rounded">
                          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M5.75 4.06v7.69a.75.75 0 0 1-1.5 0v-7.69l-1.72 1.72a.749.749 0 1 1-1.06-1.06l3-3a.75.75 0 0 1 1.06 0l3 3a.749.749 0 1 1-1.06 1.06z"></path>
                            <path d="M11.75 4.25a.75.75 0 0 0-1.5 0v7.69l-1.72-1.72a.749.749 0 1 0-1.06 1.06l3 3a.75.75 0 0 0 1.06 0l3-3a.749.749 0 1 0-1.06-1.06l-1.72 1.72z"></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expandable Search Input */}
                {showSearchField && (
                  <div className="px-4 sm:px-6 py-3 border-b border-[#e1e1e1] bg-white">
                    <div className="relative max-w-md">
                      <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-[#c9cccf] text-[#303030] text-[13px] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        ref={searchInputRef}
                      />
                      <svg 
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#616161]" 
                        viewBox="0 0 16 16" 
                        fill="currentColor"
                      >
                        <path fillRule="evenodd" d="M10.323 11.383a5.5 5.5 0 1 1-3.323-9.883 5.5 5.5 0 0 1 4.383 8.823l2.897 2.897a.749.749 0 1 1-1.06 1.06zm.677-4.383c0 2.21-1.79 4-4 4s-4-1.79-4-4 1.79-4 4-4 4 1.79 4 4"></path>
                      </svg>
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery('')}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#616161] hover:text-[#303030]"
                        >
                          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M8 8.707l3.646 3.647.708-.707L8.707 8l3.647-3.646-.707-.708L8 7.293 4.354 3.646l-.707.708L7.293 8l-3.646 3.646.707.708L8 8.707z"></path>
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Content: Empty State or Products Table */}
                {productsLoading ? (
                  <div className="px-8 py-16 flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#303030]"></div>
                  </div>
                ) : !hasProducts ? (
                  /* Empty State */
                  <div className="px-8 py-16">
                    <div className="flex items-center justify-between max-w-5xl mx-auto">
                      <div className="flex flex-col gap-1">
                        <h2 className="text-[20px] font-semibold text-[#303030]" tabIndex="-1">
                          Add your products
                        </h2>
                        <p className="text-[13px] text-[#616161]">
                          Start by stocking your store with products your customers will love
                        </p>
                        <div className="flex flex-wrap gap-3 mt-4">
                          <a href="/adminDashboard/AddProduct" className="px-4 py-2 bg-[#303030] text-white text-[13px] font-semibold rounded-lg hover:bg-[#1a1a1a] transition-colors flex items-center gap-2">
                            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                              <path d="M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5z"></path>
                            </svg>
                            <span className="font-semibold">Add product</span>
                          </a>
                          {/* <button 
                            onClick={handleDownloadTemplate}
                            className="px-4 py-2 border border-[#c9cccf] text-[#303030] text-[13px] font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                          >
                            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                              <path d="M8.75 2.25a.75.75 0 0 0-1.5 0v6.69l-1.72-1.72a.749.749 0 1 0-1.06 1.06l3 3a.75.75 0 0 0 1.06 0l3-3a.749.749 0 1 0-1.06-1.06l-1.72 1.72z"></path>
                              <path d="M14.5 11.75a.75.75 0 0 0-1.5 0v.8a.75.75 0 0 1-.75.75h-8.5a.75.75 0 0 1-.75-.75v-.8a.75.75 0 0 0-1.5 0v.8a2.25 2.25 0 0 0 2.25 2.25h8.5a2.25 2.25 0 0 0 2.25-2.25z"></path>
                            </svg>
                            <span className="font-medium">Download Template</span>
                          </button> */}
                          <label className="px-4 py-2 border border-[#c9cccf] text-[#303030] text-[13px] font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 cursor-pointer">
                            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                              <path d="M8.75 2.25a.75.75 0 0 0-1.5 0v6.69l-1.72-1.72a.749.749 0 1 0-1.06 1.06l3 3a.75.75 0 0 0 1.06 0l3-3a.749.749 0 1 0-1.06-1.06l-1.72 1.72z"></path>
                              <path d="M14.5 11.75a.75.75 0 0 0-1.5 0v.8a.75.75 0 0 1-.75.75h-8.5a.75.75 0 0 1-.75-.75v-.8a.75.75 0 0 0-1.5 0v.8a2.25 2.25 0 0 0 2.25 2.25h8.5a2.25 2.25 0 0 0 2.25-2.25z"></path>
                            </svg>
                            <span className="font-medium">Import</span>
                            <input
                              type="file"
                              accept=".csv"
                              onChange={handleImportProducts}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>

                      {/* Product Image */}
                      <div className="flex items-center justify-center">
                        <img src="/productimage.svg" alt="Start by stocking your store with products your customers will love" className="w-65 h-65 object-contain" />
                      </div>
                    </div>

                    {/* Product Sourcing Section */}
                    <div className="bg-[#f6f6f7] px-8 py-6 border-t border-[#e1e1e1] -mx-8 -mb-16 mt-16">
                      <div className="flex items-center justify-center">
                        <div className="max-w-4xl w-full">
                          <div className="flex flex-col items-start gap-1">
                            <h3 className="text-[16px] font-semibold text-[#303030]" tabIndex="-1">
                              Find products to sell
                            </h3>
                            <p className="text-[13px] text-[#616161]">
                              Have dropshipping or print on demand products shipped directly from the supplier to your customer, and only pay for what you sell.
                            </p>
                            <div className="mt-3">
                              <div className="flex flex-wrap gap-2">
                                <button className="px-4 py-2 border border-[#c9cccf] text-[#303030] text-[13px] font-medium rounded-lg hover:bg-white transition-colors">
                                  <span className="font-medium">Browse product sourcing apps</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : !hasFilteredProducts ? (
                  /* No Search Results */
                  <div className="px-8 py-16 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <svg className="w-16 h-16 text-[#8a8a8a]" viewBox="0 0 16 16" fill="currentColor">
                        <path fillRule="evenodd" d="M10.323 11.383a5.5 5.5 0 1 1-3.323-9.883 5.5 5.5 0 0 1 4.383 8.823l2.897 2.897a.749.749 0 1 1-1.06 1.06zm.677-4.383c0 2.21-1.79 4-4 4s-4-1.79-4-4 1.79-4 4-4 4 1.79 4 4"></path>
                      </svg>
                      <div>
                        <h3 className="text-[16px] font-medium text-[#303030] mb-2">No products found</h3>
                        <p className="text-[13px] text-[#616161] mb-4">
                          {searchQuery ? `No products match "${searchQuery}"` : 'No products available'}
                        </p>
                        {searchQuery && (
                          <button
                            onClick={() => setSearchQuery('')}
                            className="px-4 py-2 bg-[#303030] text-white text-[13px] font-semibold rounded-lg hover:bg-[#1a1a1a] transition-colors"
                          >
                            Clear search
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Products Table */
                  <div className="overflow-x-auto">
                    {/* Bulk Actions Bar */}
                    {selectedProducts.length > 0 && (
                      <div className="px-4 py-3 bg-[#f6f6f7] border-b border-[#e1e1e1] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="text-[12px] sm:text-[13px] font-medium text-[#303030]">
                            {selectedProducts.length} selected
                          </span>
                          
                          {/* Show "Set as active" if all selected are Draft, otherwise show "Set as draft" */}
                          {allSelectedAreDraft ? (
                            <button
                              onClick={handleSetAsActive}
                              className="px-3 py-1.5 border border-[#c9cccf] bg-white text-[#303030] text-[12px] sm:text-[13px] font-medium rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap"
                            >
                              Set as active
                            </button>
                          ) : (
                            <button
                              onClick={handleSetAsDraft}
                              className="px-3 py-1.5 border border-[#c9cccf] bg-white text-[#303030] text-[12px] sm:text-[13px] font-medium rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap"
                            >
                              Set as draft
                            </button>
                          )}
                          
                          {/* More Actions Dropdown */}
                          <div className="relative" ref={moreActionsRef}>
                            <button
                              onClick={() => setShowMoreActionsMenu(!showMoreActionsMenu)}
                              className="p-1.5 border border-[#c9cccf] bg-white text-[#303030] rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                            
                            {showMoreActionsMenu && (
                              <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-[#c9cccf] rounded-lg shadow-lg z-50 py-2">
                                <button
                                  onClick={() => {
                                    handleDeleteProducts();
                                    setShowMoreActionsMenu(false);
                                  }}
                                  className="w-full px-4 py-2 text-left text-[12px] sm:text-[13px] text-red-600 hover:bg-red-50 flex items-center gap-3"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  Delete products
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <button
                          onClick={() => setSelectedProducts([])}
                          className="text-[12px] sm:text-[13px] text-[#303030] hover:underline self-start sm:self-center"
                        >
                          Show all selected
                        </button>
                      </div>
                    )}
                    
                    <table className="w-full min-w-[800px]">
                      <thead className="border-b border-[#e1e1e1]">
                        <tr>
                          <th className="px-3 sm:px-4 py-3 text-left w-12">
                            <input 
                              type="checkbox" 
                              checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                              onChange={toggleSelectAll}
                              className="rounded border-gray-300"
                            />
                          </th>
                          <th className="px-3 sm:px-4 py-3 text-left w-16"></th>
                          <th className="px-3 sm:px-4 py-3 text-left text-[12px] sm:text-[13px] font-medium text-[#303030] min-w-[200px]">Product</th>
                          <th className="px-3 sm:px-4 py-3 text-left text-[12px] sm:text-[13px] font-medium text-[#303030] min-w-[100px]">Status</th>
                          <th className="px-3 sm:px-4 py-3 text-left text-[12px] sm:text-[13px] font-medium text-[#303030] min-w-[120px]">Inventory</th>
                          <th className="px-3 sm:px-4 py-3 text-left text-[12px] sm:text-[13px] font-medium text-[#303030] min-w-[100px]">Category</th>
                          <th className="px-3 sm:px-4 py-3 text-right text-[12px] sm:text-[13px] font-medium text-[#303030] min-w-[80px]">Channels</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredProducts.map((product) => {
                          const inventory = inventoryData[product._id] || {};
                          // Use getTotalInventory to get quantity from "Shop location"
                          const availableStock = getTotalInventory(product);
                          const variantsCount = getVariantsCount(product);
                          const productImage = product.media && product.media.length > 0 ? product.media[0].url : null;
                          const hasVariants = product.variants && product.variants.length > 0;

                          return (
                            <tr 
                              key={product._id} 
                              className="border-b border-[#e1e1e1] hover:bg-[#f9f9f9] cursor-pointer"
                            >
                              <td className="px-3 sm:px-4 py-3 sm:py-4">
                                <input 
                                  type="checkbox" 
                                  checked={selectedProducts.includes(product._id)}
                                  onChange={() => toggleProductSelection(product._id)}
                                  className="rounded border-gray-300"
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </td>
                              <td className="px-3 sm:px-4 py-3 sm:py-4">
                                {productImage ? (
                                  <img 
                                    src={productImage} 
                                    alt={product.title} 
                                    className="w-10 h-10 rounded object-cover"
                                  />
                                ) : (
                                  <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                                    <svg className="w-5 h-5 text-gray-400" viewBox="0 0 16 16" fill="currentColor">
                                      <path d="M11 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2"></path>
                                      <path fillRule="evenodd" d="M9.276 1.5c-1.02 0-1.994.415-2.701 1.149l-4.254 4.417a2.75 2.75 0 0 0 .036 3.852l2.898 2.898a2.5 2.5 0 0 0 3.502.033l4.747-4.571a3.25 3.25 0 0 0 .996-2.341v-2.187a3.25 3.25 0 0 0-3.25-3.25zm-1.62 2.19a2.24 2.24 0 0 1 1.62-.69h1.974c.966 0 1.75.784 1.75 1.75v2.187c0 .475-.194.93-.536 1.26l-4.747 4.572a1 1 0 0 1-1.401-.014l-2.898-2.898a1.25 1.25 0 0 1-.016-1.75l4.253-4.418Z"></path>
                                    </svg>
                                  </div>
                                )}
                              </td>
                              <td className="px-3 sm:px-4 py-3 sm:py-4">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <a 
                                      href={`/adminDashboard/products/${product._id}`}
                                      className="text-[12px] sm:text-[13px] text-[#222222] hover:underline font-medium"
                                    >
                                      {product.title}
                                    </a>
                                    {product.isGiftCard && (
                                      <span className="inline-flex items-center px-2 py-0.5 bg-[#e0f5ff] text-[#0078d4] text-[10px] font-medium rounded-full">
                                        Gift Card
                                      </span>
                                    )}
                                  </div>
                                  {/* Display gift card denominations */}
                                  {product.isGiftCard && product.denominations && product.denominations.length > 0 && (
                                    <div className="mt-1.5 flex flex-wrap gap-1">
                                      {product.denominations.map((denomination, index) => (
                                        <span 
                                          key={index}
                                          className="inline-block px-2 py-0.5 bg-[#f1f1f1] text-[11px] text-[#303030] rounded"
                                        >
                                          Rs {denomination}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                  {/* Display all variants for regular products */}
                                  {!product.isGiftCard && hasVariants && (
                                    <div className="mt-1.5 flex flex-wrap gap-1">
                                      {product.variants.map((variant, index) => (
                                        variant.optionValues && variant.optionValues.map((value, valueIndex) => (
                                          <span 
                                            key={`${index}-${valueIndex}`}
                                            className="inline-block px-2 py-0.5 bg-[#f1f1f1] text-[11px] text-[#303030] rounded"
                                          >
                                            {value}
                                          </span>
                                        ))
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td className="px-3 sm:px-4 py-3 sm:py-4">
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-[11px] sm:text-[12px] font-medium ${
                                  product.status === 'Active' 
                                    ? 'bg-[#e4f5e9] text-[#108043]' 
                                    : 'bg-[#f7f7f7] text-[#616161]'
                                }`}>
                                  {product.status}
                                </span>
                              </td>
                              <td className="px-3 sm:px-4 py-3 sm:py-4">
                                <div className="text-[12px] sm:text-[13px]">
                                  {product.isGiftCard ? (
                                    <span className="text-[#616161]">Not tracked</span>
                                  ) : (
                                    <>
                                      <span className={availableStock === 0 ? 'text-red-600' : 'text-[#303030]'}>
                                        {availableStock === 0 ? '0 in stock' : `${availableStock} in stock`}
                                      </span>
                                      {variantsCount > 1 && (
                                        <span className="text-[#616161]"> for {variantsCount} variant{variantsCount > 1 ? 's' : ''}</span>
                                      )}
                                    </>
                                  )}
                                </div>
                              </td>
                              <td className="px-3 sm:px-4 py-3 sm:py-4">
                                <span className="text-[12px] sm:text-[13px] text-[#303030]">{product.category || '-'}</span>
                              </td>
                              <td className="px-3 sm:px-4 py-3 sm:py-4 text-right">
                                <span className="text-[12px] sm:text-[13px] text-[#303030]">
                                  {product.publishingChannels?.length || 0}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Learn More Footer */}
              {hasProducts && (
                <div className="mt-6 flex justify-center">
                  <button className="text-[13px] text-[#222222] hover:underline font-medium">
                    Learn more about products
                  </button>
                </div>
              )}
            </div>
          </div>
    </AdminLayout>
  );
}