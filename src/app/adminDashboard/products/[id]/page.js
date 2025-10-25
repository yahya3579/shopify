'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AdminLayout from '../../../../components/AdminLayout';
import { ChevronLeft, ChevronDown, Trash2, ChevronRight, Plus, Search, Upload, X } from 'lucide-react';
import { uploadProductImage, updateProduct, deleteProductImage, fetchProduct } from '../../../../lib/productApi';
import { toast } from 'sonner';

export default function EditProduct() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id;

  // Loading state
  const [loading, setLoading] = useState(true);
  const [productNotFound, setProductNotFound] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [inventoryTracked, setInventoryTracked] = useState(false);
  const [quantity, setQuantity] = useState('0');
  const [physicalProduct, setPhysicalProduct] = useState(false);
  const [weight, setWeight] = useState('0.0');
  const [weightUnit, setWeightUnit] = useState('kg');
  
  // Media state
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  
  // Additional fields
  const [compareAtPrice, setCompareAtPrice] = useState('');
  const [costPerItem, setCostPerItem] = useState('');
  const [sku, setSku] = useState('');
  const [barcode, setBarcode] = useState('');
  const [productType, setProductType] = useState('');
  const [vendor, setVendor] = useState('');
  const [tags, setTags] = useState('');
  const [status, setStatus] = useState('Draft');
  
  // Form state
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showAdvancedPricing, setShowAdvancedPricing] = useState(false);
  const [showAdvancedInventory, setShowAdvancedInventory] = useState(false);
  
  // Variants state
  const [variants, setVariants] = useState([]);
  const [showVariantForm, setShowVariantForm] = useState(false);
  
  // Category dropdown state
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [showSubcategories, setShowSubcategories] = useState(false);
  
  // Ref for dropdown
  const dropdownRef = useRef(null);
  const collectionsDropdownRef = useRef(null);
  
  // Collections state
  const [showCollectionsDropdown, setShowCollectionsDropdown] = useState(false);
  const [collectionsSearch, setCollectionsSearch] = useState('');
  const [selectedCollections, setSelectedCollections] = useState([]);
  
  // Sample collections data (you can replace this with actual data from your backend)
  const [collections] = useState([
    { id: 1, name: 'Home page' },
    { id: 2, name: 'Featured Products' },
    { id: 3, name: 'New Arrivals' },
    { id: 4, name: 'Sale Items' },
    { id: 5, name: 'Seasonal Collection' }
  ]);

  // Category data
  const categories = [
    { name: 'Animals & Pet Supplies', hasSubcategories: true, subcategories: ['Pet Food', 'Pet Toys', 'Pet Accessories', 'Pet Health'] },
    { name: 'Apparel & Accessories', hasSubcategories: true, subcategories: ['Men\'s Clothing', 'Women\'s Clothing', 'Kids\' Clothing', 'Shoes', 'Accessories'] },
    { name: 'Arts & Entertainment', hasSubcategories: true, subcategories: ['Books', 'Music', 'Movies', 'Art Supplies', 'Musical Instruments'] },
    { name: 'Baby & Toddler', hasSubcategories: true, subcategories: ['Baby Clothing', 'Baby Food', 'Baby Toys', 'Nursery', 'Safety'] },
    { name: 'Business & Industrial', hasSubcategories: true, subcategories: ['Office Supplies', 'Industrial Equipment', 'Safety Equipment', 'Tools'] },
    { name: 'Cameras & Optics', hasSubcategories: true, subcategories: ['Digital Cameras', 'Lenses', 'Accessories', 'Binoculars', 'Telescopes'] },
    { name: 'Electronics', hasSubcategories: true, subcategories: ['Computers', 'Mobile Phones', 'Audio', 'TV & Video', 'Gaming'] },
    { name: 'Food, Beverages & Tobacco', hasSubcategories: true, subcategories: ['Beverages', 'Snacks', 'Cooking Ingredients', 'Health Foods'] },
    { name: 'Furniture', hasSubcategories: true, subcategories: ['Living Room', 'Bedroom', 'Dining Room', 'Office Furniture', 'Outdoor'] },
    { name: 'Hardware', hasSubcategories: true, subcategories: ['Tools', 'Fasteners', 'Electrical', 'Plumbing', 'Building Materials'] },
    { name: 'Health & Beauty', hasSubcategories: true, subcategories: ['Skincare', 'Makeup', 'Hair Care', 'Personal Care', 'Health Supplements'] },
    { name: 'Home & Garden', hasSubcategories: true, subcategories: ['Garden Tools', 'Plants', 'Outdoor Furniture', 'Home Decor', 'Kitchen'] },
    { name: 'Luggage & Bags', hasSubcategories: true, subcategories: ['Suitcases', 'Backpacks', 'Handbags', 'Travel Accessories'] },
    { name: 'Mature', hasSubcategories: false },
    { name: 'Media', hasSubcategories: true, subcategories: ['Books', 'Magazines', 'Newspapers', 'Digital Media'] },
    { name: 'Office Supplies', hasSubcategories: true, subcategories: ['Stationery', 'Office Equipment', 'Paper Products', 'Writing Instruments'] },
    { name: 'Religious & Ceremonial', hasSubcategories: true, subcategories: ['Religious Items', 'Ceremonial Supplies', 'Spiritual Books'] },
    { name: 'Software', hasSubcategories: true, subcategories: ['Operating Systems', 'Productivity Software', 'Games', 'Educational Software'] },
    { name: 'Sporting Goods', hasSubcategories: true, subcategories: ['Fitness Equipment', 'Team Sports', 'Outdoor Sports', 'Water Sports'] },
    { name: 'Toys & Games', hasSubcategories: true, subcategories: ['Action Figures', 'Board Games', 'Educational Toys', 'Electronic Toys'] },
    { name: 'Vehicles & Parts', hasSubcategories: true, subcategories: ['Car Parts', 'Motorcycle Parts', 'Tools', 'Accessories'] },
    { name: 'Gift Cards', hasSubcategories: false },
    { name: 'Uncategorized', hasSubcategories: false },
    { name: 'Services', hasSubcategories: true, subcategories: ['Professional Services', 'Personal Services', 'Technical Services'] },
    { name: 'Product Add-Ons', hasSubcategories: true, subcategories: ['Warranties', 'Installation', 'Maintenance', 'Support'] },
    { name: 'Bundles', hasSubcategories: false }
  ];

  // Fetch product data on mount
  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const response = await fetchProduct(productId);
        
        if (response.success && response.data) {
          const product = response.data;
          
          // Populate all fields
          setTitle(product.title || '');
          setDescription(product.description || '');
          setCategory(product.category || '');
          setPrice(product.price?.toString() || '');
          setCompareAtPrice(product.compareAtPrice?.toString() || '');
          setCostPerItem(product.costPerItem?.toString() || '');
          setInventoryTracked(product.inventoryTracked || false);
          setQuantity(product.inventory && product.inventory[0] ? product.inventory[0].quantity?.toString() : '0');
          setSku(product.sku || '');
          setBarcode(product.barcode || '');
          setPhysicalProduct(product.physicalProduct || false);
          setWeight(product.weight?.value?.toString() || '0.0');
          setWeightUnit(product.weight?.unit || 'kg');
          setVariants(product.variants || []);
          setStatus(product.status || 'Draft');
          setProductType(product.productType || '');
          setVendor(product.vendor || '');
          setTags(product.tags ? product.tags.join(', ') : '');
          setSelectedCollections(product.collections || []);
          setUploadedImages(product.media || []);
          
          // Show advanced sections if data exists
          if (product.compareAtPrice || product.costPerItem) {
            setShowAdvancedPricing(true);
          }
          if (product.sku || product.barcode) {
            setShowAdvancedInventory(true);
          }
        }
      } catch (error) {
        console.error('Error loading product:', error);
        setError('Failed to load product');
        setProductNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      loadProduct();
    }
  }, [productId]);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check category dropdown
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowCategoryDropdown(false);
        setShowSubcategories(false);
        setHoveredCategory(null);
      }
      
      // Check collections dropdown - more robust check
      if (showCollectionsDropdown) {
        if (!collectionsDropdownRef.current || !collectionsDropdownRef.current.contains(event.target)) {
          setShowCollectionsDropdown(false);
        }
      }
    };

    // Add event listener with capture phase to ensure it runs before other handlers
    document.addEventListener('mousedown', handleClickOutside, true);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
    };
  }, [showCollectionsDropdown]); // Add dependency to ensure handler updates when dropdown state changes

  // Variant management functions
  const addVariantOption = () => {
    const newVariant = {
      id: Date.now().toString(),
      optionName: '',
      optionValues: ['']
    };
    setVariants([...variants, newVariant]);
    setShowVariantForm(true);
  };

  const updateVariantOptionName = (variantId, optionName) => {
    setVariants(variants.map(variant => 
      variant.id === variantId ? { ...variant, optionName } : variant
    ));
  };

  const updateVariantOptionValue = (variantId, valueIndex, value) => {
    setVariants(variants.map(variant => 
      variant.id === variantId 
        ? { 
            ...variant, 
            optionValues: variant.optionValues.map((val, index) => 
              index === valueIndex ? value : val
            )
          }
        : variant
    ));
  };

  const addVariantOptionValue = (variantId) => {
    setVariants(variants.map(variant => 
      variant.id === variantId 
        ? { ...variant, optionValues: [...variant.optionValues, ''] }
        : variant
    ));
  };

  const removeVariantOptionValue = (variantId, valueIndex) => {
    setVariants(variants.map(variant => 
      variant.id === variantId 
        ? { 
            ...variant, 
            optionValues: variant.optionValues.filter((_, index) => index !== valueIndex)
          }
        : variant
    ));
  };

  const deleteVariantOption = (variantId) => {
    setVariants(variants.filter(variant => variant.id !== variantId));
  };

  const doneVariantForm = () => {
    setShowVariantForm(false);
  };

  // Category management functions
  const handleCategorySelect = (categoryName) => {
    setSelectedCategory(categoryName);
    setCategory(categoryName); // Show only main category name
    setSelectedSubcategory('');
    setShowCategoryDropdown(false);
    setShowSubcategories(false);
  };

  const handleSubcategorySelect = (subcategoryName) => {
    setSelectedSubcategory(subcategoryName);
    setCategory(subcategoryName); // Show only subcategory name
    setShowCategoryDropdown(false);
    setShowSubcategories(false);
  };

  const handleCategoryClick = (categoryName) => {
    const category = categories.find(cat => cat.name === categoryName);
    
    if (category && category.hasSubcategories) {
      // If this category is already hovered and subcategories are showing, select the main category
      if (hoveredCategory === categoryName && showSubcategories) {
        handleCategorySelect(categoryName);
      } else {
        // Otherwise, show subcategories
        setHoveredCategory(categoryName);
        setShowSubcategories(true);
      }
    } else {
      // If no subcategories, select the category directly
      handleCategorySelect(categoryName);
    }
  };

  const handleCategoryHover = (categoryName) => {
    // Only show subcategories on hover if no category is currently clicked/selected
    if (!showSubcategories || hoveredCategory !== categoryName) {
      setHoveredCategory(categoryName);
      const category = categories.find(cat => cat.name === categoryName);
      if (category && category.hasSubcategories) {
        setShowSubcategories(true);
      }
    }
  };

  const handleSubcategoryHover = () => {
    // Keep subcategories visible when hovering over subcategory area
    setShowSubcategories(true);
  };

  const handleSubcategoryLeave = () => {
    // Only hide subcategories if no main category is clicked
    if (!hoveredCategory) {
      setShowSubcategories(false);
    }
  };

  // Collections management functions
  const handleCollectionToggle = (collectionId) => {
    setSelectedCollections(prev => 
      prev.includes(collectionId) 
        ? prev.filter(id => id !== collectionId)
        : [...prev, collectionId]
    );
  };

  const handleAddNewCollection = () => {
    // Navigate to add collection page
    window.location.href = '/adminDashboard/Collections/AddCollection';
  };

  const filteredCollections = collections.filter(collection =>
    collection.name.toLowerCase().includes(collectionsSearch.toLowerCase())
  );

  // Image upload handler
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploadingImages(true);
    setError('');

    try {
      const uploadPromises = files.map(file => uploadProductImage(file));
      const results = await Promise.all(uploadPromises);
      
      const newImages = results.map(result => ({
        url: result.imageUrl,
        type: 'image',
        alt: title || 'Product image'
      }));
      
      setUploadedImages([...uploadedImages, ...newImages]);
      toast.success(`${files.length} image(s) uploaded successfully!`);
    } catch (error) {
      console.error('Image upload failed:', error);
      toast.error('Failed to upload images. Please try again.');
      setError('Failed to upload images. Please try again.');
    } finally {
      setUploadingImages(false);
    }
  };

  // Remove image handler
  const handleRemoveImage = async (index, imageUrl) => {
    try {
      const filename = imageUrl.split('/').pop();
      await deleteProductImage(filename);
      
      const newImages = uploadedImages.filter((_, i) => i !== index);
      setUploadedImages(newImages);
      toast.success('Image deleted successfully!');
    } catch (error) {
      console.error('Failed to delete image:', error);
      toast.error('Failed to delete image');
      setError('Failed to delete image');
    }
  };

  // Update product handler
  const handleUpdateProduct = async () => {
    // Validation
    if (!title.trim()) {
      setError('Product title is required');
      return;
    }

    if (!price || parseFloat(price) <= 0) {
      setError('Valid price is required');
      return;
    }

    setSaving(true);
    setError('');

    try {
      // Prepare product data
      const productData = {
        title: title.trim(),
        description: description.trim(),
        media: uploadedImages,
        category,
        price: parseFloat(price),
        compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : null,
        costPerItem: costPerItem ? parseFloat(costPerItem) : null,
        inventoryTracked,
        inventory: inventoryTracked ? [{ location: 'Shop location', quantity: parseInt(quantity) || 0 }] : [],
        sku: sku.trim(),
        barcode: barcode.trim(),
        physicalProduct,
        weight: physicalProduct ? { value: parseFloat(weight) || 0, unit: weightUnit } : { value: 0, unit: 'kg' },
        variants: variants.filter(v => v.optionName.trim() && v.optionValues.some(val => val.trim())),
        status,
        publishingChannels: ['Online Store', 'Point of Sale'],
        productType: productType.trim(),
        vendor: vendor.trim(),
        collections: selectedCollections,
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        themeTemplate: 'Default product'
      };

      const result = await updateProduct(productId, productData);
      
      if (result.success) {
        toast.success('Product updated successfully!');
        // Redirect to products page
        router.push('/adminDashboard');
      }
    } catch (error) {
      console.error('Failed to update product:', error);
      toast.error(error.message || 'Failed to update product. Please try again.');
      setError(error.message || 'Failed to update product. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#f1f1f1]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#303030] mx-auto mb-4"></div>
          <p className="text-[#303030]">Loading product...</p>
        </div>
      </div>
    );
  }

  // Product not found state
  if (productNotFound) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#f1f1f1]">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-[#303030] mb-4">Product not found</h1>
          <button 
            onClick={() => router.push('/adminDashboard')}
            className="px-4 py-2 bg-[#303030] text-white text-[13px] font-semibold rounded-lg hover:bg-[#1a1a1a]"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
              {/* Page Header */}
              <div className="mb-4 sm:mb-6">
                <div className="flex items-center gap-2">
                  {/* Products Link */}
                  <a 
                    href="/adminDashboard" 
                    className="flex items-center justify-center w-8 h-8 hover:bg-gray-100 rounded transition-colors"
                    aria-label="Products"
                  >
                    <svg className="w-4 h-4 text-[#303030]" viewBox="0 0 16 16" fill="currentColor">
                      <path d="M11 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2"></path>
                      <path fillRule="evenodd" d="M9.276 1.5c-1.02 0-1.994.415-2.701 1.149l-4.254 4.417a2.75 2.75 0 0 0 .036 3.852l2.898 2.898a2.5 2.5 0 0 0 3.502.033l4.747-4.571a3.25 3.25 0 0 0 .996-2.341v-2.187a3.25 3.25 0 0 0-3.25-3.25zm-1.62 2.19a2.24 2.24 0 0 1 1.62-.69h1.974c.966 0 1.75.784 1.75 1.75v2.187c0 .475-.194.93-.536 1.26l-4.747 4.572a1 1 0 0 1-1.401-.014l-2.898-2.898a1.25 1.25 0 0 1-.016-1.75l4.253-4.418Z"></path>
                    </svg>
                  </a>
                  
                  {/* Breadcrumb Separator */}
                  <svg width="10" height="20" viewBox="0 0 10 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="shrink-0">
                    <path d="M4 8L6.5 11L4 14" stroke="#8A8A8A" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"></path>
                  </svg>
                  
                  {/* Page Title */}
                  <h1 className="text-[20px] font-semibold text-[#303030]" tabIndex="-1">Edit Product</h1>
                </div>
              </div>

              {/* Two Column Layout */}
              <div className="flex flex-col lg:flex-row gap-4 lg:gap-5">
                {/* Left Column - Main Content */}
                <div className="flex-1 space-y-4">
                  {/* Title, Description, Media, Category Card */}
                  <div className="bg-white rounded-xl shadow-sm p-4 space-y-4">
                    {/* Title */}
                    <div>
                      <label htmlFor="title" className="block text-[13px] font-medium text-[#303030] mb-1.5">
                        Title
                      </label>
                      <input
                        type="text"
                        id="title"
                        placeholder="Short sleeve t-shirt"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-3 py-2 border border-[#c9cccf] rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-[#005bd3] focus:border-transparent"
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-[13px] font-medium text-[#303030] mb-1.5">
                        Description
                      </label>
                      <div className="border border-[#c9cccf] rounded-lg overflow-hidden">
                        <div className="bg-[#f6f6f7] border-b border-[#c9cccf] px-2 py-1.5 flex items-center gap-1 flex-wrap">
                          <button className="p-1 hover:bg-[#e1e3e5] rounded text-[11px]" type="button">Paragraph</button>
                          <div className="w-px h-4 bg-[#c9cccf]"></div>
                          <button className="p-1 hover:bg-[#e1e3e5] rounded" type="button"><strong className="text-[11px]">B</strong></button>
                          <button className="p-1 hover:bg-[#e1e3e5] rounded" type="button"><em className="text-[11px]">I</em></button>
                          <button className="p-1 hover:bg-[#e1e3e5] rounded" type="button"><span className="text-[11px] underline">U</span></button>
                        </div>
                        <textarea
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          className="w-full px-3 py-2 text-[13px] focus:outline-none resize-none"
                          rows="6"
                        />
                      </div>
                    </div>

                    {/* Media */}
                    <div>
                      <p className="text-[13px] font-medium text-[#303030] mb-2">Media</p>
                      
                      {/* Uploaded Images Grid */}
                      {uploadedImages.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                          {uploadedImages.map((image, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={image.url}
                                alt={image.alt}
                                className="w-full h-32 object-cover rounded-lg border border-[#c9cccf]"
                              />
                              <button
                                onClick={() => handleRemoveImage(index, image.url)}
                                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                type="button"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <div className="border-2 border-dashed border-[#c9cccf] rounded-lg p-6 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <div className="flex items-center gap-2">
                            <label className="px-3 py-1.5 bg-white border border-[#c9cccf] text-[13px] rounded-lg hover:bg-gray-50 cursor-pointer flex items-center gap-2">
                              <Upload className="w-4 h-4" />
                              {uploadingImages ? 'Uploading...' : 'Upload new'}
                              <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                                disabled={uploadingImages}
                              />
                            </label>
                            <button className="text-[13px] text-[#000000] hover:underline" type="button">
                              Select existing
                            </button>
                          </div>
                          <p className="text-[12px] text-[#6d7175]">
                            {uploadingImages ? 'Uploading images...' : 'Accepts images, videos, or 3D models'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Category */}
                    <div>
                      <label htmlFor="category" className="block text-[13px] font-medium text-[#303030] mb-1.5">
                        Category
                      </label>
                      <div className="relative" ref={dropdownRef}>
                        <input
                          type="text"
                          id="category"
                          placeholder="Choose a product category"
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          onFocus={() => setShowCategoryDropdown(true)}
                          className="w-full px-3 py-2 pr-10 border border-[#c9cccf] rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-[#005bd3]"
                        />
                        <button 
                          onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                          className="absolute right-2 top-1/2 -translate-y-1/2" 
                          type="button"
                        >
                          <ChevronDown className="w-4 h-4 text-[#6d7175]" />
                        </button>
                        
                        {/* Category Dropdown */}
                        {showCategoryDropdown && (
                          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#c9cccf] rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
                            <div className="flex">
                              {/* Main Categories */}
                              <div className="flex-1 min-w-0">
                                {categories.map((cat, index) => (
                                  <div
                                    key={index}
                                    className={`px-3 py-2 text-[13px] text-[#303030] cursor-pointer flex items-center justify-between hover:bg-gray-50 ${
                                      hoveredCategory === cat.name ? 'bg-gray-50' : ''
                                    }`}
                                    onClick={() => handleCategoryClick(cat.name)}
                                    onMouseEnter={() => handleCategoryHover(cat.name)}
                                  >
                                    <span>{cat.name}</span>
                                    {cat.hasSubcategories && (
                                      <ChevronRight className="w-4 h-4 text-[#6d7175]" />
                                    )}
                                  </div>
                                ))}
                              </div>
                              
                              {/* Subcategories */}
                              {showSubcategories && hoveredCategory && (
                                <div 
                                  className="border-l border-[#c9cccf] min-w-0 flex-1"
                                  onMouseEnter={handleSubcategoryHover}
                                  onMouseLeave={handleSubcategoryLeave}
                                >
                                  {categories.find(cat => cat.name === hoveredCategory)?.subcategories?.map((subcat, index) => (
                                    <div
                                      key={index}
                                      className="px-3 py-2 text-[13px] text-[#303030] cursor-pointer hover:bg-gray-50"
                                      onClick={() => handleSubcategorySelect(subcat)}
                                    >
                                      {subcat}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      <p className="text-[12px] text-[#6d7175] mt-1">
                        Determines tax rates and adds metafields to improve search, filters, and cross-channel sales
                      </p>
                    </div>
                  </div>

                  {/* Price Card */}
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-[#e1e1e1]">
                      <h2 className="text-[14px] font-semibold text-[#303030]">Price</h2>
                    </div>
                    <div className="p-4">
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-[#303030]">Rs</span>
                        <input
                          type="text"
                          placeholder="0.00"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 border border-[#c9cccf] rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-[#005bd3]"
                        />
                      </div>
                    </div>
                    {showAdvancedPricing && (
                      <div className="p-4 border-t border-[#e1e1e1] space-y-3">
                        <div>
                          <label className="block text-[12px] font-medium text-[#303030] mb-1.5">Compare at price</label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-[#303030]">Rs</span>
                            <input
                              type="text"
                              placeholder="0.00"
                              value={compareAtPrice}
                              onChange={(e) => setCompareAtPrice(e.target.value)}
                              className="w-full pl-9 pr-3 py-2 border border-[#c9cccf] rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-[#005bd3]"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[12px] font-medium text-[#303030] mb-1.5">Cost per item</label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-[#303030]">Rs</span>
                            <input
                              type="text"
                              placeholder="0.00"
                              value={costPerItem}
                              onChange={(e) => setCostPerItem(e.target.value)}
                              className="w-full pl-9 pr-3 py-2 border border-[#c9cccf] rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-[#005bd3]"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="border-t border-[#e1e1e1] p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 flex-wrap">
                          <button 
                            onClick={() => setShowAdvancedPricing(!showAdvancedPricing)}
                            className="px-3 py-1.5 text-[12px] text-[#6d7175] hover:bg-[#f6f6f7] rounded-lg"
                            type="button"
                          >
                            {showAdvancedPricing ? 'Hide' : 'Show'} advanced pricing
                          </button>
                        </div>
                        <button 
                          onClick={() => setShowAdvancedPricing(!showAdvancedPricing)}
                          className="p-1" 
                          type="button"
                        >
                          <ChevronDown className={`w-4 h-4 text-[#6d7175] transition-transform ${showAdvancedPricing ? 'rotate-180' : ''}`} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Inventory Card */}
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-[#e1e1e1] flex items-center justify-between">
                      <h2 className="text-[14px] font-semibold text-[#303030]">Inventory</h2>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-[#6d7175]">Inventory tracked</span>
                        <button
                          onClick={() => setInventoryTracked(!inventoryTracked)}
                          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                            inventoryTracked ? 'bg-[#252525]' : 'bg-[#e1e3e5]'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              inventoryTracked ? 'translate-x-5' : 'translate-x-0.5'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                    {inventoryTracked && (
                      <div className="p-4">
                        <div className="border border-[#c9cccf] rounded-lg overflow-hidden">
                          <div className="flex border-b border-[#c9cccf] bg-[#f6f6f7]">
                            <div className="flex-1 px-3 py-2 text-[12px] font-medium text-[#303030]">Items</div>
                            <div className="w-32 px-3 py-2 text-[12px] font-medium text-[#303030] text-right">Quantity</div>
                          </div>
                          <div className="flex">
                            <div className="flex-1 px-3 py-2 text-[13px] text-[#303030]">Inventory Items</div>
                            <div className="w-32 px-2 py-1">
                              <input
                                type="number"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                className="w-full px-2 py-1 border border-[#c9cccf] rounded text-[13px] text-right focus:outline-none focus:ring-2 focus:ring-[#005bd3]"
                                min="0"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {showAdvancedInventory && (
                      <div className="p-4 border-t border-[#e1e1e1] space-y-3">
                        <div>
                          <label className="block text-[12px] font-medium text-[#303030] mb-1.5">SKU (Stock Keeping Unit)</label>
                          <input
                            type="text"
                            placeholder="e.g., TSH-001"
                            value={sku}
                            onChange={(e) => setSku(e.target.value)}
                            className="w-full px-3 py-2 border border-[#c9cccf] rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-[#005bd3]"
                          />
                        </div>
                        <div>
                          <label className="block text-[12px] font-medium text-[#303030] mb-1.5">Barcode (ISBN, UPC, GTIN, etc.)</label>
                          <input
                            type="text"
                            placeholder="e.g., 123456789"
                            value={barcode}
                            onChange={(e) => setBarcode(e.target.value)}
                            className="w-full px-3 py-2 border border-[#c9cccf] rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-[#005bd3]"
                          />
                        </div>
                      </div>
                    )}
                    <div className="border-t border-[#e1e1e1] p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 flex-wrap">
                          <button 
                            onClick={() => setShowAdvancedInventory(!showAdvancedInventory)}
                            className="px-3 py-1.5 text-[12px] text-[#6d7175] hover:bg-[#f6f6f7] rounded-lg"
                            type="button"
                          >
                            {showAdvancedInventory ? 'Hide' : 'Show'} SKU & Barcode
                          </button>
                        </div>
                        <button 
                          onClick={() => setShowAdvancedInventory(!showAdvancedInventory)}
                          className="p-1" 
                          type="button"
                        >
                          <ChevronDown className={`w-4 h-4 text-[#6d7175] transition-transform ${showAdvancedInventory ? 'rotate-180' : ''}`} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Shipping Card */}
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-[#e1e1e1] flex items-center justify-between">
                      <h2 className="text-[14px] font-semibold text-[#303030]">Shipping</h2>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-[#6d7175]">Physical product</span>
                        <button
                          onClick={() => setPhysicalProduct(!physicalProduct)}
                          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                            physicalProduct ? 'bg-[#252525]' : 'bg-[#e1e3e5]'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              physicalProduct ? 'translate-x-5' : 'translate-x-0.5'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                    {physicalProduct && (
                      <div className="p-4">
                        <div className="flex gap-4">
                          <div className="flex-1">
                            <label className="block text-[12px] font-medium text-[#303030] mb-1.5">Weight</label>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={weight}
                                onChange={(e) => setWeight(e.target.value)}
                                className="flex-1 px-3 py-2 border border-[#c9cccf] rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-[#005bd3]"
                              />
                              <select
                                value={weightUnit}
                                onChange={(e) => setWeightUnit(e.target.value)}
                                className="px-3 py-2 border border-[#c9cccf] rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-[#005bd3]"
                              >
                                <option value="lb">lb</option>
                                <option value="oz">oz</option>
                                <option value="kg">kg</option>
                                <option value="g">g</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Variants Card */}
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-[#e1e1e1]">
                      <h2 className="text-[14px] font-semibold text-[#303030]">Variants</h2>
                    </div>
                    <div className="p-4">
                      <button 
                        onClick={addVariantOption}
                        className="flex items-center gap-2 text-[13px] text-[#000000] hover:underline"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                          <path d="M4.25 8a.75.75 0 0 1 .75-.75h2.25v-2.25a.75.75 0 0 1 1.5 0v2.25h2.25a.75.75 0 0 1 0 1.5h-2.25v2.25a.75.75 0 0 1-1.5 0v-2.25h-2.25a.75.75 0 0 1-.75-.75"></path>
                          <path fillRule="evenodd" d="M8 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14m0-1.5a5.5 5.5 0 1 0 0-11 5.5 5.5 0 1 0 0 11"></path>
                        </svg>
                        Add options like size or color
                      </button>
                    </div>
                    
                    {/* Variant Options */}
                    {variants.map((variant) => (
                      <div key={variant.id} className="border-t border-[#e1e1e1]">
                        <div className="p-4 space-y-4">
                          {/* Drag Handle */}
                          <div className="flex items-start gap-3">
                            <div className="mt-2 cursor-move">
                              <svg className="w-4 h-4 text-[#6d7175]" viewBox="0 0 16 16" fill="currentColor">
                                <path d="M2 4a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm0 4a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm0 4a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm4-8a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm0 4a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm0 4a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"></path>
                              </svg>
                            </div>
                            
                            <div className="flex-1 space-y-4">
                              {/* Option Name */}
                              <div>
                                <label className="block text-[13px] font-medium text-[#303030] mb-1.5">
                                  Option name
                                </label>
                                <div className="flex items-center gap-2">
                                  <input
                                    type="text"
                                    placeholder="Size"
                                    value={variant.optionName}
                                    onChange={(e) => updateVariantOptionName(variant.id, e.target.value)}
                                    className="flex-1 px-3 py-2 border border-[#c9cccf] rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-[#005bd3] focus:border-transparent"
                                  />
                                  <button
                                    onClick={() => deleteVariantOption(variant.id)}
                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    type="button"
                                    title="Delete this option"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>

                              {/* Option Values */}
                              <div>
                                <label className="block text-[13px] font-medium text-[#303030] mb-1.5">
                                  Option values
                                </label>
                                <div className="space-y-2">
                                  {variant.optionValues.map((value, valueIndex) => (
                                    <div key={valueIndex} className="flex items-center gap-2">
                                      <input
                                        type="text"
                                        placeholder="Medium"
                                        value={value}
                                        onChange={(e) => updateVariantOptionValue(variant.id, valueIndex, e.target.value)}
                                        className="flex-1 px-3 py-2 border border-[#c9cccf] rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-[#005bd3] focus:border-transparent"
                                      />
                                      {variant.optionValues.length > 1 && (
                                        <button
                                          onClick={() => removeVariantOptionValue(variant.id, valueIndex)}
                                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                          type="button"
                                        >
                                          <Trash2 className="w-4 h-4" />
                                        </button>
                                      )}
                                    </div>
                                  ))}
                                  
                                  {/* Add Value Button */}
                                  <button
                                    onClick={() => addVariantOptionValue(variant.id)}
                                    className="flex items-center gap-2 text-[13px] text-[#252525] hover:underline"
                                    type="button"
                                  >
                                    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                                      <path d="M4.25 8a.75.75 0 0 1 .75-.75h2.25v-2.25a.75.75 0 0 1 1.5 0v2.25h2.25a.75.75 0 0 1 0 1.5h-2.25v2.25a.75.75 0 0 1-1.5 0v-2.25h-2.25a.75.75 0 0 1-.75-.75"></path>
                                    </svg>
                                    Add another option
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                         
                        </div>
                      </div>
                    ))}
                    
                    {/* Add Another Option Button - Only show if there are existing variants */}
                    {variants.length > 0 && (
                      <div className="border-t border-[#e1e1e1] p-4">
                        <button 
                          onClick={addVariantOption}
                          className="flex items-center gap-2 text-[13px] text-[#252525] hover:underline"
                        >
                          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M4.25 8a.75.75 0 0 1 .75-.75h2.25v-2.25a.75.75 0 0 1 1.5 0v2.25h2.25a.75.75 0 0 1 0 1.5h-2.25v2.25a.75.75 0 0 1-1.5 0v-2.25h-2.25a.75.75 0 0 1-.75-.75"></path>
                          </svg>
                          Add another option
                        </button>
                      </div>
                    )}
                  </div>

                  {/* SEO Card */}
                  <div className="bg-white rounded-xl shadow-sm p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="text-[14px] font-semibold text-[#303030]">Search engine listing</h2>
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                          <path fillRule="evenodd" d="M13.655 2.344a2.694 2.694 0 0 0-3.81 0l-.599.599-.009-.009-1.06 1.06.009.01-5.88 5.88a2.75 2.75 0 0 0-.806 1.944v1.922a.75.75 0 0 0 .75.75h1.922a2.75 2.75 0 0 0 1.944-.806l7.54-7.54a2.694 2.694 0 0 0 0-3.81Zm-4.409 2.72-5.88 5.88a1.25 1.25 0 0 0-.366.884v1.172h1.172c.331 0 .65-.132.883-.366l5.88-5.88zm2.75.629.599-.599a1.196 1.196 0 0 0-1.69-1.69l-.598.6z"></path>
                        </svg>
                      </button>
                    </div>
                    <p className="text-[13px] text-[#6d7175]">
                      Add a title and description to see how this product might appear in a search engine listing
                    </p>
                  </div>
                </div>

                {/* Right Column - Sidebar */}
                <div className="w-full lg:w-80 space-y-4">
                  {/* Status Card */}
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-[#e1e1e1]">
                      <h2 className="text-[14px] font-semibold text-[#303030]">Status</h2>
                    </div>
                    <div className="p-4">
                      <select 
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full px-3 py-2 border border-[#c9cccf] rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-[#005bd3]"
                      >
                        <option>Active</option>
                        <option>Draft</option>
                      </select>
                    </div>
                  </div>

                  {/* Publishing Card */}
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-[#e1e1e1] flex items-center justify-between">
                      <h2 className="text-[14px] font-semibold text-[#303030]">Publishing</h2>
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                          <path fillRule="evenodd" d="M7.095 4.25a3 3 0 0 1 5.81 0h1.345a.75.75 0 0 1 0 1.5h-1.345a3 3 0 0 1-5.81 0h-5.345a.75.75 0 0 1 0-1.5zm1.405.75a1.5 1.5 0 1 1 3.001.001 1.5 1.5 0 0 1-3.001-.001"></path>
                        </svg>
                      </button>
                    </div>
                    <div className="p-4 space-y-2">
                      <div className="flex items-center gap-2 p-2 bg-[#f6f6f7] rounded">
                        <span className="text-[12px] text-[#303030]">Online Store</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-[#f6f6f7] rounded">
                        <span className="text-[12px] text-[#303030]">Point of Sale</span>
                      </div>
                    </div>
                  </div>

                  {/* Product Organization Card */}
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-[#e1e1e1]">
                      <h2 className="text-[14px] font-semibold text-[#303030]">Product organization</h2>
                    </div>
                    <div className="p-4 space-y-4">
                      <div>
                        <label className="block text-[12px] font-medium text-[#303030] mb-1.5">Type</label>
                        <input
                          type="text"
                          value={productType}
                          onChange={(e) => setProductType(e.target.value)}
                          placeholder="e.g., Clothing, Electronics"
                          className="w-full px-3 py-2 border border-[#c9cccf] rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-[#005bd3]"
                        />
                      </div>
                      <div>
                        <label className="block text-[12px] font-medium text-[#303030] mb-1.5">Vendor</label>
                        <input
                          type="text"
                          value={vendor}
                          onChange={(e) => setVendor(e.target.value)}
                          placeholder="e.g., Brand Name"
                          className="w-full px-3 py-2 border border-[#c9cccf] rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-[#005bd3]"
                        />
                      </div>
                      <div>
                        <label className="block text-[12px] font-medium text-[#303030] mb-1.5">Collections</label>
                        <div className="relative" ref={collectionsDropdownRef}>
                          <input
                            type="text"
                            placeholder="Search collections"
                            value={collectionsSearch}
                            onChange={(e) => setCollectionsSearch(e.target.value)}
                            onFocus={() => setShowCollectionsDropdown(true)}
                            className="w-full px-3 py-2 border border-[#c9cccf] rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-[#005bd3]"
                          />
                          
                          {/* Collections Dropdown */}
                          {showCollectionsDropdown && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#c9cccf] rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
                              {/* Header */}
                              <div className="px-3 py-2 border-b border-[#c9cccf]">
                                <h3 className="text-[13px] font-semibold text-[#303030]">Collections</h3>
                              </div>
                              
                              {/* Search Input */}
                              <div className="p-3 border-b border-[#c9cccf]">
                                <div className="relative">
                                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6d7175]" />
                                  <input
                                    type="text"
                                    placeholder="Search collections"
                                    value={collectionsSearch}
                                    onChange={(e) => setCollectionsSearch(e.target.value)}
                                    className="w-full pl-9 pr-3 py-2 border border-[#c9cccf] rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-[#005bd3]"
                                  />
                                </div>
                              </div>
                              
                              {/* Add New Collection Button */}
                              <div className="p-3 border-b border-[#c9cccf]">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAddNewCollection();
                                  }}
                                  className="w-full flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-[13px] text-[#303030] transition-colors"
                                >
                                  <Plus className="w-4 h-4" />
                                  Add new collection
                                </button>
                              </div>
                              
                              {/* Collections List */}
                              <div className="max-h-48 overflow-y-auto">
                                {filteredCollections.map((collection) => (
                                  <div
                                    key={collection.id}
                                    className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleCollectionToggle(collection.id);
                                    }}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={selectedCollections.includes(collection.id)}
                                      onChange={(e) => {
                                        e.stopPropagation();
                                        handleCollectionToggle(collection.id);
                                      }}
                                      onClick={(e) => e.stopPropagation()}
                                      className="w-4 h-4 text-[#005bd3] border-[#c9cccf] rounded focus:ring-[#005bd3]"
                                    />
                                    <span className="text-[13px] text-[#303030]">{collection.name}</span>
                                  </div>
                                ))}
                                {filteredCollections.length === 0 && (
                                  <div className="px-3 py-4 text-[13px] text-[#6d7175] text-center">
                                    No collections found
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="block text-[12px] font-medium text-[#303030] mb-1.5">Tags</label>
                        <input
                          type="text"
                          value={tags}
                          onChange={(e) => setTags(e.target.value)}
                          placeholder="summer, casual, cotton (comma separated)"
                          className="w-full px-3 py-2 border border-[#c9cccf] rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-[#005bd3]"
                        />
                        <p className="text-[11px] text-[#6d7175] mt-1">Separate tags with commas</p>
                      </div>
                    </div>
                  </div>

                  {/* Theme Template Card */}
                  <div className="bg-white rounded-xl shadow-sm p-4">
                    <label className="block text-[12px] font-medium text-[#303030] mb-1.5">Theme template</label>
                    <select className="w-full px-3 py-2 border border-[#c9cccf] rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-[#005bd3]">
                      <option>Default product</option>
                    </select>
                  </div>
                </div>
              </div>

        {/* Error Message */}
        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-[13px] text-red-600">{error}</p>
          </div>
        )}

        {/* Update Button */}
        <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row justify-end gap-3">
          <button 
            onClick={() => router.push('/adminDashboard')}
            className="px-4 py-2 bg-white border border-[#c9cccf] text-[#303030] text-[13px] font-semibold rounded-lg hover:bg-gray-50 transition-colors order-2 sm:order-1"
            disabled={saving}
          >
            Cancel
          </button>
          <button 
            onClick={handleUpdateProduct}
            disabled={saving || uploadingImages}
            className="px-4 py-2 bg-[#303030] text-white text-[13px] font-semibold rounded-lg hover:bg-[#1a1a1a] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed order-1 sm:order-2"
          >
            {saving ? 'Updating...' : 'Update Product'}
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}