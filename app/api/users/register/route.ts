import prisma from "@/prisma/db";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(5),
});

export async function POST(request: NextRequest) {
  const body = await request.json();

  const validation = schema.safeParse(body);

  if (!validation.success)
    return NextResponse.json(validation.error.errors, { status: 400 });

  const user = await prisma.user.findUnique({
    where: { email: body.email },
  });

  if (user)
    return NextResponse.json({ error: "User already exists" }, { status: 400 });

  const hashPassword = await bcrypt.hash(body.password, 10);
  const newUser = await prisma.user.create({
    data: {
      email: body.email,
      hashPassword: hashPassword,
    },
  });

  return NextResponse.json({ email: newUser.email }, { status: 201 });
}
