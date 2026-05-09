CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');
CREATE TYPE "JobStatus" AS ENUM ('ACTIVE', 'INACTIVE');
CREATE TYPE "ApplicationStatus" AS ENUM ('APPLIED', 'UNDER_REVIEW', 'INTERVIEW_SCHEDULED', 'OFFER_SENT', 'HIRED', 'REJECTED');
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED');
CREATE TYPE "DocumentType" AS ENUM ('CV', 'PASSPORT', 'CERTIFICATE');
CREATE TYPE "SupportCategory" AS ENUM ('TECHNICAL', 'PAYMENT', 'JOB_POSTING', 'OTHER');
CREATE TYPE "SupportStatus" AS ENUM ('OPEN', 'CLOSED');

CREATE TABLE "User" (
  "_id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL UNIQUE,
  "phone" TEXT NOT NULL UNIQUE,
  "password" TEXT NOT NULL,
  "role" "Role" NOT NULL DEFAULT 'USER',
  "isVerified" BOOLEAN NOT NULL DEFAULT false,
  "verificationToken" TEXT,
  "resetToken" TEXT,
  "headline" TEXT,
  "location" TEXT,
  "summary" TEXT,
  "experience" TEXT,
  "education" TEXT,
  "linkedIn" TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE "Job" (
  "_id" TEXT PRIMARY KEY,
  "title" TEXT NOT NULL,
  "company" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "requirements" TEXT NOT NULL,
  "benefits" TEXT,
  "salary" TEXT,
  "province" TEXT NOT NULL,
  "visaSponsored" BOOLEAN NOT NULL DEFAULT false,
  "deadline" TIMESTAMPTZ NOT NULL,
  "status" "JobStatus" NOT NULL DEFAULT 'ACTIVE',
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE "Payment" (
  "_id" TEXT PRIMARY KEY,
  "checkoutRequestId" TEXT UNIQUE,
  "userId" TEXT NOT NULL,
  "jobId" TEXT NOT NULL,
  "amount" INTEGER NOT NULL DEFAULT 500,
  "mpesaCode" TEXT,
  "phone" TEXT NOT NULL,
  "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("_id") ON DELETE CASCADE,
  CONSTRAINT "Payment_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job" ("_id") ON DELETE CASCADE
);

CREATE TABLE "Application" (
  "_id" TEXT PRIMARY KEY,
  "trackingNumber" TEXT NOT NULL UNIQUE,
  "userId" TEXT NOT NULL,
  "jobId" TEXT NOT NULL,
  "status" "ApplicationStatus" NOT NULL DEFAULT 'APPLIED',
  "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
  "paymentId" TEXT UNIQUE,
  "interviewDate" TIMESTAMPTZ,
  "interviewLink" TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT "Application_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("_id") ON DELETE CASCADE,
  CONSTRAINT "Application_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job" ("_id") ON DELETE CASCADE,
  CONSTRAINT "Application_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment" ("_id") ON DELETE SET NULL
);

CREATE TABLE "Document" (
  "_id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "type" "DocumentType" NOT NULL,
  "url" TEXT NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT "Document_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("_id") ON DELETE CASCADE
);

CREATE TABLE "Notification" (
  "_id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "isRead" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("_id") ON DELETE CASCADE
);

CREATE TABLE "SupportRequest" (
  "_id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "category" "SupportCategory" NOT NULL,
  "subject" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "status" "SupportStatus" NOT NULL DEFAULT 'OPEN',
  "reply" TEXT,
  "repliedAt" TIMESTAMPTZ,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT "SupportRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("_id") ON DELETE CASCADE
);
