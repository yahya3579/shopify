// Collection API Helper Functions

// Upload collection image
export const uploadCollectionImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch('/api/collections/upload-image', {
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

// Delete collection image
export const deleteCollectionImage = async (filename) => {
  try {
    const response = await fetch(`/api/collections/upload-image?filename=${filename}`, {
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

// Create new collection
export const createCollection = async (collectionData) => {
  try {
    const response = await fetch('/api/collections', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(collectionData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to create collection');
    }

    return data;
  } catch (error) {
    console.error('Error creating collection:', error);
    throw error;
  }
};

// Fetch all collections
export const fetchCollections = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams(params);
    const response = await fetch(`/api/collections?${queryParams.toString()}`);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch collections');
    }

    return data;
  } catch (error) {
    console.error('Error fetching collections:', error);
    throw error;
  }
};

// Fetch single collection by ID
export const fetchCollection = async (collectionId) => {
  try {
    const response = await fetch(`/api/collections/${collectionId}`);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch collection');
    }

    return data;
  } catch (error) {
    console.error('Error fetching collection:', error);
    throw error;
  }
};

// Update collection
export const updateCollection = async (collectionId, collectionData) => {
  try {
    const response = await fetch(`/api/collections/${collectionId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(collectionData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update collection');
    }

    return data;
  } catch (error) {
    console.error('Error updating collection:', error);
    throw error;
  }
};

// Delete collection
export const deleteCollection = async (collectionId) => {
  try {
    const response = await fetch(`/api/collections/${collectionId}`, {
      method: 'DELETE',
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to delete collection');
    }

    return data;
  } catch (error) {
    console.error('Error deleting collection:', error);
    throw error;
  }
};

// Search products for collection
export const searchProductsForCollection = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams(params);
    const response = await fetch(`/api/collections/search-products?${queryParams.toString()}`);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to search products');
    }

    return data;
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
};

