-- CreateTable
CREATE TABLE "scan_logs" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "assetId" TEXT,
    "barcode" TEXT NOT NULL,
    "found" BOOLEAN NOT NULL DEFAULT false,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "accuracy" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "scan_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "scan_logs_clientId_idx" ON "scan_logs"("clientId");

-- CreateIndex
CREATE INDEX "scan_logs_assetId_idx" ON "scan_logs"("assetId");

-- AddForeignKey
ALTER TABLE "scan_logs" ADD CONSTRAINT "scan_logs_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "crm_contacts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scan_logs" ADD CONSTRAINT "scan_logs_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "assets"("id") ON DELETE SET NULL ON UPDATE CASCADE;
