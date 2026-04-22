import {
  type AssetStatus,
  type AssetType,
  type BillingCycle,
  type ClientStatus,
  type ClientType,
  type ContractStatus,
  type InvoiceStatus,
  type InvoiceType,
  type PaymentMethod,
  type Priority,
  type ProjectStatus
} from "@/generated/prisma";

export type ClientListItem = {
  id: string;
  name: string;
  email: string;
  companyName: string;
  contactPerson: string | null;
  phone: string | null;
  type: ClientType;
  status: ClientStatus;
  createdAt: Date;
  invoiceCount: number;
  activeSubscriptions: number;
  activeProjects: number;
  monthlyRecurringRevenue: number;
  totalLifetimeRevenue: number;
  totalCosts: number;
  profit: number;
  outstandingBalance: number;
  lastPaymentDate: Date | null;
  healthScore: number;
  healthBand: "Healthy" | "Watch" | "Risk";
};

export type SubscriptionRecord = {
  id: string;
  clientId: string;
  serviceName: string;
  monthlyCost: number;
  billingCycle: "MONTHLY" | "YEARLY";
  createdAt: Date;
};

export type InvoiceItemRecord = {
  id: string;
  title: string;
  description: string | null;
  quantity: number;
  unitPrice: number;
  total: number;
};

export type InvoiceListItem = {
  id: string;
  invoiceNumber: string;
  clientId: string;
  projectId: string | null;
  projectName: string | null;
  clientName: string;
  clientEmail: string;
  companyName: string;
  type: InvoiceType;
  status: InvoiceStatus;
  totalAmount: number;
  taxAmount: number;
  finalAmount: number;
  amountPaid: number;
  balanceAmount: number;
  projectCost: number;
  advancePercent: number | null;
  advanceAmount: number;
  timeline: string | null;
  issueDate: Date;
  dueDate: Date | null;
  createdAt: Date;
  itemCount: number;
  isOverdue: boolean;
};

export type ClientDetail = {
  id: string;
  name: string;
  email: string;
  companyName: string;
  contactPerson: string | null;
  phone: string | null;
  type: ClientType;
  status: ClientStatus;
  contractStatus: ContractStatus;
  startDate: Date | null;
  tags: string[];
  createdAt: Date;
  subscriptions: SubscriptionRecord[];
  invoices: InvoiceListItem[];
  projects: Array<{
    id: string;
    name: string;
    status: ProjectStatus;
    priority: Priority;
    deadline: Date | null;
    progress: number;
    delayed: boolean;
    milestoneCount: number;
  }>;
  payments: Array<{
    id: string;
    paymentDate: Date;
    amountReceived: number;
    method: PaymentMethod;
    referenceNumber: string | null;
    allocatedAmount: number;
  }>;
  assets: Array<{
    id: string;
    name: string;
    type: AssetType;
    provider: string | null;
    renewalDate: Date | null;
    internalCost: number;
    clientCharge: number;
    status: AssetStatus;
    margin: number;
  }>;
  metrics: {
    totalRevenue: number;
    totalCosts: number;
    profit: number;
    marginPercent: number;
    outstandingBalance: number;
    monthlyRecurringRevenue: number;
    healthScore: number;
    healthBand: "Healthy" | "Watch" | "Risk";
  };
};

export type InvoiceDetail = {
  id: string;
  invoiceNumber: string;
  type: InvoiceType;
  status: InvoiceStatus;
  totalAmount: number;
  taxAmount: number;
  discountAmount: number;
  finalAmount: number;
  amountPaid: number;
  balanceAmount: number;
  projectCost: number;
  advancePercent: number | null;
  advanceAmount: number;
  timeline: string | null;
  issueDate: Date;
  dueDate: Date | null;
  createdAt: Date;
  notes: string | null;
  client: {
    id: string;
    name: string;
    email: string;
    companyName: string;
  };
  project: {
    id: string;
    name: string;
  } | null;
  payments: Array<{
    id: string;
    amount: number;
    paymentDate: Date;
    method: PaymentMethod;
    referenceNumber: string | null;
  }>;
  items: InvoiceItemRecord[];
};

export type DashboardOverview = {
  clientCount: number;
  invoiceCount: number;
  draftCount: number;
  paidCount: number;
  subscriptionCount: number;
  generatedRevenue: number;
  activeProjects: number;
  monthlyRevenue: number;
  monthlyRecurringRevenue: number;
  outstandingInvoices: number;
  overdueInvoicesCount: number;
  monthlyCosts: number;
  estimatedMonthlyProfit: number;
  upcomingRenewalsCount: number;
  delayedProjectsCount: number;
  mostProfitableClients: ClientListItem[];
  lowMarginClients: ClientListItem[];
  clientsWithOverduePayments: ClientListItem[];
  upcomingRenewals: Array<{
    id: string;
    name: string;
    renewalDate: Date | null;
    client: { companyName: string };
    monthlyContribution: number;
  }>;
  deadlinesDueSoon: Array<{
    id: string;
    type: string;
    title: string;
    clientName: string;
    projectName: string | null;
    date: Date;
    status: string;
    href: string;
    daysRemaining: number;
    overdue: boolean;
    dueSoon: boolean;
    severity: string;
  }>;
  recentPayments: Array<{
    id: string;
    paymentDate: Date;
    amountReceived: number;
    allocatedAmount: number;
    unallocatedAmount: number;
    client: { companyName: string };
    method: PaymentMethod;
  }>;
  recentActivity: Array<{
    id: string;
    message: string;
    entityType: string;
    action: string;
    createdAt: Date;
  }>;
  paymentGraph: {
    expectedFromInvoices: number;
    receivedPayments: number;
    expectedFromOrders: number;
  };
};
