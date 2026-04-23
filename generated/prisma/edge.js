
Object.defineProperty(exports, "__esModule", { value: true });

const {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientRustPanicError,
  PrismaClientInitializationError,
  PrismaClientValidationError,
  NotFoundError,
  getPrismaClient,
  sqltag,
  empty,
  join,
  raw,
  skip,
  Decimal,
  Debug,
  objectEnumValues,
  makeStrictEnum,
  Extensions,
  warnOnce,
  defineDmmfProperty,
  Public,
  getRuntime
} = require('./runtime/edge.js')


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

Prisma.PrismaClientKnownRequestError = PrismaClientKnownRequestError;
Prisma.PrismaClientUnknownRequestError = PrismaClientUnknownRequestError
Prisma.PrismaClientRustPanicError = PrismaClientRustPanicError
Prisma.PrismaClientInitializationError = PrismaClientInitializationError
Prisma.PrismaClientValidationError = PrismaClientValidationError
Prisma.NotFoundError = NotFoundError
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = sqltag
Prisma.empty = empty
Prisma.join = join
Prisma.raw = raw
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = Extensions.getExtensionContext
Prisma.defineExtension = Extensions.defineExtension

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
 * Create the Client
 */
const config = {
  "generator": {
    "name": "client",
    "provider": {
      "fromEnvVar": null,
      "value": "prisma-client-js"
    },
    "output": {
      "value": "C:\\Users\\muham\\OneDrive\\Documents\\Custom Production\\Products\\TechSaws Billing\\generated\\prisma",
      "fromEnvVar": null
    },
    "config": {
      "engineType": "library"
    },
    "binaryTargets": [
      {
        "fromEnvVar": null,
        "value": "windows",
        "native": true
      },
      {
        "fromEnvVar": null,
        "value": "rhel-openssl-3.0.x"
      }
    ],
    "previewFeatures": [],
    "sourceFilePath": "C:\\Users\\muham\\OneDrive\\Documents\\Custom Production\\Products\\TechSaws Billing\\prisma\\schema.prisma",
    "isCustomOutput": true
  },
  "relativeEnvPaths": {
    "rootEnvPath": null,
    "schemaEnvPath": "../../.env"
  },
  "relativePath": "../../prisma",
  "clientVersion": "5.22.0",
  "engineVersion": "605197351a3c8bdd595af2d2a9bc3025bca48ea2",
  "datasourceNames": [
    "db"
  ],
  "activeProvider": "postgresql",
  "postinstall": false,
  "inlineDatasources": {
    "db": {
      "url": {
        "fromEnvVar": "DATABASE_URL",
        "value": null
      }
    }
  },
  "inlineSchema": "generator client {\n  provider      = \"prisma-client-js\"\n  output        = \"../generated/prisma\"\n  binaryTargets = [\"native\", \"rhel-openssl-3.0.x\"]\n}\n\ndatasource db {\n  provider  = \"postgresql\"\n  url       = env(\"DATABASE_URL\")\n  directUrl = env(\"DIRECT_URL\")\n}\n\nenum InvoiceType {\n  DEVELOPMENT\n  SUBSCRIPTION\n  SERVICE\n  HOSTING\n  DOMAIN\n  MAILBOX\n  MAINTENANCE\n  OTHER\n}\n\nenum InvoiceStatus {\n  DRAFT\n  GENERATED\n  SENT\n  PARTIALLY_PAID\n  PAID\n  OVERDUE\n  CANCELLED\n}\n\nenum BillingCycle {\n  MONTHLY\n  YEARLY\n  ONE_TIME\n  QUARTERLY\n  CUSTOM\n}\n\nenum ClientType {\n  SERVICE\n  SAAS\n  INFRA_ONLY\n  HYBRID\n  ONE_TIME_PROJECT\n  RETAINER\n}\n\nenum ClientStatus {\n  ACTIVE\n  INACTIVE\n  ARCHIVED\n  WATCH\n  RISK\n}\n\nenum ContractStatus {\n  ACTIVE\n  PENDING\n  EXPIRED\n  NONE\n}\n\nenum UserRole {\n  OWNER\n  PARTNER\n  STAFF\n}\n\nenum ProjectType {\n  SOFTWARE_PRODUCT\n  CLIENT_SERVICE\n  INTERNAL_TOOL\n  SUBSCRIPTION_SETUP\n  INFRASTRUCTURE\n  SUPPORT\n  OTHER\n}\n\nenum ProjectStatus {\n  NOT_STARTED\n  PLANNING\n  IN_PROGRESS\n  ON_HOLD\n  AWAITING_CLIENT\n  UNDER_REVIEW\n  DELIVERED\n  COMPLETED\n  CANCELLED\n}\n\nenum Priority {\n  LOW\n  MEDIUM\n  HIGH\n  CRITICAL\n}\n\nenum MilestoneStatus {\n  TODO\n  IN_PROGRESS\n  DONE\n  BLOCKED\n  CANCELLED\n}\n\nenum RevenueCategory {\n  PROJECT_SERVICE\n  SUBSCRIPTION\n  HOSTING_SERVER\n  DOMAIN\n  MAILBOX_EMAIL\n  MAINTENANCE_SUPPORT\n  OTHER_RECURRING\n  OTHER_ONE_TIME\n}\n\nenum FinanceStatus {\n  PLANNED\n  RECOGNIZED\n  PENDING\n  CANCELLED\n}\n\nenum CostCategory {\n  HOSTING_SERVER\n  DOMAIN\n  MAILBOX_EMAIL\n  THIRD_PARTY_SOFTWARE\n  CONTRACTOR_INTERNAL\n  PAYMENT_FEES\n  OTHER_OPERATIONAL\n}\n\nenum AssetType {\n  DOMAIN\n  VPS_SERVER\n  CLOUD_HOSTING\n  MAILBOX_EMAIL\n  SAAS_SUBSCRIPTION\n  SSL\n  MAINTENANCE_SUPPORT\n  OTHER_RECURRING_SERVICE\n}\n\nenum AssetStatus {\n  ACTIVE\n  INACTIVE\n  EXPIRING\n  EXPIRED\n  CANCELLED\n}\n\nenum PaymentMethod {\n  BANK_TRANSFER\n  CASH\n  JAZZCASH\n  EASYPAISA\n  STRIPE_MANUAL\n  PAYPAL_MANUAL\n  OTHER\n}\n\nenum TaskStatus {\n  TODO\n  IN_PROGRESS\n  BLOCKED\n  DONE\n  CANCELLED\n}\n\nenum NoteEntityType {\n  CLIENT\n  PROJECT\n  INVOICE\n  PAYMENT\n  ASSET\n  TASK\n}\n\nenum ActivityEntityType {\n  CLIENT\n  PROJECT\n  INVOICE\n  PAYMENT\n  ASSET\n  TASK\n  NOTE\n  MILESTONE\n  SETTINGS\n}\n\nenum ActivityAction {\n  CREATED\n  UPDATED\n  DELETED\n  ARCHIVED\n  REACTIVATED\n  STATUS_CHANGED\n  PAYMENT_LOGGED\n  RENEWED\n  NOTE_ADDED\n  COMPLETED\n}\n\nmodel User {\n  id           String   @id @default(cuid())\n  email        String   @unique\n  name         String?\n  passwordHash String\n  permissions  String[] @default([\"ALL\"])\n  role         UserRole @default(OWNER)\n  createdAt    DateTime @default(now())\n  updatedAt    DateTime @updatedAt\n\n  ownedClients     Client[]       @relation(\"ClientOwner\")\n  assignedProjects Project[]      @relation(\"ProjectOwner\")\n  assignedTasks    Task[]         @relation(\"TaskAssignee\")\n  createdTasks     Task[]         @relation(\"TaskCreator\")\n  paymentsEntered  Payment[]      @relation(\"PaymentEnteredBy\")\n  notes            InternalNote[]\n  activities       ActivityLog[]\n}\n\nmodel Client {\n  id             String          @id @default(cuid())\n  name           String\n  email          String          @unique\n  companyName    String\n  contactPerson  String?\n  phone          String?\n  type           ClientType      @default(SERVICE)\n  status         ClientStatus    @default(ACTIVE)\n  contractStatus ContractStatus  @default(NONE)\n  startDate      DateTime?\n  tags           String[]        @default([])\n  ownerId        String?\n  archivedAt     DateTime?\n  createdAt      DateTime        @default(now())\n  updatedAt      DateTime        @updatedAt\n  owner          User?           @relation(\"ClientOwner\", fields: [ownerId], references: [id], onDelete: SetNull)\n  invoices       Invoice[]\n  subscriptions  Subscription[]\n  projects       Project[]\n  payments       Payment[]\n  assets         Asset[]\n  revenueRecords RevenueRecord[]\n  costRecords    CostRecord[]\n  tasks          Task[]\n\n  @@index([type, status])\n  @@index([ownerId])\n}\n\nmodel Invoice {\n  id               String              @id @default(cuid())\n  invoiceNumber    String              @unique @default(cuid())\n  clientId         String\n  projectId        String?\n  type             InvoiceType\n  totalAmount      Decimal             @db.Decimal(12, 2)\n  taxAmount        Decimal             @db.Decimal(12, 2)\n  discountAmount   Decimal             @default(0) @db.Decimal(12, 2)\n  finalAmount      Decimal             @db.Decimal(12, 2)\n  amountPaid       Decimal             @default(0) @db.Decimal(12, 2)\n  balanceAmount    Decimal             @default(0) @db.Decimal(12, 2)\n  projectCost      Decimal             @default(0) @db.Decimal(12, 2)\n  advancePercent   Decimal?            @db.Decimal(5, 2)\n  advanceAmount    Decimal             @default(0) @db.Decimal(12, 2)\n  timeline         String?\n  status           InvoiceStatus       @default(DRAFT)\n  issueDate        DateTime            @default(now())\n  dueDate          DateTime?\n  sentAt           DateTime?\n  cancelledAt      DateTime?\n  notes            String?\n  internalComments String?\n  createdAt        DateTime            @default(now())\n  updatedAt        DateTime            @updatedAt\n  client           Client              @relation(fields: [clientId], references: [id], onDelete: Cascade)\n  project          Project?            @relation(fields: [projectId], references: [id], onDelete: SetNull)\n  items            InvoiceItem[]\n  allocations      PaymentAllocation[]\n\n  @@index([clientId, type, status])\n  @@index([projectId])\n  @@index([dueDate])\n}\n\nmodel InvoiceItem {\n  id          String           @id @default(cuid())\n  invoiceId   String\n  title       String\n  description String?\n  category    RevenueCategory?\n  quantity    Int\n  unitPrice   Decimal          @db.Decimal(12, 2)\n  total       Decimal          @db.Decimal(12, 2)\n  recurring   Boolean          @default(false)\n  createdAt   DateTime         @default(now())\n  updatedAt   DateTime         @updatedAt\n  invoice     Invoice          @relation(fields: [invoiceId], references: [id], onDelete: Cascade)\n\n  @@index([invoiceId])\n}\n\nmodel Subscription {\n  id           String       @id @default(cuid())\n  clientId     String\n  serviceName  String\n  monthlyCost  Decimal      @db.Decimal(12, 2)\n  billingCycle BillingCycle\n  status       AssetStatus  @default(ACTIVE)\n  nextRenewal  DateTime?\n  notes        String?\n  createdAt    DateTime     @default(now())\n  updatedAt    DateTime     @updatedAt\n  client       Client       @relation(fields: [clientId], references: [id], onDelete: Cascade)\n\n  @@index([clientId])\n}\n\nmodel Project {\n  id                     String          @id @default(cuid())\n  clientId               String\n  name                   String\n  type                   ProjectType     @default(CLIENT_SERVICE)\n  description            String?\n  scopeSummary           String?\n  status                 ProjectStatus   @default(NOT_STARTED)\n  priority               Priority        @default(MEDIUM)\n  startDate              DateTime?\n  deadline               DateTime?\n  revisedDeadline        DateTime?\n  deliveryDate           DateTime?\n  budgetAmount           Decimal         @default(0) @db.Decimal(12, 2)\n  internalCostEstimate   Decimal         @default(0) @db.Decimal(12, 2)\n  progress               Int             @default(0)\n  assignedOwnerId        String?\n  blockers               String?\n  revisionCount          Int             @default(0)\n  scopeChangeCount       Int             @default(0)\n  delayReason            String?\n  internalResponsibility String?\n  clientCausedDelay      Boolean         @default(false)\n  penaltyNote            String?\n  deductionAmount        Decimal         @default(0) @db.Decimal(12, 2)\n  archivedAt             DateTime?\n  createdAt              DateTime        @default(now())\n  updatedAt              DateTime        @updatedAt\n  client                 Client          @relation(fields: [clientId], references: [id], onDelete: Cascade)\n  assignedOwner          User?           @relation(\"ProjectOwner\", fields: [assignedOwnerId], references: [id], onDelete: SetNull)\n  milestones             Milestone[]\n  tasks                  Task[]\n  invoices               Invoice[]\n  revenueRecords         RevenueRecord[]\n  costRecords            CostRecord[]\n  revisions              RevisionEntry[]\n  scopeChanges           ScopeChange[]\n\n  @@index([clientId, status])\n  @@index([deadline])\n  @@index([assignedOwnerId])\n}\n\nmodel Milestone {\n  id             String          @id @default(cuid())\n  projectId      String\n  title          String\n  description    String?\n  dueDate        DateTime?\n  status         MilestoneStatus @default(TODO)\n  completionDate DateTime?\n  owner          String?\n  createdAt      DateTime        @default(now())\n  updatedAt      DateTime        @updatedAt\n  project        Project         @relation(fields: [projectId], references: [id], onDelete: Cascade)\n\n  @@index([projectId, status])\n  @@index([dueDate])\n}\n\nmodel RevenueRecord {\n  id             String          @id @default(cuid())\n  clientId       String\n  projectId      String?\n  invoiceId      String?\n  sourceType     RevenueCategory\n  reference      String?\n  frequency      BillingCycle    @default(ONE_TIME)\n  amount         Decimal         @db.Decimal(12, 2)\n  status         FinanceStatus   @default(RECOGNIZED)\n  recognizedDate DateTime        @default(now())\n  notes          String?\n  createdAt      DateTime        @default(now())\n  updatedAt      DateTime        @updatedAt\n  client         Client          @relation(fields: [clientId], references: [id], onDelete: Cascade)\n  project        Project?        @relation(fields: [projectId], references: [id], onDelete: SetNull)\n\n  @@index([clientId, sourceType, status])\n  @@index([recognizedDate])\n}\n\nmodel CostRecord {\n  id               String       @id @default(cuid())\n  clientId         String?\n  projectId        String?\n  assetId          String?\n  costType         CostCategory\n  amount           Decimal      @db.Decimal(12, 2)\n  billingFrequency BillingCycle @default(ONE_TIME)\n  vendor           String?\n  incurredDate     DateTime     @default(now())\n  notes            String?\n  createdAt        DateTime     @default(now())\n  updatedAt        DateTime     @updatedAt\n  client           Client?      @relation(fields: [clientId], references: [id], onDelete: SetNull)\n  project          Project?     @relation(fields: [projectId], references: [id], onDelete: SetNull)\n  asset            Asset?       @relation(fields: [assetId], references: [id], onDelete: SetNull)\n\n  @@index([clientId, costType])\n  @@index([incurredDate])\n}\n\nmodel Payment {\n  id              String              @id @default(cuid())\n  clientId        String\n  paymentDate     DateTime            @default(now())\n  amountReceived  Decimal             @db.Decimal(12, 2)\n  currency        String              @default(\"USD\")\n  method          PaymentMethod\n  referenceNumber String?\n  notes           String?\n  enteredById     String?\n  createdAt       DateTime            @default(now())\n  updatedAt       DateTime            @updatedAt\n  client          Client              @relation(fields: [clientId], references: [id], onDelete: Cascade)\n  enteredBy       User?               @relation(\"PaymentEnteredBy\", fields: [enteredById], references: [id], onDelete: SetNull)\n  allocations     PaymentAllocation[]\n\n  @@index([clientId, paymentDate])\n  @@index([method])\n}\n\nmodel PaymentAllocation {\n  id        String   @id @default(cuid())\n  paymentId String\n  invoiceId String\n  amount    Decimal  @db.Decimal(12, 2)\n  createdAt DateTime @default(now())\n  payment   Payment  @relation(fields: [paymentId], references: [id], onDelete: Cascade)\n  invoice   Invoice  @relation(fields: [invoiceId], references: [id], onDelete: Cascade)\n\n  @@unique([paymentId, invoiceId])\n  @@index([invoiceId])\n}\n\nmodel Asset {\n  id                       String         @id @default(cuid())\n  clientId                 String\n  name                     String\n  type                     AssetType\n  provider                 String?\n  providerAccountReference String?\n  purchaseDate             DateTime?\n  renewalDate              DateTime?\n  billingFrequency         BillingCycle   @default(MONTHLY)\n  internalCost             Decimal        @default(0) @db.Decimal(12, 2)\n  clientCharge             Decimal        @default(0) @db.Decimal(12, 2)\n  status                   AssetStatus    @default(ACTIVE)\n  autoRenewal              Boolean        @default(false)\n  alertDays                Int            @default(30)\n  notes                    String?\n  archivedAt               DateTime?\n  createdAt                DateTime       @default(now())\n  updatedAt                DateTime       @updatedAt\n  client                   Client         @relation(fields: [clientId], references: [id], onDelete: Cascade)\n  renewals                 AssetRenewal[]\n  costRecords              CostRecord[]\n\n  @@index([clientId, type, status])\n  @@index([renewalDate])\n}\n\nmodel AssetRenewal {\n  id             String   @id @default(cuid())\n  assetId        String\n  dateRenewed    DateTime @default(now())\n  newRenewalDate DateTime\n  cost           Decimal  @default(0) @db.Decimal(12, 2)\n  clientCharge   Decimal  @default(0) @db.Decimal(12, 2)\n  notes          String?\n  createdAt      DateTime @default(now())\n  asset          Asset    @relation(fields: [assetId], references: [id], onDelete: Cascade)\n\n  @@index([assetId, dateRenewed])\n}\n\nmodel Task {\n  id          String     @id @default(cuid())\n  title       String\n  description String?\n  status      TaskStatus @default(TODO)\n  priority    Priority   @default(MEDIUM)\n  dueDate     DateTime?\n  clientId    String?\n  projectId   String?\n  assigneeId  String?\n  createdById String?\n  createdAt   DateTime   @default(now())\n  updatedAt   DateTime   @updatedAt\n  client      Client?    @relation(fields: [clientId], references: [id], onDelete: SetNull)\n  project     Project?   @relation(fields: [projectId], references: [id], onDelete: SetNull)\n  assignee    User?      @relation(\"TaskAssignee\", fields: [assigneeId], references: [id], onDelete: SetNull)\n  createdBy   User?      @relation(\"TaskCreator\", fields: [createdById], references: [id], onDelete: SetNull)\n\n  @@index([status, priority])\n  @@index([dueDate])\n  @@index([clientId])\n  @@index([projectId])\n}\n\nmodel InternalNote {\n  id         String         @id @default(cuid())\n  entityType NoteEntityType\n  entityId   String\n  body       String\n  authorId   String?\n  createdAt  DateTime       @default(now())\n  updatedAt  DateTime       @updatedAt\n  author     User?          @relation(fields: [authorId], references: [id], onDelete: SetNull)\n\n  @@index([entityType, entityId])\n  @@index([authorId])\n}\n\nmodel ActivityLog {\n  id         String             @id @default(cuid())\n  entityType ActivityEntityType\n  entityId   String\n  action     ActivityAction\n  message    String\n  actorId    String?\n  metadata   Json?\n  createdAt  DateTime           @default(now())\n  actor      User?              @relation(fields: [actorId], references: [id], onDelete: SetNull)\n\n  @@index([entityType, entityId])\n  @@index([actorId, createdAt])\n}\n\nmodel RevisionEntry {\n  id        String   @id @default(cuid())\n  projectId String\n  title     String\n  notes     String?\n  createdAt DateTime @default(now())\n  project   Project  @relation(fields: [projectId], references: [id], onDelete: Cascade)\n\n  @@index([projectId])\n}\n\nmodel ScopeChange {\n  id             String        @id @default(cuid())\n  projectId      String\n  title          String\n  description    String?\n  timeImpactDays Int           @default(0)\n  priceImpact    Decimal       @default(0) @db.Decimal(12, 2)\n  approvalState  FinanceStatus @default(PENDING)\n  createdAt      DateTime      @default(now())\n  updatedAt      DateTime      @updatedAt\n  project        Project       @relation(fields: [projectId], references: [id], onDelete: Cascade)\n\n  @@index([projectId])\n}\n",
  "inlineSchemaHash": "75a4a1cb546d34a4417702c1179252dae2e90b772032d4e977376970aa5b4126",
  "copyEngine": true
}
config.dirname = '/'

config.runtimeDataModel = JSON.parse("{\"models\":{\"User\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"cuid\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"email\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"passwordHash\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"permissions\",\"kind\":\"scalar\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":[\"ALL\"],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"role\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"UserRole\",\"default\":\"OWNER\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"ownedClients\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Client\",\"relationName\":\"ClientOwner\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"assignedProjects\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Project\",\"relationName\":\"ProjectOwner\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"assignedTasks\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Task\",\"relationName\":\"TaskAssignee\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdTasks\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Task\",\"relationName\":\"TaskCreator\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"paymentsEntered\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Payment\",\"relationName\":\"PaymentEnteredBy\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"notes\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"InternalNote\",\"relationName\":\"InternalNoteToUser\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"activities\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"ActivityLog\",\"relationName\":\"ActivityLogToUser\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Client\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"cuid\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"email\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"companyName\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"contactPerson\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"phone\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"type\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"ClientType\",\"default\":\"SERVICE\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"ClientStatus\",\"default\":\"ACTIVE\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"contractStatus\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"ContractStatus\",\"default\":\"NONE\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"startDate\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tags\",\"kind\":\"scalar\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"ownerId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"archivedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"owner\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"relationName\":\"ClientOwner\",\"relationFromFields\":[\"ownerId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"SetNull\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"invoices\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Invoice\",\"relationName\":\"ClientToInvoice\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"subscriptions\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Subscription\",\"relationName\":\"ClientToSubscription\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"projects\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Project\",\"relationName\":\"ClientToProject\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"payments\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Payment\",\"relationName\":\"ClientToPayment\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"assets\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Asset\",\"relationName\":\"AssetToClient\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"revenueRecords\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"RevenueRecord\",\"relationName\":\"ClientToRevenueRecord\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"costRecords\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"CostRecord\",\"relationName\":\"ClientToCostRecord\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tasks\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Task\",\"relationName\":\"ClientToTask\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Invoice\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"cuid\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"invoiceNumber\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":true,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"cuid\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"clientId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"projectId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"type\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"InvoiceType\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"totalAmount\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"taxAmount\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"discountAmount\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Decimal\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"finalAmount\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"amountPaid\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Decimal\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"balanceAmount\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Decimal\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"projectCost\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Decimal\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"advancePercent\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"advanceAmount\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Decimal\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"timeline\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"InvoiceStatus\",\"default\":\"DRAFT\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"issueDate\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"dueDate\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"sentAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"cancelledAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"notes\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"internalComments\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"client\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Client\",\"relationName\":\"ClientToInvoice\",\"relationFromFields\":[\"clientId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"project\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Project\",\"relationName\":\"InvoiceToProject\",\"relationFromFields\":[\"projectId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"SetNull\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"items\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"InvoiceItem\",\"relationName\":\"InvoiceToInvoiceItem\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"allocations\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"PaymentAllocation\",\"relationName\":\"InvoiceToPaymentAllocation\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"InvoiceItem\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"cuid\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"invoiceId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"title\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"description\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"category\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"RevenueCategory\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"quantity\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Int\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"unitPrice\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"total\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"recurring\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"invoice\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Invoice\",\"relationName\":\"InvoiceToInvoiceItem\",\"relationFromFields\":[\"invoiceId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Subscription\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"cuid\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"clientId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"serviceName\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"monthlyCost\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"billingCycle\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"BillingCycle\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"AssetStatus\",\"default\":\"ACTIVE\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"nextRenewal\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"notes\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"client\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Client\",\"relationName\":\"ClientToSubscription\",\"relationFromFields\":[\"clientId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Project\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"cuid\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"clientId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"type\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"ProjectType\",\"default\":\"CLIENT_SERVICE\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"description\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"scopeSummary\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"ProjectStatus\",\"default\":\"NOT_STARTED\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"priority\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Priority\",\"default\":\"MEDIUM\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"startDate\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"deadline\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"revisedDeadline\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"deliveryDate\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"budgetAmount\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Decimal\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"internalCostEstimate\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Decimal\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"progress\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"assignedOwnerId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"blockers\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"revisionCount\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"scopeChangeCount\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"delayReason\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"internalResponsibility\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"clientCausedDelay\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"penaltyNote\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"deductionAmount\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Decimal\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"archivedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"client\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Client\",\"relationName\":\"ClientToProject\",\"relationFromFields\":[\"clientId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"assignedOwner\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"relationName\":\"ProjectOwner\",\"relationFromFields\":[\"assignedOwnerId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"SetNull\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"milestones\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Milestone\",\"relationName\":\"MilestoneToProject\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"tasks\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Task\",\"relationName\":\"ProjectToTask\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"invoices\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Invoice\",\"relationName\":\"InvoiceToProject\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"revenueRecords\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"RevenueRecord\",\"relationName\":\"ProjectToRevenueRecord\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"costRecords\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"CostRecord\",\"relationName\":\"CostRecordToProject\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"revisions\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"RevisionEntry\",\"relationName\":\"ProjectToRevisionEntry\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"scopeChanges\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"ScopeChange\",\"relationName\":\"ProjectToScopeChange\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Milestone\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"cuid\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"projectId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"title\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"description\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"dueDate\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"MilestoneStatus\",\"default\":\"TODO\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"completionDate\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"owner\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"project\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Project\",\"relationName\":\"MilestoneToProject\",\"relationFromFields\":[\"projectId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"RevenueRecord\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"cuid\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"clientId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"projectId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"invoiceId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"sourceType\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"RevenueCategory\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"reference\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"frequency\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"BillingCycle\",\"default\":\"ONE_TIME\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"amount\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"FinanceStatus\",\"default\":\"RECOGNIZED\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"recognizedDate\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"notes\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"client\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Client\",\"relationName\":\"ClientToRevenueRecord\",\"relationFromFields\":[\"clientId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"project\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Project\",\"relationName\":\"ProjectToRevenueRecord\",\"relationFromFields\":[\"projectId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"SetNull\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"CostRecord\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"cuid\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"clientId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"projectId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"assetId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"costType\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"CostCategory\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"amount\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"billingFrequency\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"BillingCycle\",\"default\":\"ONE_TIME\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"vendor\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"incurredDate\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"notes\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"client\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Client\",\"relationName\":\"ClientToCostRecord\",\"relationFromFields\":[\"clientId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"SetNull\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"project\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Project\",\"relationName\":\"CostRecordToProject\",\"relationFromFields\":[\"projectId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"SetNull\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"asset\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Asset\",\"relationName\":\"AssetToCostRecord\",\"relationFromFields\":[\"assetId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"SetNull\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Payment\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"cuid\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"clientId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"paymentDate\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"amountReceived\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"currency\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":\"USD\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"method\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"PaymentMethod\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"referenceNumber\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"notes\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"enteredById\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"client\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Client\",\"relationName\":\"ClientToPayment\",\"relationFromFields\":[\"clientId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"enteredBy\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"relationName\":\"PaymentEnteredBy\",\"relationFromFields\":[\"enteredById\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"SetNull\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"allocations\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"PaymentAllocation\",\"relationName\":\"PaymentToPaymentAllocation\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"PaymentAllocation\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"cuid\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"paymentId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"invoiceId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"amount\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Decimal\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"payment\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Payment\",\"relationName\":\"PaymentToPaymentAllocation\",\"relationFromFields\":[\"paymentId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"invoice\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Invoice\",\"relationName\":\"InvoiceToPaymentAllocation\",\"relationFromFields\":[\"invoiceId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[[\"paymentId\",\"invoiceId\"]],\"uniqueIndexes\":[{\"name\":null,\"fields\":[\"paymentId\",\"invoiceId\"]}],\"isGenerated\":false},\"Asset\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"cuid\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"clientId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"name\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"type\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"AssetType\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"provider\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"providerAccountReference\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"purchaseDate\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"renewalDate\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"billingFrequency\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"BillingCycle\",\"default\":\"MONTHLY\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"internalCost\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Decimal\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"clientCharge\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Decimal\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"AssetStatus\",\"default\":\"ACTIVE\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"autoRenewal\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Boolean\",\"default\":false,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"alertDays\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":30,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"notes\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"archivedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"client\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Client\",\"relationName\":\"AssetToClient\",\"relationFromFields\":[\"clientId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"renewals\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"AssetRenewal\",\"relationName\":\"AssetToAssetRenewal\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"costRecords\",\"kind\":\"object\",\"isList\":true,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"CostRecord\",\"relationName\":\"AssetToCostRecord\",\"relationFromFields\":[],\"relationToFields\":[],\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"AssetRenewal\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"cuid\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"assetId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"dateRenewed\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"newRenewalDate\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"cost\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Decimal\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"clientCharge\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Decimal\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"notes\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"asset\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Asset\",\"relationName\":\"AssetToAssetRenewal\",\"relationFromFields\":[\"assetId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"Task\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"cuid\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"title\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"description\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"status\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"TaskStatus\",\"default\":\"TODO\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"priority\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Priority\",\"default\":\"MEDIUM\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"dueDate\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"clientId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"projectId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"assigneeId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdById\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"client\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Client\",\"relationName\":\"ClientToTask\",\"relationFromFields\":[\"clientId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"SetNull\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"project\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Project\",\"relationName\":\"ProjectToTask\",\"relationFromFields\":[\"projectId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"SetNull\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"assignee\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"relationName\":\"TaskAssignee\",\"relationFromFields\":[\"assigneeId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"SetNull\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdBy\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"relationName\":\"TaskCreator\",\"relationFromFields\":[\"createdById\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"SetNull\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"InternalNote\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"cuid\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"entityType\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"NoteEntityType\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"entityId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"body\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"authorId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"author\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"relationName\":\"InternalNoteToUser\",\"relationFromFields\":[\"authorId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"SetNull\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"ActivityLog\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"cuid\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"entityType\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"ActivityEntityType\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"entityId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"action\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"ActivityAction\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"message\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"actorId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"metadata\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Json\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"actor\",\"kind\":\"object\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"User\",\"relationName\":\"ActivityLogToUser\",\"relationFromFields\":[\"actorId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"SetNull\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"RevisionEntry\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"cuid\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"projectId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"title\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"notes\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"project\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Project\",\"relationName\":\"ProjectToRevisionEntry\",\"relationFromFields\":[\"projectId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false},\"ScopeChange\":{\"dbName\":null,\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":true,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"String\",\"default\":{\"name\":\"cuid\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"projectId\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":true,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"title\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"description\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":false,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"String\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"timeImpactDays\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Int\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"priceImpact\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"Decimal\",\"default\":0,\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"approvalState\",\"kind\":\"enum\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"FinanceStatus\",\"default\":\"PENDING\",\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"createdAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":true,\"type\":\"DateTime\",\"default\":{\"name\":\"now\",\"args\":[]},\"isGenerated\":false,\"isUpdatedAt\":false},{\"name\":\"updatedAt\",\"kind\":\"scalar\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"DateTime\",\"isGenerated\":false,\"isUpdatedAt\":true},{\"name\":\"project\",\"kind\":\"object\",\"isList\":false,\"isRequired\":true,\"isUnique\":false,\"isId\":false,\"isReadOnly\":false,\"hasDefaultValue\":false,\"type\":\"Project\",\"relationName\":\"ProjectToScopeChange\",\"relationFromFields\":[\"projectId\"],\"relationToFields\":[\"id\"],\"relationOnDelete\":\"Cascade\",\"isGenerated\":false,\"isUpdatedAt\":false}],\"primaryKey\":null,\"uniqueFields\":[],\"uniqueIndexes\":[],\"isGenerated\":false}},\"enums\":{\"InvoiceType\":{\"values\":[{\"name\":\"DEVELOPMENT\",\"dbName\":null},{\"name\":\"SUBSCRIPTION\",\"dbName\":null},{\"name\":\"SERVICE\",\"dbName\":null},{\"name\":\"HOSTING\",\"dbName\":null},{\"name\":\"DOMAIN\",\"dbName\":null},{\"name\":\"MAILBOX\",\"dbName\":null},{\"name\":\"MAINTENANCE\",\"dbName\":null},{\"name\":\"OTHER\",\"dbName\":null}],\"dbName\":null},\"InvoiceStatus\":{\"values\":[{\"name\":\"DRAFT\",\"dbName\":null},{\"name\":\"GENERATED\",\"dbName\":null},{\"name\":\"SENT\",\"dbName\":null},{\"name\":\"PARTIALLY_PAID\",\"dbName\":null},{\"name\":\"PAID\",\"dbName\":null},{\"name\":\"OVERDUE\",\"dbName\":null},{\"name\":\"CANCELLED\",\"dbName\":null}],\"dbName\":null},\"BillingCycle\":{\"values\":[{\"name\":\"MONTHLY\",\"dbName\":null},{\"name\":\"YEARLY\",\"dbName\":null},{\"name\":\"ONE_TIME\",\"dbName\":null},{\"name\":\"QUARTERLY\",\"dbName\":null},{\"name\":\"CUSTOM\",\"dbName\":null}],\"dbName\":null},\"ClientType\":{\"values\":[{\"name\":\"SERVICE\",\"dbName\":null},{\"name\":\"SAAS\",\"dbName\":null},{\"name\":\"INFRA_ONLY\",\"dbName\":null},{\"name\":\"HYBRID\",\"dbName\":null},{\"name\":\"ONE_TIME_PROJECT\",\"dbName\":null},{\"name\":\"RETAINER\",\"dbName\":null}],\"dbName\":null},\"ClientStatus\":{\"values\":[{\"name\":\"ACTIVE\",\"dbName\":null},{\"name\":\"INACTIVE\",\"dbName\":null},{\"name\":\"ARCHIVED\",\"dbName\":null},{\"name\":\"WATCH\",\"dbName\":null},{\"name\":\"RISK\",\"dbName\":null}],\"dbName\":null},\"ContractStatus\":{\"values\":[{\"name\":\"ACTIVE\",\"dbName\":null},{\"name\":\"PENDING\",\"dbName\":null},{\"name\":\"EXPIRED\",\"dbName\":null},{\"name\":\"NONE\",\"dbName\":null}],\"dbName\":null},\"UserRole\":{\"values\":[{\"name\":\"OWNER\",\"dbName\":null},{\"name\":\"PARTNER\",\"dbName\":null},{\"name\":\"STAFF\",\"dbName\":null}],\"dbName\":null},\"ProjectType\":{\"values\":[{\"name\":\"SOFTWARE_PRODUCT\",\"dbName\":null},{\"name\":\"CLIENT_SERVICE\",\"dbName\":null},{\"name\":\"INTERNAL_TOOL\",\"dbName\":null},{\"name\":\"SUBSCRIPTION_SETUP\",\"dbName\":null},{\"name\":\"INFRASTRUCTURE\",\"dbName\":null},{\"name\":\"SUPPORT\",\"dbName\":null},{\"name\":\"OTHER\",\"dbName\":null}],\"dbName\":null},\"ProjectStatus\":{\"values\":[{\"name\":\"NOT_STARTED\",\"dbName\":null},{\"name\":\"PLANNING\",\"dbName\":null},{\"name\":\"IN_PROGRESS\",\"dbName\":null},{\"name\":\"ON_HOLD\",\"dbName\":null},{\"name\":\"AWAITING_CLIENT\",\"dbName\":null},{\"name\":\"UNDER_REVIEW\",\"dbName\":null},{\"name\":\"DELIVERED\",\"dbName\":null},{\"name\":\"COMPLETED\",\"dbName\":null},{\"name\":\"CANCELLED\",\"dbName\":null}],\"dbName\":null},\"Priority\":{\"values\":[{\"name\":\"LOW\",\"dbName\":null},{\"name\":\"MEDIUM\",\"dbName\":null},{\"name\":\"HIGH\",\"dbName\":null},{\"name\":\"CRITICAL\",\"dbName\":null}],\"dbName\":null},\"MilestoneStatus\":{\"values\":[{\"name\":\"TODO\",\"dbName\":null},{\"name\":\"IN_PROGRESS\",\"dbName\":null},{\"name\":\"DONE\",\"dbName\":null},{\"name\":\"BLOCKED\",\"dbName\":null},{\"name\":\"CANCELLED\",\"dbName\":null}],\"dbName\":null},\"RevenueCategory\":{\"values\":[{\"name\":\"PROJECT_SERVICE\",\"dbName\":null},{\"name\":\"SUBSCRIPTION\",\"dbName\":null},{\"name\":\"HOSTING_SERVER\",\"dbName\":null},{\"name\":\"DOMAIN\",\"dbName\":null},{\"name\":\"MAILBOX_EMAIL\",\"dbName\":null},{\"name\":\"MAINTENANCE_SUPPORT\",\"dbName\":null},{\"name\":\"OTHER_RECURRING\",\"dbName\":null},{\"name\":\"OTHER_ONE_TIME\",\"dbName\":null}],\"dbName\":null},\"FinanceStatus\":{\"values\":[{\"name\":\"PLANNED\",\"dbName\":null},{\"name\":\"RECOGNIZED\",\"dbName\":null},{\"name\":\"PENDING\",\"dbName\":null},{\"name\":\"CANCELLED\",\"dbName\":null}],\"dbName\":null},\"CostCategory\":{\"values\":[{\"name\":\"HOSTING_SERVER\",\"dbName\":null},{\"name\":\"DOMAIN\",\"dbName\":null},{\"name\":\"MAILBOX_EMAIL\",\"dbName\":null},{\"name\":\"THIRD_PARTY_SOFTWARE\",\"dbName\":null},{\"name\":\"CONTRACTOR_INTERNAL\",\"dbName\":null},{\"name\":\"PAYMENT_FEES\",\"dbName\":null},{\"name\":\"OTHER_OPERATIONAL\",\"dbName\":null}],\"dbName\":null},\"AssetType\":{\"values\":[{\"name\":\"DOMAIN\",\"dbName\":null},{\"name\":\"VPS_SERVER\",\"dbName\":null},{\"name\":\"CLOUD_HOSTING\",\"dbName\":null},{\"name\":\"MAILBOX_EMAIL\",\"dbName\":null},{\"name\":\"SAAS_SUBSCRIPTION\",\"dbName\":null},{\"name\":\"SSL\",\"dbName\":null},{\"name\":\"MAINTENANCE_SUPPORT\",\"dbName\":null},{\"name\":\"OTHER_RECURRING_SERVICE\",\"dbName\":null}],\"dbName\":null},\"AssetStatus\":{\"values\":[{\"name\":\"ACTIVE\",\"dbName\":null},{\"name\":\"INACTIVE\",\"dbName\":null},{\"name\":\"EXPIRING\",\"dbName\":null},{\"name\":\"EXPIRED\",\"dbName\":null},{\"name\":\"CANCELLED\",\"dbName\":null}],\"dbName\":null},\"PaymentMethod\":{\"values\":[{\"name\":\"BANK_TRANSFER\",\"dbName\":null},{\"name\":\"CASH\",\"dbName\":null},{\"name\":\"JAZZCASH\",\"dbName\":null},{\"name\":\"EASYPAISA\",\"dbName\":null},{\"name\":\"STRIPE_MANUAL\",\"dbName\":null},{\"name\":\"PAYPAL_MANUAL\",\"dbName\":null},{\"name\":\"OTHER\",\"dbName\":null}],\"dbName\":null},\"TaskStatus\":{\"values\":[{\"name\":\"TODO\",\"dbName\":null},{\"name\":\"IN_PROGRESS\",\"dbName\":null},{\"name\":\"BLOCKED\",\"dbName\":null},{\"name\":\"DONE\",\"dbName\":null},{\"name\":\"CANCELLED\",\"dbName\":null}],\"dbName\":null},\"NoteEntityType\":{\"values\":[{\"name\":\"CLIENT\",\"dbName\":null},{\"name\":\"PROJECT\",\"dbName\":null},{\"name\":\"INVOICE\",\"dbName\":null},{\"name\":\"PAYMENT\",\"dbName\":null},{\"name\":\"ASSET\",\"dbName\":null},{\"name\":\"TASK\",\"dbName\":null}],\"dbName\":null},\"ActivityEntityType\":{\"values\":[{\"name\":\"CLIENT\",\"dbName\":null},{\"name\":\"PROJECT\",\"dbName\":null},{\"name\":\"INVOICE\",\"dbName\":null},{\"name\":\"PAYMENT\",\"dbName\":null},{\"name\":\"ASSET\",\"dbName\":null},{\"name\":\"TASK\",\"dbName\":null},{\"name\":\"NOTE\",\"dbName\":null},{\"name\":\"MILESTONE\",\"dbName\":null},{\"name\":\"SETTINGS\",\"dbName\":null}],\"dbName\":null},\"ActivityAction\":{\"values\":[{\"name\":\"CREATED\",\"dbName\":null},{\"name\":\"UPDATED\",\"dbName\":null},{\"name\":\"DELETED\",\"dbName\":null},{\"name\":\"ARCHIVED\",\"dbName\":null},{\"name\":\"REACTIVATED\",\"dbName\":null},{\"name\":\"STATUS_CHANGED\",\"dbName\":null},{\"name\":\"PAYMENT_LOGGED\",\"dbName\":null},{\"name\":\"RENEWED\",\"dbName\":null},{\"name\":\"NOTE_ADDED\",\"dbName\":null},{\"name\":\"COMPLETED\",\"dbName\":null}],\"dbName\":null}},\"types\":{}}")
defineDmmfProperty(exports.Prisma, config.runtimeDataModel)
config.engineWasm = undefined

config.injectableEdgeEnv = () => ({
  parsed: {
    DATABASE_URL: typeof globalThis !== 'undefined' && globalThis['DATABASE_URL'] || typeof process !== 'undefined' && process.env && process.env.DATABASE_URL || undefined
  }
})

if (typeof globalThis !== 'undefined' && globalThis['DEBUG'] || typeof process !== 'undefined' && process.env && process.env.DEBUG || undefined) {
  Debug.enable(typeof globalThis !== 'undefined' && globalThis['DEBUG'] || typeof process !== 'undefined' && process.env && process.env.DEBUG || undefined)
}

const PrismaClient = getPrismaClient(config)
exports.PrismaClient = PrismaClient
Object.assign(exports, Prisma)

