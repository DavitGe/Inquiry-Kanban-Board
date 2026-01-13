import { NextResponse } from "next/server";
import { inquiries } from "@/mocks/inquiries";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const clientName = searchParams.get("clientName");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const minValue = searchParams.get("minValue");

    // Sort inquiries based on prevEl
    const nextMap = new Map<string | null, (typeof inquiries)[number][]>();
    inquiries.forEach((item) => {
      const prev = item.prevEl;
      if (!nextMap.has(prev)) nextMap.set(prev, []);
      nextMap.get(prev)!.push(item);
    });

    const sortedInquiries: typeof inquiries = [];
    const visited = new Set<string>();

    const traverse = (parentId: string | null) => {
      const children = nextMap.get(parentId) || [];
      for (const child of children) {
        if (!visited.has(child.id)) {
          visited.add(child.id);
          sortedInquiries.push(child);
          traverse(child.id);
        }
      }
    };

    traverse(null);

    // Fallback for any disconnected items
    if (sortedInquiries.length < inquiries.length) {
      inquiries.forEach((item) => {
        if (!visited.has(item.id)) {
          visited.add(item.id);
          sortedInquiries.push(item);
        }
      });
    }

    const filteredInquiries = sortedInquiries.filter((inquiry) => {
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

    const groupedInquiries = Object.groupBy(
      filteredInquiries,
      (inquiry) => inquiry.phase
    );
    return NextResponse.json({
      success: true,
      data: groupedInquiries,
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
