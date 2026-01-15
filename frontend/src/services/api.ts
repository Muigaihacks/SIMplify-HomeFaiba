// API service for fetching data from backend
// For now, this will use JSON-Server mock API

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const apiService = {
  // Packages
  getPackages: async (): Promise<any[]> => {
    const response = await fetch(`${API_BASE_URL}/packages`);
    if (!response.ok) throw new Error('Failed to fetch packages');
    return response.json();
  },

  // Salesmen
  getSalesmen: async (dealerId: number): Promise<any[]> => {
    const response = await fetch(`${API_BASE_URL}/salesmen?dealerId=${dealerId}`);
    if (!response.ok) throw new Error('Failed to fetch salesmen');
    return response.json();
  },

  getSalesman: async (id: number): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/salesmen/${id}`);
    if (!response.ok) throw new Error('Failed to fetch salesman');
    return response.json();
  },

  // Applications
  getApplications: async (dealerId: number, agentId?: number): Promise<any[]> => {
    let url = `${API_BASE_URL}/applications?dealerId=${dealerId}`;
    if (agentId) {
      url += `&agentId=${agentId}`;
    }
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch applications');
    return response.json();
  },

  getApplication: async (id: number): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/applications/${id}`);
    if (!response.ok) throw new Error('Failed to fetch application');
    return response.json();
  },

  createApplication: async (data: any): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/applications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create application');
    return response.json();
  },

  updateApplication: async (id: number, data: any): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/applications/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update application');
    return response.json();
  },

  // Commissions
  getCommissions: async (dealerId: number, agentId?: number): Promise<any[]> => {
    let url = `${API_BASE_URL}/commissions?dealerId=${dealerId}`;
    if (agentId) {
      url += `&agentId=${agentId}`;
    }
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch commissions');
    return response.json();
  },

  // Installations
  getInstallations: async (agentId: number): Promise<any[]> => {
    const response = await fetch(`${API_BASE_URL}/installations?agentId=${agentId}`);
    if (!response.ok) throw new Error('Failed to fetch installations');
    return response.json();
  },

  // Salesman management
  createSalesman: async (data: any): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/salesmen`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create salesman');
    return response.json();
  },

  updateSalesman: async (id: number, data: any): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/salesmen/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update salesman');
    return response.json();
  },

  deactivateSalesman: async (id: number): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/salesmen/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ isActive: false }),
    });
    if (!response.ok) throw new Error('Failed to deactivate salesman');
    return response.json();
  },

  // Commission management
  markCommissionAsPaid: async (id: number): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/commissions/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ paid: true, paidAt: new Date().toISOString() }),
    });
    if (!response.ok) throw new Error('Failed to mark commission as paid');
    return response.json();
  },

  // Cancel application
  cancelApplication: async (id: number): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/applications/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: 'cancelled' }),
    });
    if (!response.ok) throw new Error('Failed to cancel application');
    return response.json();
  },
};
