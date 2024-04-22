/*
  Warnings:

  - You are about to drop the column `tweetId` on the `Comment` table. All the data in the column will be lost.
  - The primary key for the `Like` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `tweetId` on the `Like` table. All the data in the column will be lost.
  - You are about to drop the `Tweet` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId,postId,content]` on the table `Comment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `postId` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postId` to the `Like` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_tweetId_fkey";

-- DropForeignKey
ALTER TABLE "Like" DROP CONSTRAINT "Like_tweetId_fkey";

-- DropForeignKey
ALTER TABLE "Tweet" DROP CONSTRAINT "Tweet_authorId_fkey";

-- DropIndex
DROP INDEX "Comment_userId_tweetId_content_key";

-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "tweetId",
ADD COLUMN     "postId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Like" DROP CONSTRAINT "Like_pkey",
DROP COLUMN "tweetId",
ADD COLUMN     "postId" TEXT NOT NULL,
ADD CONSTRAINT "Like_pkey" PRIMARY KEY ("userId", "postId");

-- DropTable
DROP TABLE "Tweet";

-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "imageURL" TEXT,
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Comment_userId_postId_content_key" ON "Comment"("userId", "postId", "content");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
