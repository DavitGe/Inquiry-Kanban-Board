import { NextResponse } from "next/server";
import { inquiries } from "@/mocks/inquiries";

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: inquiries,
      count: inquiries.length,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch inquiries",
      },
      { status: 500 }
    );
  }
}
