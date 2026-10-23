-- CreateTable
CREATE TABLE "games" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "genre" TEXT,

    CONSTRAINT "games_pkey" PRIMARY KEY ("id")
);
