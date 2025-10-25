'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search } from 'lucide-react';
import AdminLayout from '../../../components/AdminLayout';
import { fetchInventoryByProduct, updateInventoryByProduct } from '../../../lib/inventoryApi';

export default function Inventory() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('all');
  const [selectedInventory, setSelectedInventory] = useState([]);
  const [inventoryData, setInventoryData] = useState({});
  const [editingField, setEditingField] = useState({});
  const [savingInventory, setSavingInventory] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchField, setShowSearchField] = useState(false);
  const searchInputRef = useRef(null);
  const router = useRouter();

  // Fetch products
  const fetchProducts = async () => {
    try {
      setProductsLoading(true);
      const response = await fetch(`/api/products`);
      const data = await response.json();
      
      if (data.success) {
        const productsData = data.data || [];
        setProducts(productsData);
        
        // Fetch inventory data for each product
        await fetchInventoryForProducts(productsData);
      } else {
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
              unavailable: 0,
              committed: 0,
              available: 0,
              onHand: 0,
              incoming: 0
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

  useEffect(() => {
    if (isAuthenticated) {
      fetchProducts();
    }
  }, [isAuthenticated]);

  const toggleInventorySelection = (productId) => {
    if (selectedInventory.includes(productId)) {
      setSelectedInventory(selectedInventory.filter(id => id !== productId));
    } else {
      setSelectedInventory([...selectedInventory, productId]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedInventory.length === filteredProducts.length) {
      setSelectedInventory([]);
    } else {
      setSelectedInventory(filteredProducts.map(p => p._id));
    }
  };

  const getTotalInventory = (product) => {
    if (!product.inventory || product.inventory.length === 0) return 0;
    return product.inventory.reduce((sum, inv) => sum + (inv.quantity || 0), 0);
  };

  // Filter products based on search query
  const filteredProducts = products.filter(product => {
    if (!searchQuery.trim()) return true;
    return product.title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Handle inventory field update
  const handleInventoryUpdate = async (productId, field, value) => {
    try {
      setSavingInventory(prev => ({ ...prev, [`${productId}-${field}`]: true }));
      
      const updateData = {
        [field]: parseInt(value) || 0
      };

      const response = await updateInventoryByProduct(productId, updateData);
      
      if (response.success) {
        // Update local state
        setInventoryData(prev => ({
          ...prev,
          [productId]: {
            ...prev[productId],
            ...response.data
          }
        }));
        
        // Clear editing state
        setEditingField(prev => {
          const newState = { ...prev };
          delete newState[`${productId}-${field}`];
          return newState;
        });
      }
    } catch (error) {
      console.error('Error updating inventory:', error);
      alert('Failed to update inventory. Please try again.');
    } finally {
      setSavingInventory(prev => {
        const newState = { ...prev };
        delete newState[`${productId}-${field}`];
        return newState;
      });
    }
  };

  // Handle field value change
  const handleFieldChange = (productId, field, value) => {
    setEditingField(prev => ({
      ...prev,
      [`${productId}-${field}`]: value
    }));
  };

  // Handle field blur (save on blur)
  const handleFieldBlur = async (productId, field, value) => {
    const currentValue = inventoryData[productId]?.[field] || 0;
    const newValue = parseInt(value) || 0;
    
    // Only update if value changed
    if (newValue !== currentValue) {
      await handleInventoryUpdate(productId, field, newValue);
    } else {
      // Clear editing state if no change
      setEditingField(prev => {
        const newState = { ...prev };
        delete newState[`${productId}-${field}`];
        return newState;
      });
    }
  };

  // Get field value (either editing or saved value)
  const getFieldValue = (productId, field) => {
    const editingKey = `${productId}-${field}`;
    if (editingKey in editingField) {
      return editingField[editingKey];
    }
    return inventoryData[productId]?.[field] || 0;
  };

  // Calculate on hand value (sum of unavailable, committed, and available)
  const calculateOnHand = (productId) => {
    const unavailable = parseInt(getFieldValue(productId, 'unavailable')) || 0;
    const committed = parseInt(getFieldValue(productId, 'committed')) || 0;
    const available = parseInt(getFieldValue(productId, 'available')) || 0;
    return unavailable + committed + available;
  };

  // Check if product has unsaved changes (exclude onHand as it's calculated)
  const hasUnsavedChanges = (productId) => {
    return Object.keys(editingField).some(key => 
      key.startsWith(`${productId}-`) && !key.endsWith('-onHand')
    );
  };

  // Handle manual save for a product
  const handleManualSave = async (productId) => {
    try {
      setSavingInventory(prev => ({ ...prev, [`${productId}-saving`]: true }));
      
      // Collect all edited fields for this product (exclude onHand as it's calculated)
      const updateData = {};
      Object.keys(editingField).forEach(key => {
        if (key.startsWith(`${productId}-`)) {
          const field = key.replace(`${productId}-`, '');
          // Skip onHand field as it's calculated automatically
          if (field !== 'onHand') {
            updateData[field] = parseInt(editingField[key]) || 0;
          }
        }
      });

      if (Object.keys(updateData).length === 0) {
        return; // No changes to save
      }

      const response = await updateInventoryByProduct(productId, updateData);
      
      if (response.success) {
        // Update local state
        setInventoryData(prev => ({
          ...prev,
          [productId]: {
            ...prev[productId],
            ...response.data
          }
        }));
        
        // Clear all editing states for this product
        setEditingField(prev => {
          const newState = { ...prev };
          Object.keys(newState).forEach(key => {
            if (key.startsWith(`${productId}-`)) {
              delete newState[key];
            }
          });
          return newState;
        });

        // Show success message
        alert('Inventory updated successfully!');
      }
    } catch (error) {
      console.error('Error saving inventory:', error);
      alert('Failed to save inventory. Please try again.');
    } finally {
      setSavingInventory(prev => {
        const newState = { ...prev };
        delete newState[`${productId}-saving`];
        return newState;
      });
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

  if (!isAuthenticated) {
    return null;
  }

  const hasProducts = products.length > 0;

  return (
    <AdminLayout>
      <div className="w-full px-4 lg:px-6 py-4 lg:py-6">
        {/* Page Header */}
        <div className="mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {/* Inventory Icon */}
                    <svg className="w-5 h-5 text-[#000000]" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M9.265.953a2.25 2.25 0 0 0-2.53 0l-4.094 2.784a3.75 3.75 0 0 0-1.641 3.1v7.413a.75.75 0 0 0 1.5 0v-7.412c0-.745.369-1.442.985-1.86l4.093-2.784a.75.75 0 0 1 .844 0l4.093 2.783c.616.42.985 1.116.985 1.86v7.413a.75.75 0 0 0 1.5 0v-7.412a3.75 3.75 0 0 0-1.641-3.101z"></path>
                      <path fillRule="evenodd" d="M8 14.969q-.12.03-.25.031h-3a1 1 0 0 1-1-1v-3.5a1 1 0 0 1 1-1h.75v-3a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v3h.75a1 1 0 0 1 1 1v3.5a1 1 0 0 1-1 1h-3a1 1 0 0 1-.25-.031m.75-3.969v2.5h2v-2.5zm-1.5 2.5v-2.5h-2v2.5zm1.75-4v-2.5h-2v2.5z"></path>
                    </svg>
                    
                    {/* Page Title */}
                    <h1 className="text-[20px] font-semibold text-[#303030]" tabIndex="-1">Inventory</h1>
                  </div>

                  {/* Action Buttons - Only show when products exist */}
                  {hasProducts && (
                    <div className="flex items-center gap-2">
                      <button className="px-4 py-2 border border-[#c9cccf] text-[#303030] text-[13px] font-medium rounded-lg hover:bg-gray-50">
                        Export
                      </button>
                      <button className="px-4 py-2 border border-[#c9cccf] text-[#303030] text-[13px] font-medium rounded-lg hover:bg-gray-50">
                        Import
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Main Card */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                {productsLoading ? (
                  <div className="p-16 flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#303030]"></div>
                  </div>
                ) : !hasProducts ? (
                  /* Empty State */
                  <div className="p-16">
                    <div className="flex flex-col items-center justify-center text-center">
                      {/* Empty State Image */}
                      <div className="mb-8">
                        <img 
                          src="https://cdn.shopify.com/shopifycloud/web/assets/v1/vite/client/en/assets/empty-state-inventory-CSGe8bIdQxmT.svg" 
                          alt="Keep track of your inventory" 
                          className="w-80 h-80 object-contain"
                          role="presentation"
                        />
                      </div>

                      {/* Content */}
                      <div className="max-w-md mb-6">
                        <h2 className="text-[18px] font-semibold text-[#303030] mb-4">
                          Keep track of your inventory
                        </h2>
                        <p className="text-[13px] text-[#616161] leading-relaxed">
                          When you enable inventory tracking on your products, you can view and adjust their inventory counts here.
                        </p>
                      </div>

                      {/* Action Button */}
                      <div className="flex justify-center">
                        <a 
                          href="/adminDashboard"
                          className="px-4 py-2 bg-[#303030] text-white text-[13px] font-semibold rounded-lg hover:bg-[#1a1a1a] transition-colors"
                        >
                          Go to products
                        </a>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Inventory Table */
                  <div>
                    {/* Tabs */}
                    <div className="border-b border-[#e1e1e1]">
                      <div className="px-6 py-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => setSelectedTab('all')}
                              className={`px-4 py-2 text-[13px] font-medium rounded-lg ${selectedTab === 'all' ? 'text-[#303030] bg-[#f1f1f1]' : 'text-[#5c5f62] hover:bg-gray-100'}`}
                            >
                              All
                            </button>
                            {/* <button 
                              onClick={() => setSelectedTab('incoming')}
                              className={`px-4 py-2 text-[13px] font-medium rounded-lg ${selectedTab === 'incoming' ? 'text-[#303030] bg-[#f1f1f1]' : 'text-[#5c5f62] hover:bg-gray-100'}`}
                            >
                              Incoming
                            </button> */}
                            {/* <button className="p-2 text-[#5c5f62] hover:bg-gray-100 rounded">
                              <Plus className="w-4 h-4" />
                            </button> */}
                          </div>

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
                              <Search className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-[#5c5f62] hover:bg-gray-100 rounded">
                              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                                <path d="M1 4a.75.75 0 0 1 .75-.75h12.5a.75.75 0 0 1 0 1.5h-12.5a.75.75 0 0 1-.75-.75"></path>
                                <path d="M4.75 12a.75.75 0 0 1 .75-.75h5a.75.75 0 0 1 0 1.5h-5a.75.75 0 0 1-.75-.75"></path>
                                <path d="M3.5 7.25a.75.75 0 0 0 0 1.5h9a.75.75 0 0 0 0-1.5z"></path>
                              </svg>
                            </button>
                            <button className="p-2 text-[#5c5f62] hover:bg-gray-100 rounded">
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
                      <div className="px-6 py-3 border-b border-[#e1e1e1] bg-white">
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

                    {/* Inventory Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="border-b border-[#e1e1e1]">
                          <tr>
                            <th className="px-4 py-3 text-left w-12">
                              <input 
                                type="checkbox" 
                                checked={selectedInventory.length === filteredProducts.length && filteredProducts.length > 0}
                                onChange={toggleSelectAll}
                                className="rounded border-gray-300"
                              />
                            </th>
                            <th className="px-4 py-3 text-left w-16"></th>
                            <th className="px-4 py-3 text-left text-[13px] font-medium text-[#303030]">Product</th>
                            <th className="px-4 py-3 text-left text-[13px] font-medium text-[#303030]">SKU</th>
                            <th className="px-4 py-3 text-right text-[13px] font-medium text-[#303030]">Unavailable</th>
                            <th className="px-4 py-3 text-right text-[13px] font-medium text-[#303030]">Committed</th>
                            <th className="px-4 py-3 text-left text-[13px] font-medium text-[#303030]">Available</th>
                            <th className="px-4 py-3 text-left text-[13px] font-medium text-[#303030]">On hand</th>
                            <th className="px-4 py-3 text-right text-[13px] font-medium text-[#303030]">Incoming</th>
                            <th className="px-4 py-3 text-center text-[13px] font-medium text-[#303030]">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredProducts.length === 0 ? (
                            <tr>
                              <td colSpan="10" className="px-8 py-16 text-center">
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
                              </td>
                            </tr>
                          ) : (
                            filteredProducts.map((product) => {
                            const totalInventory = getTotalInventory(product);
                            const productImage = product.media && product.media.length > 0 ? product.media[0].url : null;
                            const inventory = inventoryData[product._id] || {};

                            return (
                              <tr 
                                key={product._id} 
                                className="border-b border-[#e1e1e1] hover:bg-[#f9f9f9]"
                              >
                                <td className="px-4 py-4">
                                  <input 
                                    type="checkbox" 
                                    checked={selectedInventory.includes(product._id)}
                                    onChange={() => toggleInventorySelection(product._id)}
                                    className="rounded border-gray-300"
                                  />
                                </td>
                                <td className="px-4 py-4">
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
                                <td className="px-4 py-4">
                                  <div>
                                    <a 
                                      href={`/adminDashboard/products/${product._id}`}
                                      className="text-[13px] text-[#222222] hover:underline font-medium"
                                    >
                                      {product.title}
                                    </a>
                                    {product.variants && product.variants.length > 0 && product.variants[0].optionValues && (
                                      <div className="mt-1">
                                        <span className="inline-block px-2 py-0.5 bg-[#f1f1f1] text-[11px] text-[#303030] rounded">
                                          {product.variants[0].optionValues[0]}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </td>
                                <td className="px-4 py-4">
                                  <span className="text-[13px] text-[#616161]">
                                    {product.sku || 'No SKU'}
                                  </span>
                                </td>
                                <td className="px-4 py-4 text-right">
                                  <input
                                    type="number"
                                    value={getFieldValue(product._id, 'unavailable')}
                                    onChange={(e) => handleFieldChange(product._id, 'unavailable', e.target.value)}
                                    className={`w-20 px-2 py-1 border border-[#c9cccf] rounded text-[13px] text-right focus:outline-none focus:ring-2 focus:ring-[#005bd3] ${savingInventory[`${product._id}-saving`] ? 'bg-gray-100' : ''}`}
                                    min="0"
                                    disabled={savingInventory[`${product._id}-saving`]}
                                  />
                                </td>
                                <td className="px-4 py-4 text-right">
                                  <input
                                    type="number"
                                    value={getFieldValue(product._id, 'committed')}
                                    onChange={(e) => handleFieldChange(product._id, 'committed', e.target.value)}
                                    className={`w-20 px-2 py-1 border border-[#c9cccf] rounded text-[13px] text-right focus:outline-none focus:ring-2 focus:ring-[#005bd3] ${savingInventory[`${product._id}-saving`] ? 'bg-gray-100' : ''}`}
                                    min="0"
                                    disabled={savingInventory[`${product._id}-saving`]}
                                  />
                                </td>
                                <td className="px-4 py-4">
                                  <input
                                    type="number"
                                    value={getFieldValue(product._id, 'available')}
                                    onChange={(e) => handleFieldChange(product._id, 'available', e.target.value)}
                                    className={`w-20 px-2 py-1 border border-[#c9cccf] rounded text-[13px] text-right focus:outline-none focus:ring-2 focus:ring-[#005bd3] ${savingInventory[`${product._id}-saving`] ? 'bg-gray-100' : ''}`}
                                    min="0"
                                    disabled={savingInventory[`${product._id}-saving`]}
                                  />
                                </td>
                                <td className="px-4 py-4">
                                  <span className="text-[13px] text-[#303030] font-medium">
                                    {calculateOnHand(product._id)}
                                  </span>
                                </td>
                                <td className="px-4 py-4 text-right">
                                  <span className="text-[13px] text-[#303030]">
                                    {getFieldValue(product._id, 'incoming')}
                                  </span>
                                </td>
                                <td className="px-4 py-4 text-center">
                                  {hasUnsavedChanges(product._id) && (
                                    <button
                                      onClick={() => handleManualSave(product._id)}
                                      disabled={savingInventory[`${product._id}-saving`]}
                                      className={`px-3 py-1.5 text-[13px] font-medium rounded-lg transition-colors ${
                                        savingInventory[`${product._id}-saving`]
                                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                          : 'bg-[#303030] text-white hover:bg-[#1a1a1a]'
                                      }`}
                                    >
                                      {savingInventory[`${product._id}-saving`] ? 'Saving...' : 'Update'}
                                    </button>
                                  )}
                                </td>
                              </tr>
                            );
                          })
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>

        {/* Footer Help */}
        <div className="mt-6 text-center">
          <button className="text-[13px] text-[#131212] hover:underline font-medium">
            Learn more about managing inventory
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
