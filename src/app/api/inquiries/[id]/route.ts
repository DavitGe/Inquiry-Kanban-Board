import { NextResponse } from "next/server";
import { inquiries } from "@/mocks/inquiries";
import { Inquiry } from "@/interfaces/inquiry";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const { id } = await params;

    const allowedFields: (keyof Inquiry)[] = [
      "clientName",
      "contactPerson",
      "eventType",
      "eventDate",
      "guestCount",
      "potentialValue",
      "phase",
      "hotels",
      "notes",
      "prevEl",
    ];
    const updates: Partial<Inquiry> = {};
    for (const key of allowedFields) {
      if (key in body) updates[key] = body[key];
    }

    //Find inquiry to change
    const inquiryIndex = inquiries.findIndex((inquiry) => inquiry.id === id);

    if (inquiryIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          error: "Inquiry not found",
        },
        { status: 404 }
      );
    }

    const { createdAt: _, updatedAt: __, ...allowedUpdates } = updates;

    if (
      allowedUpdates?.prevEl &&
      allowedUpdates.prevEl !== inquiries[inquiryIndex].prevEl
    ) {
      //Setting prevEl of next inquiry(one that will be from the bottom)
      const inquiryIndexWithSamePrevEl = inquiries.findIndex(
        (inquiry) =>
          inquiry.prevEl === allowedUpdates.prevEl && inquiry.id != id
      );
      if (inquiryIndexWithSamePrevEl !== -1) {
        inquiries[inquiryIndexWithSamePrevEl].prevEl = id;
      }

      //If status changed, set next inquiry prevEl to the previous inquiry
      if (
        allowedUpdates?.eventType &&
        allowedUpdates.eventType !== inquiries[inquiryIndex].eventType
      ) {
        const indexOfNextInquiry = inquiries.findIndex(
          (inquiry) => inquiry.prevEl === id
        );
        if (indexOfNextInquiry !== -1) {
          inquiries[indexOfNextInquiry].prevEl = inquiries[inquiryIndex].prevEl;
        }
      }
    }

    const updatedInquiry: Inquiry = {
      ...inquiries[inquiryIndex],
      ...allowedUpdates,
      updatedAt: new Date().toISOString(),
    };

    inquiries[inquiryIndex] = updatedInquiry;

    await new Promise((resolve) => setTimeout(resolve, 500));

    return NextResponse.json({
      success: true,
      data: updatedInquiry,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update inquiry",
      },
      { status: 500 }
    );
  }
}
