/*
  Warnings:

  - The primary key for the `Comment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `content` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `Comment` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_pkey",
ADD COLUMN     "content" TEXT NOT NULL,
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "Comment_pkey" PRIMARY KEY ("id");
