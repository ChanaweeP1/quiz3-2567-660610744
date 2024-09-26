import { NextResponse } from "next/server";

export const GET = async () => {
  return NextResponse.json({
    ok: true,
    fullName: "Chanawee Pintaya",
    studentId: "660610744",
  });
};
