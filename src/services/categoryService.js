const API_URL = '/api/categories';

export const categoryService = {
  list: async () => {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Failed to fetch categories');
    return response.json();
  },

  listSubcategories: async () => {
    const response = await fetch('/api/subcategories');
    if (!response.ok) throw new Error('Failed to fetch subcategories');
    return response.json();
  },

  create: async (categoryData) => {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(categoryData),
    });
    if (!response.ok) throw new Error('Failed to create category');
    return response.json();
  },

  update: async (id, categoryData) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(categoryData),
    });
    if (!response.ok) throw new Error('Failed to update category');
    return response.json();
  },

  delete: async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete category');
    return true;
  },

  // Subcategory methods
  createSubcategory: async (data) => {
    const response = await fetch('/api/subcategories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create subcategory');
    return response.json();
  },

  updateSubcategory: async (id, data) => {
    const response = await fetch(`/api/subcategories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update subcategory');
    return response.json();
  },

  deleteSubcategory: async (id) => {
    const response = await fetch(`/api/subcategories/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete subcategory');
    return response.json();
  }
}; 