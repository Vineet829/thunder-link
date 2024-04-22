-- CreateTable
CREATE TABLE "Comment" (
    "userId" TEXT NOT NULL,
    "tweetId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("userId","tweetId")
);

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_tweetId_fkey" FOREIGN KEY ("tweetId") REFERENCES "Tweet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
