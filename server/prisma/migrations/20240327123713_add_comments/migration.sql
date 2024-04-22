/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Comment` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,tweetId,content]` on the table `Comment` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "createdAt";

-- CreateIndex
CREATE UNIQUE INDEX "Comment_userId_tweetId_content_key" ON "Comment"("userId", "tweetId", "content");
