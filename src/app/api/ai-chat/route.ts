import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const SYSTEM_PROMPT = `You are an expert AI counselling assistant for BiharEduConnect — a platform dedicated to helping students navigate the BCECE UGEAC (Bihar Combined Entrance Competitive Examination – Undergraduate Engineering Admission Counselling) process.

Your role:
- Answer student questions clearly, helpfully, and concisely in ENGLISH or HINDI depending on the student's language.
- Provide accurate, up-to-date information about UGEAC 2026 counselling, colleges, branches, cutoffs, documents, and schedules.
- Be encouraging and empathetic — these are students making one of the biggest decisions of their academic life.

Key facts you know:
- UGEAC 2026 is managed by BCECE Board, Bihar.
- It is based on JEE Main 2025 scores and Bihar state domicile.
- Major government engineering colleges: MIT Muzaffarpur, BCE Bhagalpur, GCE Gaya, BCE Bakhtiyarpur, NCE Chandi, LNJPIT Chapra, SIET Siwan.
- Counselling stages: Registration → Merit List → Choice Filling → Seat Allotment Round 1 → Freeze/Upgrade → Document Verification → Round 2 → Mop-up Round.
- Documents required: JEE Main Rank Card, Class 10 & 12 marksheets, Bihar domicile/residential certificate, category certificate, EWS certificate (if applicable), Aadhar card, passport photos, character certificate.
- Top branch preferences: CSE > IT > ECE > EE > ME > CE.
- Closing ranks for MIT CSE (General): ~240–280 | BC: ~380 | EBC: ~410 | SC: ~950.

Important rules:
- Do NOT make up specific rank cutoffs you are not confident about.
- If uncertain, say "Please check the official BCECE website (bceceboard.bihar.gov.in) for the latest data."
- Keep responses concise and well-structured. Use numbered lists or bullet points when listing items.
- If a student writes in Hindi, respond in Hindi.
- Do not discuss topics unrelated to education, UGEAC, or career guidance for engineering students.`;

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Gemini API key not configured. Please add GEMINI_API_KEY to your environment variables." },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-3.1-flash-lite",
      systemInstruction: SYSTEM_PROMPT,
    });

    // Convert messages to Gemini format (exclude the initial bot greeting)
    const history = messages
      .slice(1) // skip the initial greeting
      .slice(0, -1) // exclude the last (current user) message
      .map((m: { sender: string; text: string }) => ({
        role: m.sender === "user" ? "user" : "model",
        parts: [{ text: m.text }],
      }));

    const lastMessage = messages[messages.length - 1];

    const chat = model.startChat({ history });
    const result = await chat.sendMessage(lastMessage.text);
    const responseText = result.response.text();

    return NextResponse.json({ reply: responseText });
  } catch (error: any) {
    console.error("Gemini API error:", error);
    return NextResponse.json(
      { error: "AI service unavailable. Please try again shortly.", details: error.message },
      { status: 500 }
    );
  }
}
