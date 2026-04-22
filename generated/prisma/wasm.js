
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.22.0
 * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
 */
Prisma.prismaVersion = {
  client: "5.22.0",
  engine: "605197351a3c8bdd595af2d2a9bc3025bca48ea2"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  email: 'email',
  name: 'name',
  passwordHash: 'passwordHash',
  permissions: 'permissions',
  role: 'role',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ClientScalarFieldEnum = {
  id: 'id',
  name: 'name',
  email: 'email',
  companyName: 'companyName',
  contactPerson: 'contactPerson',
  phone: 'phone',
  type: 'type',
  status: 'status',
  contractStatus: 'contractStatus',
  startDate: 'startDate',
  tags: 'tags',
  ownerId: 'ownerId',
  archivedAt: 'archivedAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.InvoiceScalarFieldEnum = {
  id: 'id',
  invoiceNumber: 'invoiceNumber',
  clientId: 'clientId',
  projectId: 'projectId',
  type: 'type',
  totalAmount: 'totalAmount',
  taxAmount: 'taxAmount',
  discountAmount: 'discountAmount',
  finalAmount: 'finalAmount',
  amountPaid: 'amountPaid',
  balanceAmount: 'balanceAmount',
  projectCost: 'projectCost',
  advancePercent: 'advancePercent',
  advanceAmount: 'advanceAmount',
  timeline: 'timeline',
  status: 'status',
  issueDate: 'issueDate',
  dueDate: 'dueDate',
  sentAt: 'sentAt',
  cancelledAt: 'cancelledAt',
  notes: 'notes',
  internalComments: 'internalComments',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.InvoiceItemScalarFieldEnum = {
  id: 'id',
  invoiceId: 'invoiceId',
  title: 'title',
  description: 'description',
  category: 'category',
  quantity: 'quantity',
  unitPrice: 'unitPrice',
  total: 'total',
  recurring: 'recurring',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SubscriptionScalarFieldEnum = {
  id: 'id',
  clientId: 'clientId',
  serviceName: 'serviceName',
  monthlyCost: 'monthlyCost',
  billingCycle: 'billingCycle',
  status: 'status',
  nextRenewal: 'nextRenewal',
  notes: 'notes',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ProjectScalarFieldEnum = {
  id: 'id',
  clientId: 'clientId',
  name: 'name',
  type: 'type',
  description: 'description',
  scopeSummary: 'scopeSummary',
  status: 'status',
  priority: 'priority',
  startDate: 'startDate',
  deadline: 'deadline',
  revisedDeadline: 'revisedDeadline',
  deliveryDate: 'deliveryDate',
  budgetAmount: 'budgetAmount',
  internalCostEstimate: 'internalCostEstimate',
  progress: 'progress',
  assignedOwnerId: 'assignedOwnerId',
  blockers: 'blockers',
  revisionCount: 'revisionCount',
  scopeChangeCount: 'scopeChangeCount',
  delayReason: 'delayReason',
  internalResponsibility: 'internalResponsibility',
  clientCausedDelay: 'clientCausedDelay',
  penaltyNote: 'penaltyNote',
  deductionAmount: 'deductionAmount',
  archivedAt: 'archivedAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.MilestoneScalarFieldEnum = {
  id: 'id',
  projectId: 'projectId',
  title: 'title',
  description: 'description',
  dueDate: 'dueDate',
  status: 'status',
  completionDate: 'completionDate',
  owner: 'owner',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.RevenueRecordScalarFieldEnum = {
  id: 'id',
  clientId: 'clientId',
  projectId: 'projectId',
  invoiceId: 'invoiceId',
  sourceType: 'sourceType',
  reference: 'reference',
  frequency: 'frequency',
  amount: 'amount',
  status: 'status',
  recognizedDate: 'recognizedDate',
  notes: 'notes',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CostRecordScalarFieldEnum = {
  id: 'id',
  clientId: 'clientId',
  projectId: 'projectId',
  assetId: 'assetId',
  costType: 'costType',
  amount: 'amount',
  billingFrequency: 'billingFrequency',
  vendor: 'vendor',
  incurredDate: 'incurredDate',
  notes: 'notes',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PaymentScalarFieldEnum = {
  id: 'id',
  clientId: 'clientId',
  paymentDate: 'paymentDate',
  amountReceived: 'amountReceived',
  currency: 'currency',
  method: 'method',
  referenceNumber: 'referenceNumber',
  notes: 'notes',
  enteredById: 'enteredById',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PaymentAllocationScalarFieldEnum = {
  id: 'id',
  paymentId: 'paymentId',
  invoiceId: 'invoiceId',
  amount: 'amount',
  createdAt: 'createdAt'
};

exports.Prisma.AssetScalarFieldEnum = {
  id: 'id',
  clientId: 'clientId',
  name: 'name',
  type: 'type',
  provider: 'provider',
  providerAccountReference: 'providerAccountReference',
  purchaseDate: 'purchaseDate',
  renewalDate: 'renewalDate',
  billingFrequency: 'billingFrequency',
  internalCost: 'internalCost',
  clientCharge: 'clientCharge',
  status: 'status',
  autoRenewal: 'autoRenewal',
  alertDays: 'alertDays',
  notes: 'notes',
  archivedAt: 'archivedAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.AssetRenewalScalarFieldEnum = {
  id: 'id',
  assetId: 'assetId',
  dateRenewed: 'dateRenewed',
  newRenewalDate: 'newRenewalDate',
  cost: 'cost',
  clientCharge: 'clientCharge',
  notes: 'notes',
  createdAt: 'createdAt'
};

exports.Prisma.TaskScalarFieldEnum = {
  id: 'id',
  title: 'title',
  description: 'description',
  status: 'status',
  priority: 'priority',
  dueDate: 'dueDate',
  clientId: 'clientId',
  projectId: 'projectId',
  assigneeId: 'assigneeId',
  createdById: 'createdById',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.InternalNoteScalarFieldEnum = {
  id: 'id',
  entityType: 'entityType',
  entityId: 'entityId',
  body: 'body',
  authorId: 'authorId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ActivityLogScalarFieldEnum = {
  id: 'id',
  entityType: 'entityType',
  entityId: 'entityId',
  action: 'action',
  message: 'message',
  actorId: 'actorId',
  metadata: 'metadata',
  createdAt: 'createdAt'
};

exports.Prisma.RevisionEntryScalarFieldEnum = {
  id: 'id',
  projectId: 'projectId',
  title: 'title',
  notes: 'notes',
  createdAt: 'createdAt'
};

exports.Prisma.ScopeChangeScalarFieldEnum = {
  id: 'id',
  projectId: 'projectId',
  title: 'title',
  description: 'description',
  timeImpactDays: 'timeImpactDays',
  priceImpact: 'priceImpact',
  approvalState: 'approvalState',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullableJsonNullValueInput = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};
exports.UserRole = exports.$Enums.UserRole = {
  OWNER: 'OWNER',
  PARTNER: 'PARTNER',
  STAFF: 'STAFF'
};

exports.ClientType = exports.$Enums.ClientType = {
  SERVICE: 'SERVICE',
  SAAS: 'SAAS',
  INFRA_ONLY: 'INFRA_ONLY',
  HYBRID: 'HYBRID',
  ONE_TIME_PROJECT: 'ONE_TIME_PROJECT',
  RETAINER: 'RETAINER'
};

exports.ClientStatus = exports.$Enums.ClientStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  ARCHIVED: 'ARCHIVED',
  WATCH: 'WATCH',
  RISK: 'RISK'
};

exports.ContractStatus = exports.$Enums.ContractStatus = {
  ACTIVE: 'ACTIVE',
  PENDING: 'PENDING',
  EXPIRED: 'EXPIRED',
  NONE: 'NONE'
};

exports.InvoiceType = exports.$Enums.InvoiceType = {
  DEVELOPMENT: 'DEVELOPMENT',
  SUBSCRIPTION: 'SUBSCRIPTION',
  SERVICE: 'SERVICE',
  HOSTING: 'HOSTING',
  DOMAIN: 'DOMAIN',
  MAILBOX: 'MAILBOX',
  MAINTENANCE: 'MAINTENANCE',
  OTHER: 'OTHER'
};

exports.InvoiceStatus = exports.$Enums.InvoiceStatus = {
  DRAFT: 'DRAFT',
  GENERATED: 'GENERATED',
  SENT: 'SENT',
  PARTIALLY_PAID: 'PARTIALLY_PAID',
  PAID: 'PAID',
  OVERDUE: 'OVERDUE',
  CANCELLED: 'CANCELLED'
};

exports.RevenueCategory = exports.$Enums.RevenueCategory = {
  PROJECT_SERVICE: 'PROJECT_SERVICE',
  SUBSCRIPTION: 'SUBSCRIPTION',
  HOSTING_SERVER: 'HOSTING_SERVER',
  DOMAIN: 'DOMAIN',
  MAILBOX_EMAIL: 'MAILBOX_EMAIL',
  MAINTENANCE_SUPPORT: 'MAINTENANCE_SUPPORT',
  OTHER_RECURRING: 'OTHER_RECURRING',
  OTHER_ONE_TIME: 'OTHER_ONE_TIME'
};

exports.BillingCycle = exports.$Enums.BillingCycle = {
  MONTHLY: 'MONTHLY',
  YEARLY: 'YEARLY',
  ONE_TIME: 'ONE_TIME',
  QUARTERLY: 'QUARTERLY',
  CUSTOM: 'CUSTOM'
};

exports.AssetStatus = exports.$Enums.AssetStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  EXPIRING: 'EXPIRING',
  EXPIRED: 'EXPIRED',
  CANCELLED: 'CANCELLED'
};

exports.ProjectType = exports.$Enums.ProjectType = {
  SOFTWARE_PRODUCT: 'SOFTWARE_PRODUCT',
  CLIENT_SERVICE: 'CLIENT_SERVICE',
  INTERNAL_TOOL: 'INTERNAL_TOOL',
  SUBSCRIPTION_SETUP: 'SUBSCRIPTION_SETUP',
  INFRASTRUCTURE: 'INFRASTRUCTURE',
  SUPPORT: 'SUPPORT',
  OTHER: 'OTHER'
};

exports.ProjectStatus = exports.$Enums.ProjectStatus = {
  NOT_STARTED: 'NOT_STARTED',
  PLANNING: 'PLANNING',
  IN_PROGRESS: 'IN_PROGRESS',
  ON_HOLD: 'ON_HOLD',
  AWAITING_CLIENT: 'AWAITING_CLIENT',
  UNDER_REVIEW: 'UNDER_REVIEW',
  DELIVERED: 'DELIVERED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED'
};

exports.Priority = exports.$Enums.Priority = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL'
};

exports.MilestoneStatus = exports.$Enums.MilestoneStatus = {
  TODO: 'TODO',
  IN_PROGRESS: 'IN_PROGRESS',
  DONE: 'DONE',
  BLOCKED: 'BLOCKED',
  CANCELLED: 'CANCELLED'
};

exports.FinanceStatus = exports.$Enums.FinanceStatus = {
  PLANNED: 'PLANNED',
  RECOGNIZED: 'RECOGNIZED',
  PENDING: 'PENDING',
  CANCELLED: 'CANCELLED'
};

exports.CostCategory = exports.$Enums.CostCategory = {
  HOSTING_SERVER: 'HOSTING_SERVER',
  DOMAIN: 'DOMAIN',
  MAILBOX_EMAIL: 'MAILBOX_EMAIL',
  THIRD_PARTY_SOFTWARE: 'THIRD_PARTY_SOFTWARE',
  CONTRACTOR_INTERNAL: 'CONTRACTOR_INTERNAL',
  PAYMENT_FEES: 'PAYMENT_FEES',
  OTHER_OPERATIONAL: 'OTHER_OPERATIONAL'
};

exports.PaymentMethod = exports.$Enums.PaymentMethod = {
  BANK_TRANSFER: 'BANK_TRANSFER',
  CASH: 'CASH',
  JAZZCASH: 'JAZZCASH',
  EASYPAISA: 'EASYPAISA',
  STRIPE_MANUAL: 'STRIPE_MANUAL',
  PAYPAL_MANUAL: 'PAYPAL_MANUAL',
  OTHER: 'OTHER'
};

exports.AssetType = exports.$Enums.AssetType = {
  DOMAIN: 'DOMAIN',
  VPS_SERVER: 'VPS_SERVER',
  CLOUD_HOSTING: 'CLOUD_HOSTING',
  MAILBOX_EMAIL: 'MAILBOX_EMAIL',
  SAAS_SUBSCRIPTION: 'SAAS_SUBSCRIPTION',
  SSL: 'SSL',
  MAINTENANCE_SUPPORT: 'MAINTENANCE_SUPPORT',
  OTHER_RECURRING_SERVICE: 'OTHER_RECURRING_SERVICE'
};

exports.TaskStatus = exports.$Enums.TaskStatus = {
  TODO: 'TODO',
  IN_PROGRESS: 'IN_PROGRESS',
  BLOCKED: 'BLOCKED',
  DONE: 'DONE',
  CANCELLED: 'CANCELLED'
};

exports.NoteEntityType = exports.$Enums.NoteEntityType = {
  CLIENT: 'CLIENT',
  PROJECT: 'PROJECT',
  INVOICE: 'INVOICE',
  PAYMENT: 'PAYMENT',
  ASSET: 'ASSET',
  TASK: 'TASK'
};

exports.ActivityEntityType = exports.$Enums.ActivityEntityType = {
  CLIENT: 'CLIENT',
  PROJECT: 'PROJECT',
  INVOICE: 'INVOICE',
  PAYMENT: 'PAYMENT',
  ASSET: 'ASSET',
  TASK: 'TASK',
  NOTE: 'NOTE',
  MILESTONE: 'MILESTONE',
  SETTINGS: 'SETTINGS'
};

exports.ActivityAction = exports.$Enums.ActivityAction = {
  CREATED: 'CREATED',
  UPDATED: 'UPDATED',
  DELETED: 'DELETED',
  ARCHIVED: 'ARCHIVED',
  REACTIVATED: 'REACTIVATED',
  STATUS_CHANGED: 'STATUS_CHANGED',
  PAYMENT_LOGGED: 'PAYMENT_LOGGED',
  RENEWED: 'RENEWED',
  NOTE_ADDED: 'NOTE_ADDED',
  COMPLETED: 'COMPLETED'
};

exports.Prisma.ModelName = {
  User: 'User',
  Client: 'Client',
  Invoice: 'Invoice',
  InvoiceItem: 'InvoiceItem',
  Subscription: 'Subscription',
  Project: 'Project',
  Milestone: 'Milestone',
  RevenueRecord: 'RevenueRecord',
  CostRecord: 'CostRecord',
  Payment: 'Payment',
  PaymentAllocation: 'PaymentAllocation',
  Asset: 'Asset',
  AssetRenewal: 'AssetRenewal',
  Task: 'Task',
  InternalNote: 'InternalNote',
  ActivityLog: 'ActivityLog',
  RevisionEntry: 'RevisionEntry',
  ScopeChange: 'ScopeChange'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
