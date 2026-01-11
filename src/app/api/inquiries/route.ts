import { NextResponse } from "next/server";
import { inquiries } from "@/mocks/inquiries";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const clientName = searchParams.get("clientName");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const minValue = searchParams.get("minValue");

    const filteredInquiries = inquiries.filter((inquiry) => {
      //Filter by client name
      if (
        clientName &&
        !inquiry.clientName.toLowerCase().includes(clientName.toLowerCase())
      )
        return false;

      //Filter by date range
      const inquiryDate = new Date(inquiry.eventDate);
      if (startDate && inquiryDate < new Date(startDate)) return false;
      if (endDate && inquiryDate > new Date(endDate)) return false;

      //Filter by minimum potential value
      if (minValue && inquiry.potentialValue < Number(minValue)) return false;

      return true;
    });

    await new Promise((resolve) => setTimeout(resolve, 500));

    return NextResponse.json({
      success: true,
      data: filteredInquiries,
      count: filteredInquiries.length,
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
