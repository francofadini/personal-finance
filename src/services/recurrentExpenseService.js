const API_URL = '/api/recurrent-expenses';

// Preset frequencies for easy selection
export const FREQUENCY_PRESETS = {
  MONTHLY: {
    label: 'Monthly',
    months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  },
  BIMONTHLY: {
    label: 'Bimonthly',
    months: [1, 3, 5, 7, 9, 11]
  },
  QUARTERLY: {
    label: 'Quarterly',
    months: [1, 4, 7, 10]
  },
  SEMIANNUAL: {
    label: 'Semi-annual',
    months: [1, 7]
  },
  ANNUAL: {
    label: 'Annual',
    months: [1]
  }
};

export const recurrentExpenseService = {
  list: async () => {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Failed to fetch recurrent expenses');
    return response.json();
  },

  create: async (expenseData) => {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(expenseData),
    });
    if (!response.ok) throw new Error('Failed to create recurrent expense');
    return response.json();
  },

  update: async (id, expenseData) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(expenseData),
    });
    if (!response.ok) throw new Error('Failed to update recurrent expense');
    return response.json();
  },

  delete: async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete recurrent expense');
    return true;
  }
}; 