// Product API Helper Functions for Frontend

/**
 * Upload product image
 * @param {File} file - The image file to upload
 * @returns {Promise<Object>} - Upload response with imageUrl
 */
export const uploadProductImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/products/upload-image', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to upload image');
    }

    return data;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

/**
 * Delete product image
 * @param {string} imageIdentifier - The filename or Cloudinary URL to delete
 * @returns {Promise<Object>} - Delete response
 */
export const deleteProductImage = async (imageIdentifier) => {
  try {
    // Determine if it's a Cloudinary URL or just a filename/publicId
    let queryParam;
    if (imageIdentifier.includes('cloudinary.com')) {
      queryParam = `publicId=${encodeURIComponent(imageIdentifier)}`;
    } else {
      queryParam = `filename=${encodeURIComponent(imageIdentifier)}`;
    }

    const response = await fetch(`/api/products/upload-image?${queryParam}`, {
      method: 'DELETE',
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to delete image');
    }

    return data;
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};

/**
 * Create a new product
 * @param {Object} productData - Product data object
 * @returns {Promise<Object>} - Created product
 */
export const createProduct = async (productData) => {
  try {
    const response = await fetch('/api/products/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to create product');
    }

    return data;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

/**
 * Update an existing product
 * @param {string} productId - Product ID
 * @param {Object} productData - Updated product data
 * @returns {Promise<Object>} - Updated product
 */
export const updateProduct = async (productId, productData) => {
  try {
    const response = await fetch(`/api/products/update/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to update product');
    }

    return data;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

/**
 * Delete a product
 * @param {string} productId - Product ID
 * @returns {Promise<Object>} - Delete response
 */
export const deleteProduct = async (productId) => {
  try {
    const response = await fetch(`/api/products/update/${productId}`, {
      method: 'DELETE',
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to delete product');
    }

    return data;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

/**
 * Fetch all products with filters
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} - Products list with pagination
 */
export const fetchProducts = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams(params).toString();
    const response = await fetch(`/api/products?${queryParams}`);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch products');
    }

    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

/**
 * Fetch single product by ID
 * @param {string} productId - Product ID
 * @returns {Promise<Object>} - Product data
 */
export const fetchProduct = async (productId) => {
  try {
    const response = await fetch(`/api/products/update/${productId}`);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch product');
    }

    return data;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};

