-- CreateTable
CREATE TABLE "public"."User" (
    "IDUser" SERIAL NOT NULL,
    "Name" TEXT NOT NULL,
    "Email" TEXT NOT NULL,
    "ImageProfile" BYTEA,

    CONSTRAINT "User_pkey" PRIMARY KEY ("IDUser")
);

-- CreateTable
CREATE TABLE "public"."Student" (
    "IDUser" INTEGER NOT NULL,
    "Period" TEXT NOT NULL,
    "Course" TEXT NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("IDUser")
);

-- CreateTable
CREATE TABLE "public"."Admin" (
    "IDUser" INTEGER NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("IDUser")
);

-- CreateTable
CREATE TABLE "public"."Classroom" (
    "IDClassroom" SERIAL NOT NULL,
    "Name" TEXT NOT NULL,
    "Responsible" TEXT NOT NULL,
    "Description" TEXT NOT NULL,
    "State" TEXT NOT NULL,
    "SecretaryNote" TEXT,
    "Equipment" TEXT NOT NULL,
    "Capacity" INTEGER NOT NULL,

    CONSTRAINT "Classroom_pkey" PRIMARY KEY ("IDClassroom")
);

-- CreateTable
CREATE TABLE "public"."History" (
    "IDHistory" SERIAL NOT NULL,
    "StartDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ReturnDate" TIMESTAMP(3),
    "IDUserFK" INTEGER NOT NULL,
    "IDClassroomFK" INTEGER NOT NULL,

    CONSTRAINT "History_pkey" PRIMARY KEY ("IDHistory")
);

-- CreateTable
CREATE TABLE "public"."Notification" (
    "IDNotification" SERIAL NOT NULL,
    "Message" TEXT NOT NULL,
    "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ReadAt" TIMESTAMP(3),
    "IDUserFK" INTEGER NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("IDNotification")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_Email_key" ON "public"."User"("Email");

-- AddForeignKey
ALTER TABLE "public"."Student" ADD CONSTRAINT "Student_IDUser_fkey" FOREIGN KEY ("IDUser") REFERENCES "public"."User"("IDUser") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Admin" ADD CONSTRAINT "Admin_IDUser_fkey" FOREIGN KEY ("IDUser") REFERENCES "public"."User"("IDUser") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."History" ADD CONSTRAINT "History_IDUserFK_fkey" FOREIGN KEY ("IDUserFK") REFERENCES "public"."User"("IDUser") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."History" ADD CONSTRAINT "History_IDClassroomFK_fkey" FOREIGN KEY ("IDClassroomFK") REFERENCES "public"."Classroom"("IDClassroom") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Notification" ADD CONSTRAINT "Notification_IDUserFK_fkey" FOREIGN KEY ("IDUserFK") REFERENCES "public"."User"("IDUser") ON DELETE RESTRICT ON UPDATE CASCADE;
