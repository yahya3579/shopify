// Fetch all inventory items
export const fetchInventory = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams(params);
    const response = await fetch(`/api/inventory?${queryParams.toString()}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch inventory');
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching inventory:', error);
    throw error;
  }
};

// Fetch single inventory item by ID
export const fetchInventoryItem = async (inventoryId) => {
  try {
    const response = await fetch(`/api/inventory/${inventoryId}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch inventory item');
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching inventory item:', error);
    throw error;
  }
};

// Fetch or create inventory for a product
export const fetchInventoryByProduct = async (productId) => {
  try {
    const response = await fetch(`/api/inventory/product/${productId}`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch inventory for product');
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching inventory for product:', error);
    throw error;
  }
};

// Update inventory item by ID
export const updateInventory = async (inventoryId, inventoryData) => {
  try {
    const response = await fetch(`/api/inventory/${inventoryId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(inventoryData),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to update inventory');
    }
    
    return data;
  } catch (error) {
    console.error('Error updating inventory:', error);
    throw error;
  }
};

// Update inventory by product ID
export const updateInventoryByProduct = async (productId, inventoryData) => {
  try {
    const response = await fetch(`/api/inventory/product/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(inventoryData),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to update inventory');
    }
    
    return data;
  } catch (error) {
    console.error('Error updating inventory:', error);
    throw error;
  }
};

// Create inventory item
export const createInventory = async (inventoryData) => {
  try {
    const response = await fetch('/api/inventory', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(inventoryData),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to create inventory');
    }
    
    return data;
  } catch (error) {
    console.error('Error creating inventory:', error);
    throw error;
  }
};

// Delete inventory item
export const deleteInventory = async (inventoryId) => {
  try {
    const response = await fetch(`/api/inventory/${inventoryId}`, {
      method: 'DELETE',
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to delete inventory');
    }
    
    return data;
  } catch (error) {
    console.error('Error deleting inventory:', error);
    throw error;
  }
};

