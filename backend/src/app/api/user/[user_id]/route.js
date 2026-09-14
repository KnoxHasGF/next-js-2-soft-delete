import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const resolvedParams = await params;
  const userId = resolvedParams.user_id;

  return NextResponse.json({
    message: "GET request is working",
    user_id: userId,
  });
}

export async function POST(request, { params }) {
  const resolvedParams = await params;
  const userId = resolvedParams.user_id;

  return NextResponse.json({
    message: "POST request is working",
    user_id: userId,
  });
}