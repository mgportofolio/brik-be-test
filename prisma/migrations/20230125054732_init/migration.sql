-- AlterTable
ALTER TABLE "Customer" ALTER COLUMN "updated_by" DROP NOT NULL;

-- AlterTable
ALTER TABLE "OrderDetail" ADD COLUMN     "qty" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "updated_by" DROP NOT NULL;
