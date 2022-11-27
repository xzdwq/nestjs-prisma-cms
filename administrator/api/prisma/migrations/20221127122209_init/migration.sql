-- CreateEnum
CREATE TYPE "public"."ERole" AS ENUM ('ADMINISTRATOR', 'MANAGER', 'WRITER');

-- CreateTable
CREATE TABLE "public"."user" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,
    "email" VARCHAR(64) NOT NULL,
    "password" VARCHAR(20) NOT NULL,
    "first_name" VARCHAR(100),
    "last_name" VARCHAR(100),
    "role" "public"."ERole" NOT NULL,

    CONSTRAINT "PK_USER" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UQ_USER__EMAIL" ON "public"."user"("email");
