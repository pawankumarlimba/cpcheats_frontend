import { NextResponse } from "next/server";
import DB from "@/app/lib/dbconnect";
import UserAnswer from "@/moduls/useranswer"; // Ensure correct import path

export async function GET(req: Request) {
  try {
    await DB(); // Ensure database connection

    const { searchParams } = new URL(req.url);
    const interviewId = searchParams.get("interviewId");

    if (!interviewId) {
      return NextResponse.json(
        { success: false, error: "Missing interviewId parameter" },
        { status: 400 }
      );
    }

    // Fetch feedback from MongoDB
    const feedbackList = await UserAnswer.find({ mockIdRef: interviewId }).sort({ createdAt: 1 });

    return NextResponse.json({ success: true, data: feedbackList }, { status: 200 });

  } catch (error: unknown) {
    console.error("Error fetching feedback:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
