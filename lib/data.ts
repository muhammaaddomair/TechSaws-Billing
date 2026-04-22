import { Prisma } from "@/generated/prisma";
import { assertDatabaseUrl } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import {
  annualEquivalent,
  assetMargin,
  calculateHealthScore,
  currentMonthRange,
  daysBetween,
  decimalToNumber,
  invoiceBalance,
  isDueSoon,
  isInvoiceOverdue,
  isProjectDelayed,
  isUnprofitableAsset,
  marginPercent,
  monthlyEquivalent,
  roundMoney
} from "@/lib/business";
import {
  type ClientDetail,
  type ClientListItem,
  type DashboardOverview,
  type InvoiceDetail,
  type InvoiceListItem,
  type SubscriptionRecord
} from "@/lib/types";

type InvoiceForMapping = {
  id: string;
  invoiceNumber: string;
  clientId: string;
  projectId: string | null;
  type: string;
  status: string;
  totalAmount: Prisma.Decimal;
  taxAmount: Prisma.Decimal;
  finalAmount: Prisma.Decimal;
  amountPaid: Prisma.Decimal;
  balanceAmount: Prisma.Decimal;
  projectCost: Prisma.Decimal;
  advancePercent: Prisma.Decimal | null;
  advanceAmount: Prisma.Decimal;
  timeline: string | null;
  issueDate: Date;
  dueDate: Date | null;
  createdAt: Date;
  items: { id: string }[];
  client: { name: string; email?: string; companyName: string };
  project?: { name: string } | null;
};

function mapInvoiceListItem(invoice: InvoiceForMapping): InvoiceListItem {
  const paid = decimalToNumber(invoice.amountPaid);
  const finalAmount = decimalToNumber(invoice.finalAmount);
  const balance = invoice.balanceAmount ? decimalToNumber(invoice.balanceAmount) : invoiceBalance(finalAmount, paid);

  return {
    id: invoice.id,
    invoiceNumber: invoice.invoiceNumber,
    clientId: invoice.clientId,
    projectId: invoice.projectId,
    projectName: invoice.project?.name ?? null,
    clientName: invoice.client.name,
    clientEmail: invoice.client.email ?? "",
    companyName: invoice.client.companyName,
    type: invoice.type as InvoiceListItem["type"],
    status: invoice.status as InvoiceListItem["status"],
    totalAmount: decimalToNumber(invoice.totalAmount),
    taxAmount: decimalToNumber(invoice.taxAmount),
    finalAmount,
    amountPaid: paid,
    balanceAmount: balance,
    projectCost: decimalToNumber(invoice.projectCost),
    advancePercent: invoice.advancePercent === null ? null : decimalToNumber(invoice.advancePercent),
    advanceAmount: decimalToNumber(invoice.advanceAmount),
    timeline: invoice.timeline,
    issueDate: invoice.issueDate,
    dueDate: invoice.dueDate,
    createdAt: invoice.createdAt,
    itemCount: invoice.items.length,
    isOverdue: isInvoiceOverdue(invoice.dueDate, balance)
  };
}

function mapSubscription(subscription: {
  id: string;
  clientId: string;
  serviceName: string;
  monthlyCost: Prisma.Decimal;
  billingCycle: string;
  createdAt: Date;
}): SubscriptionRecord {
  return {
    ...subscription,
    billingCycle: subscription.billingCycle === "YEARLY" ? "YEARLY" : "MONTHLY",
    monthlyCost: decimalToNumber(subscription.monthlyCost)
  };
}

export async function getClients(): Promise<ClientListItem[]> {
  assertDatabaseUrl();
  const clients = await prisma.client.findMany({
    where: { archivedAt: null },
    orderBy: { createdAt: "desc" },
    include: {
      projects: true,
      invoices: true,
      payments: { orderBy: { paymentDate: "desc" }, take: 1 },
      assets: true,
      revenueRecords: true,
      costRecords: true,
      _count: { select: { invoices: true, subscriptions: true } }
    }
  });

  return clients.map((client) => {
    const invoiceOutstanding = client.invoices.reduce((sum, invoice) => {
      const balance = decimalToNumber(invoice.balanceAmount) || invoiceBalance(decimalToNumber(invoice.finalAmount), decimalToNumber(invoice.amountPaid));
      return sum + balance;
    }, 0);
    const recognizedRevenue =
      client.revenueRecords
        .filter((record) => record.status === "RECOGNIZED")
        .reduce((sum, record) => sum + decimalToNumber(record.amount), 0) +
      client.invoices
        .filter((invoice) => ["GENERATED", "SENT", "PARTIALLY_PAID", "PAID"].includes(invoice.status))
        .reduce((sum, invoice) => sum + decimalToNumber(invoice.finalAmount), 0);
    const costs = client.costRecords.reduce((sum, record) => sum + decimalToNumber(record.amount), 0) + client.assets.reduce((sum, asset) => sum + decimalToNumber(asset.internalCost), 0);
    const profit = recognizedRevenue - costs;
    const overdueInvoices = client.invoices.filter((invoice) => {
      const balance = decimalToNumber(invoice.balanceAmount) || invoiceBalance(decimalToNumber(invoice.finalAmount), decimalToNumber(invoice.amountPaid));
      return isInvoiceOverdue(invoice.dueDate, balance);
    });
    const delayedProjects = client.projects.filter((project) => isProjectDelayed(project.revisedDeadline ?? project.deadline, project.status));
    const health = calculateHealthScore({
      overdueInvoices: overdueInvoices.length,
      overdueAmount: overdueInvoices.reduce((sum, invoice) => sum + decimalToNumber(invoice.balanceAmount), 0),
      delayedProjects: delayedProjects.length,
      marginPercent: marginPercent(recognizedRevenue, costs)
    });

    return {
      id: client.id,
      name: client.name,
      email: client.email,
      companyName: client.companyName,
      contactPerson: client.contactPerson,
      phone: client.phone,
      type: client.type,
      status: client.status,
      createdAt: client.createdAt,
      invoiceCount: client._count.invoices,
      activeSubscriptions: client._count.subscriptions,
      activeProjects: client.projects.filter((project) => !["COMPLETED", "DELIVERED", "CANCELLED"].includes(project.status)).length,
      monthlyRecurringRevenue: client.assets
        .filter((asset) => asset.status === "ACTIVE")
        .reduce((sum, asset) => sum + monthlyEquivalent(decimalToNumber(asset.clientCharge), asset.billingFrequency), 0),
      totalLifetimeRevenue: roundMoney(recognizedRevenue),
      totalCosts: roundMoney(costs),
      profit: roundMoney(profit),
      outstandingBalance: roundMoney(invoiceOutstanding),
      lastPaymentDate: client.payments[0]?.paymentDate ?? null,
      healthScore: health.score,
      healthBand: health.band
    };
  });
}

export async function getClientOptions() {
  assertDatabaseUrl();
  return prisma.client.findMany({
    where: { archivedAt: null },
    orderBy: { name: "asc" },
    select: { id: true, name: true, companyName: true }
  });
}

export async function getProjectOptions() {
  assertDatabaseUrl();
  return prisma.project.findMany({
    where: { archivedAt: null },
    orderBy: { name: "asc" },
    select: { id: true, name: true, clientId: true }
  });
}

export async function getClientDetail(clientId: string): Promise<ClientDetail | null> {
  assertDatabaseUrl();
  const client = await prisma.client.findUnique({
    where: { id: clientId },
    include: {
      subscriptions: { orderBy: { createdAt: "desc" } },
      projects: { orderBy: { createdAt: "desc" }, include: { milestones: true } },
      invoices: {
        orderBy: { createdAt: "desc" },
        include: { client: { select: { name: true, email: true, companyName: true } }, project: { select: { name: true } }, items: { select: { id: true } } }
      },
      payments: { orderBy: { paymentDate: "desc" }, include: { allocations: { include: { invoice: true } } } },
      assets: { orderBy: { renewalDate: "asc" } },
      revenueRecords: true,
      costRecords: true
    }
  });

  if (!client) {
    return null;
  }

  const list = (await getClients()).find((item) => item.id === client.id);

  return {
    id: client.id,
    name: client.name,
    email: client.email,
    companyName: client.companyName,
    contactPerson: client.contactPerson,
    phone: client.phone,
    type: client.type,
    status: client.status,
    contractStatus: client.contractStatus,
    startDate: client.startDate,
    tags: client.tags,
    createdAt: client.createdAt,
    subscriptions: client.subscriptions.map(mapSubscription),
    invoices: client.invoices.map(mapInvoiceListItem),
    projects: client.projects.map((project) => ({
      id: project.id,
      name: project.name,
      status: project.status,
      priority: project.priority,
      deadline: project.deadline,
      progress: project.progress,
      delayed: isProjectDelayed(project.revisedDeadline ?? project.deadline, project.status),
      milestoneCount: project.milestones.length
    })),
    payments: client.payments.map((payment) => ({
      id: payment.id,
      paymentDate: payment.paymentDate,
      amountReceived: decimalToNumber(payment.amountReceived),
      method: payment.method,
      referenceNumber: payment.referenceNumber,
      allocatedAmount: payment.allocations.reduce((sum, allocation) => sum + decimalToNumber(allocation.amount), 0)
    })),
    assets: client.assets.map((asset) => ({
      id: asset.id,
      name: asset.name,
      type: asset.type,
      provider: asset.provider,
      renewalDate: asset.renewalDate,
      internalCost: decimalToNumber(asset.internalCost),
      clientCharge: decimalToNumber(asset.clientCharge),
      status: asset.status,
      margin: assetMargin(decimalToNumber(asset.internalCost), decimalToNumber(asset.clientCharge))
    })),
    metrics: {
      totalRevenue: list?.totalLifetimeRevenue ?? 0,
      totalCosts: list?.totalCosts ?? 0,
      profit: list?.profit ?? 0,
      marginPercent: marginPercent(list?.totalLifetimeRevenue ?? 0, list?.totalCosts ?? 0),
      outstandingBalance: list?.outstandingBalance ?? 0,
      monthlyRecurringRevenue: list?.monthlyRecurringRevenue ?? 0,
      healthScore: list?.healthScore ?? 100,
      healthBand: list?.healthBand ?? "Healthy"
    }
  };
}

export async function getInvoices(filters?: {
  clientId?: string;
  type?: InvoiceListItem["type"];
  status?: InvoiceListItem["status"];
  search?: string;
  paymentState?: "PAID" | "PENDING" | "PARTIAL";
}): Promise<InvoiceListItem[]> {
  assertDatabaseUrl();
  const invoices = await prisma.invoice.findMany({
    where: {
      clientId: filters?.clientId || undefined,
      type: filters?.type || undefined,
      status: filters?.status || undefined,
      OR: filters?.search
        ? [
            { invoiceNumber: { contains: filters.search, mode: "insensitive" } },
            { client: { name: { contains: filters.search, mode: "insensitive" } } },
            { client: { companyName: { contains: filters.search, mode: "insensitive" } } },
            { project: { name: { contains: filters.search, mode: "insensitive" } } }
          ]
        : undefined
    },
    orderBy: { createdAt: "desc" },
    include: {
      client: { select: { name: true, email: true, companyName: true } },
      project: { select: { name: true } },
      items: { select: { id: true } }
    }
  });

  return invoices.map(mapInvoiceListItem).filter((invoice) => {
    if (!filters?.paymentState) {
      return true;
    }

    if (filters.paymentState === "PAID") {
      return invoice.balanceAmount <= 0;
    }

    if (filters.paymentState === "PARTIAL") {
      return invoice.amountPaid > 0 && invoice.balanceAmount > 0;
    }

    return invoice.amountPaid <= 0 && invoice.balanceAmount > 0;
  });
}

export async function getInvoiceDetail(invoiceId: string): Promise<InvoiceDetail | null> {
  assertDatabaseUrl();
  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: {
      client: { select: { id: true, name: true, email: true, companyName: true } },
      project: { select: { id: true, name: true } },
      allocations: { include: { payment: true }, orderBy: { createdAt: "desc" } },
      items: { orderBy: { createdAt: "asc" } }
    }
  });

  if (!invoice) {
    return null;
  }

  return {
    id: invoice.id,
    invoiceNumber: invoice.invoiceNumber,
    type: invoice.type,
    status: invoice.status,
    totalAmount: decimalToNumber(invoice.totalAmount),
    taxAmount: decimalToNumber(invoice.taxAmount),
    discountAmount: decimalToNumber(invoice.discountAmount),
    finalAmount: decimalToNumber(invoice.finalAmount),
    amountPaid: decimalToNumber(invoice.amountPaid),
    balanceAmount: decimalToNumber(invoice.balanceAmount),
    projectCost: decimalToNumber(invoice.projectCost),
    advancePercent: invoice.advancePercent === null ? null : decimalToNumber(invoice.advancePercent),
    advanceAmount: decimalToNumber(invoice.advanceAmount),
    timeline: invoice.timeline,
    issueDate: invoice.issueDate,
    dueDate: invoice.dueDate,
    createdAt: invoice.createdAt,
    notes: invoice.notes,
    client: invoice.client,
    project: invoice.project,
    payments: invoice.allocations.map((allocation) => ({
      id: allocation.payment.id,
      amount: decimalToNumber(allocation.amount),
      paymentDate: allocation.payment.paymentDate,
      method: allocation.payment.method,
      referenceNumber: allocation.payment.referenceNumber
    })),
    items: invoice.items.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      quantity: item.quantity,
      unitPrice: decimalToNumber(item.unitPrice),
      total: decimalToNumber(item.total)
    }))
  };
}

export async function getDraftInvoice(invoiceId: string) {
  assertDatabaseUrl();
  return prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: { items: { orderBy: { createdAt: "asc" } } }
  });
}

export async function getProjects() {
  assertDatabaseUrl();
  const projects = await prisma.project.findMany({
    where: { archivedAt: null },
    orderBy: [{ deadline: "asc" }, { createdAt: "desc" }],
    include: {
      client: { select: { id: true, name: true, companyName: true } },
      invoices: true,
      milestones: true
    }
  });

  return projects.map((project) => ({
    ...project,
    budgetAmount: decimalToNumber(project.budgetAmount),
    internalCostEstimate: decimalToNumber(project.internalCostEstimate),
    deductionAmount: decimalToNumber(project.deductionAmount),
    delayed: isProjectDelayed(project.revisedDeadline ?? project.deadline, project.status),
    daysDelayed: isProjectDelayed(project.revisedDeadline ?? project.deadline, project.status)
      ? Math.abs(daysBetween(project.revisedDeadline ?? project.deadline ?? new Date()))
      : 0,
    invoiceStatus: project.invoices.some((invoice) => invoice.status === "PAID") ? "Paid" : project.invoices.length ? "Open" : "Unbilled",
    milestoneProgress:
      project.milestones.length === 0
        ? project.progress
        : Math.round((project.milestones.filter((milestone) => milestone.status === "DONE").length / project.milestones.length) * 100)
  }));
}

export async function getProjectDetail(projectId: string) {
  assertDatabaseUrl();
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      client: { select: { id: true, name: true, companyName: true } },
      milestones: { orderBy: { dueDate: "asc" } },
      tasks: { orderBy: { dueDate: "asc" } },
      invoices: { include: { client: { select: { name: true, email: true, companyName: true } }, project: { select: { name: true } }, items: { select: { id: true } } } },
      revenueRecords: true,
      costRecords: true,
      revisions: { orderBy: { createdAt: "desc" } },
      scopeChanges: { orderBy: { createdAt: "desc" } }
    }
  });

  if (!project) {
    return null;
  }

  const revenue = project.revenueRecords.reduce((sum, record) => sum + decimalToNumber(record.amount), 0) + project.invoices.reduce((sum, invoice) => sum + decimalToNumber(invoice.finalAmount), 0);
  const costs = project.costRecords.reduce((sum, record) => sum + decimalToNumber(record.amount), 0) + decimalToNumber(project.internalCostEstimate);

  return {
    ...project,
    budgetAmount: decimalToNumber(project.budgetAmount),
    internalCostEstimate: decimalToNumber(project.internalCostEstimate),
    deductionAmount: decimalToNumber(project.deductionAmount),
    delayed: isProjectDelayed(project.revisedDeadline ?? project.deadline, project.status),
    revenue,
    costs,
    profit: roundMoney(revenue - costs),
    marginPercent: marginPercent(revenue, costs),
    invoices: project.invoices.map(mapInvoiceListItem)
  };
}

export async function getAssets() {
  assertDatabaseUrl();
  const assets = await prisma.asset.findMany({
    where: { archivedAt: null },
    orderBy: [{ renewalDate: "asc" }, { createdAt: "desc" }],
    include: { client: { select: { id: true, name: true, companyName: true } }, renewals: { orderBy: { dateRenewed: "desc" }, take: 3 } }
  });

  return assets.map((asset) => {
    const cost = decimalToNumber(asset.internalCost);
    const charge = decimalToNumber(asset.clientCharge);
    return {
      ...asset,
      internalCost: cost,
      clientCharge: charge,
      margin: assetMargin(cost, charge),
      marginPercent: marginPercent(charge, cost),
      dueSoon: isDueSoon(asset.renewalDate, asset.alertDays),
      unprofitable: isUnprofitableAsset(cost, charge),
      monthlyContribution: monthlyEquivalent(charge, asset.billingFrequency)
    };
  });
}

export async function getAssetDetail(assetId: string) {
  assertDatabaseUrl();
  const asset = await prisma.asset.findUnique({
    where: { id: assetId },
    include: { client: { select: { id: true, name: true, companyName: true } }, renewals: { orderBy: { dateRenewed: "desc" } } }
  });

  if (!asset) {
    return null;
  }

  const cost = decimalToNumber(asset.internalCost);
  const charge = decimalToNumber(asset.clientCharge);

  return {
    ...asset,
    internalCost: cost,
    clientCharge: charge,
    margin: assetMargin(cost, charge),
    marginPercent: marginPercent(charge, cost),
    dueSoon: isDueSoon(asset.renewalDate, asset.alertDays),
    unprofitable: isUnprofitableAsset(cost, charge),
    renewals: asset.renewals.map((renewal) => ({
      ...renewal,
      cost: decimalToNumber(renewal.cost),
      clientCharge: decimalToNumber(renewal.clientCharge)
    }))
  };
}

export async function getPayments() {
  assertDatabaseUrl();
  const payments = await prisma.payment.findMany({
    orderBy: { paymentDate: "desc" },
    include: {
      client: { select: { id: true, name: true, companyName: true } },
      enteredBy: { select: { name: true, email: true } },
      allocations: { include: { invoice: { select: { id: true, invoiceNumber: true } } } }
    }
  });

  return payments.map((payment) => {
    const allocatedAmount = payment.allocations.reduce((sum, allocation) => sum + decimalToNumber(allocation.amount), 0);
    const amountReceived = decimalToNumber(payment.amountReceived);
    return {
      ...payment,
      amountReceived,
      allocatedAmount,
      unallocatedAmount: roundMoney(amountReceived - allocatedAmount)
    };
  });
}

export async function getTasks() {
  assertDatabaseUrl();
  return prisma.task.findMany({
    orderBy: [{ dueDate: "asc" }, { createdAt: "desc" }],
    include: {
      client: { select: { id: true, name: true, companyName: true } },
      project: { select: { id: true, name: true } },
      assignee: { select: { name: true, email: true } },
      createdBy: { select: { name: true, email: true } }
    }
  });
}

export async function getFinanceSummary() {
  assertDatabaseUrl();
  const [clients, revenueRecords, costRecords, assets, invoices] = await Promise.all([
    getClients(),
    prisma.revenueRecord.findMany({ include: { client: true, project: true }, orderBy: { recognizedDate: "desc" } }),
    prisma.costRecord.findMany({ include: { client: true, project: true, asset: true }, orderBy: { incurredDate: "desc" } }),
    getAssets(),
    getInvoices()
  ]);
  const revenueTotal =
    revenueRecords.filter((record) => record.status === "RECOGNIZED").reduce((sum, record) => sum + decimalToNumber(record.amount), 0) +
    invoices.filter((invoice) => ["GENERATED", "SENT", "PARTIALLY_PAID", "PAID"].includes(invoice.status)).reduce((sum, invoice) => sum + invoice.finalAmount, 0);
  const costTotal = costRecords.reduce((sum, record) => sum + decimalToNumber(record.amount), 0) + assets.reduce((sum, asset) => sum + asset.internalCost, 0);
  const mrr =
    revenueRecords.filter((record) => record.status === "RECOGNIZED").reduce((sum, record) => sum + monthlyEquivalent(decimalToNumber(record.amount), record.frequency), 0) +
    assets.filter((asset) => asset.status === "ACTIVE").reduce((sum, asset) => sum + asset.monthlyContribution, 0);

  return {
    revenueTotal: roundMoney(revenueTotal),
    costTotal: roundMoney(costTotal),
    profit: roundMoney(revenueTotal - costTotal),
    marginPercent: marginPercent(revenueTotal, costTotal),
    mrr: roundMoney(mrr),
    arr: annualEquivalent(mrr, "MONTHLY"),
    outstanding: invoices.reduce((sum, invoice) => sum + invoice.balanceAmount, 0),
    clients,
    revenueRecords: revenueRecords.map((record) => ({ ...record, amount: decimalToNumber(record.amount) })),
    costRecords: costRecords.map((record) => ({ ...record, amount: decimalToNumber(record.amount) }))
  };
}

export async function getDeadlines() {
  assertDatabaseUrl();
  const [projects, milestones, invoices, assets, tasks] = await Promise.all([
    prisma.project.findMany({ where: { deadline: { not: null } }, include: { client: true } }),
    prisma.milestone.findMany({ where: { dueDate: { not: null } }, include: { project: { include: { client: true } } } }),
    prisma.invoice.findMany({ where: { dueDate: { not: null } }, include: { client: true } }),
    prisma.asset.findMany({ where: { renewalDate: { not: null } }, include: { client: true } }),
    prisma.task.findMany({ where: { dueDate: { not: null } }, include: { client: true, project: true } })
  ]);

  const items = [
    ...projects.map((project) => ({
      id: project.id,
      type: "Project",
      title: project.name,
      clientName: project.client.companyName,
      projectName: project.name,
      date: project.revisedDeadline ?? project.deadline!,
      status: project.status,
      href: `/dashboard/projects/${project.id}`
    })),
    ...milestones.map((milestone) => ({
      id: milestone.id,
      type: "Milestone",
      title: milestone.title,
      clientName: milestone.project.client.companyName,
      projectName: milestone.project.name,
      date: milestone.dueDate!,
      status: milestone.status,
      href: `/dashboard/projects/${milestone.projectId}`
    })),
    ...invoices.map((invoice) => ({
      id: invoice.id,
      type: "Invoice",
      title: invoice.invoiceNumber,
      clientName: invoice.client.companyName,
      projectName: null,
      date: invoice.dueDate!,
      status: invoice.status,
      href: `/dashboard/invoices/${invoice.id}`
    })),
    ...assets.map((asset) => ({
      id: asset.id,
      type: "Asset",
      title: asset.name,
      clientName: asset.client.companyName,
      projectName: null,
      date: asset.renewalDate!,
      status: asset.status,
      href: `/dashboard/assets/${asset.id}`
    })),
    ...tasks.map((task) => ({
      id: task.id,
      type: "Task",
      title: task.title,
      clientName: task.client?.companyName ?? "Internal",
      projectName: task.project?.name ?? null,
      date: task.dueDate!,
      status: task.status,
      href: "/dashboard/tasks"
    }))
  ].map((item) => {
    const days = daysBetween(item.date);
    return {
      ...item,
      daysRemaining: days,
      overdue: days < 0,
      dueSoon: days >= 0 && days <= 7,
      severity: days < 0 ? "danger" : days <= 2 ? "warning" : "default"
    };
  });

  return items.sort((a, b) => a.date.getTime() - b.date.getTime());
}

export async function getActivityLogs() {
  assertDatabaseUrl();
  return prisma.activityLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { actor: { select: { name: true, email: true } } }
  });
}

export async function getDashboardOverview(): Promise<DashboardOverview> {
  assertDatabaseUrl();

  const month = currentMonthRange();
  const [clients, invoices, assets, projects, payments, finance, deadlines, activity] = await Promise.all([
    getClients(),
    getInvoices(),
    getAssets(),
    getProjects(),
    getPayments(),
    getFinanceSummary(),
    getDeadlines(),
    getActivityLogs()
  ]);
  const monthlyRevenue = invoices
    .filter((invoice) => invoice.issueDate >= month.start && invoice.issueDate < month.end)
    .reduce((sum, invoice) => sum + invoice.finalAmount, 0);
  const monthlyCosts = finance.costRecords
    .filter((record) => record.incurredDate >= month.start && record.incurredDate < month.end)
    .reduce((sum, record) => sum + record.amount, 0);
  const overdueInvoices = invoices.filter((invoice) => invoice.isOverdue);
  const delayedProjects = projects.filter((project) => project.delayed);
  const upcomingRenewals = assets.filter((asset) => asset.dueSoon);
  const receivedPayments = payments.reduce((sum, payment) => sum + payment.amountReceived, 0);
  const expectedFromInvoices = invoices.reduce((sum, invoice) => sum + invoice.finalAmount, 0);
  const expectedFromOrders = projects.reduce((sum, project) => sum + project.budgetAmount, 0);

  return {
    clientCount: clients.length,
    invoiceCount: invoices.length,
    draftCount: invoices.filter((invoice) => invoice.status === "DRAFT").length,
    paidCount: invoices.filter((invoice) => invoice.status === "PAID").length,
    subscriptionCount: assets.filter((asset) => asset.status === "ACTIVE").length,
    generatedRevenue: finance.revenueTotal,
    activeProjects: projects.filter((project) => !["COMPLETED", "DELIVERED", "CANCELLED"].includes(project.status)).length,
    monthlyRevenue: roundMoney(monthlyRevenue),
    monthlyRecurringRevenue: finance.mrr,
    outstandingInvoices: roundMoney(invoices.reduce((sum, invoice) => sum + invoice.balanceAmount, 0)),
    overdueInvoicesCount: overdueInvoices.length,
    monthlyCosts: roundMoney(monthlyCosts),
    estimatedMonthlyProfit: roundMoney(monthlyRevenue - monthlyCosts),
    upcomingRenewalsCount: upcomingRenewals.length,
    delayedProjectsCount: delayedProjects.length,
    mostProfitableClients: [...clients].sort((a, b) => b.profit - a.profit).slice(0, 5),
    lowMarginClients: [...clients].filter((client) => client.totalLifetimeRevenue > 0).sort((a, b) => a.profit - b.profit).slice(0, 5),
    clientsWithOverduePayments: clients.filter((client) => client.outstandingBalance > 0).slice(0, 5),
    upcomingRenewals: upcomingRenewals.slice(0, 8),
    deadlinesDueSoon: deadlines.filter((deadline) => deadline.dueSoon || deadline.overdue).slice(0, 8),
    recentPayments: payments.slice(0, 6),
    recentActivity: activity.slice(0, 8),
    paymentGraph: {
      expectedFromInvoices: roundMoney(expectedFromInvoices),
      receivedPayments: roundMoney(receivedPayments),
      expectedFromOrders: roundMoney(expectedFromOrders)
    }
  };
}
