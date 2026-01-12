// Type definitions for SIMplify HomeFaiba

export interface Package {
  id: number;
  name: string;
  speed: string;
  price: number;
  description: string;
  features: string[];
  color: string;
}

export interface Salesman {
  id: number;
  dealerId: number;
  name: string;
  email: string;
  phone: string;
  agentId: string;
  isActive: boolean;
  totalSales: number;
  totalCommission: number;
  createdAt: string;
}

export interface PhysicalAddress {
  building: string;
  floor: string;
  unit: string;
  street: string;
  area: string;
  city: string;
  postalCode: string;
}

export interface Application {
  id: number;
  applicationNumber: string;
  dealerId: number;
  agentId: number;
  agentName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerNationalId: string;
  physicalAddress: PhysicalAddress;
  packageId: number;
  packageName: string;
  status: 'pending' | 'dispatched' | 'active' | 'cancelled';
  submittedAt: string;
  dispatchedAt: string | null;
  installedAt: string | null;
  kycDocuments: {
    nationalId: string;
    proofOfAddress: string;
  };
}

export interface Commission {
  id: number;
  dealerId: number;
  agentId: number;
  agentName: string;
  period: string;
  totalSales: number;
  successfulActivations: number;
  totalRevenue: number;
  commissionRate: number;
  totalCommission: number;
  paid: boolean;
  paidAt: string | null;
}

export interface Installation {
  id: number;
  applicationId: number;
  applicationNumber: string;
  agentId: number;
  agentName: string;
  customerName: string;
  customerPhone: string;
  address: string;
  packageName: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  scheduledDate: string;
  technicianAssigned: string | null;
  completedAt: string | null;
}

export interface AppContextType {
  dealerId: number;
  agentId: number | null;
  userRole: 'dealer' | 'agent';
  setDealerId: (id: number) => void;
  setAgentId: (id: number | null) => void;
  setUserRole: (role: 'dealer' | 'agent') => void;
}
