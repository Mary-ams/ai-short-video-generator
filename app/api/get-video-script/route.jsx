import { chatSession } from "@/configs/AiModel";
import { NextResponse } from "next/server";

export async function POST(req) {
    console.log('API route reached');
    try {
        const { prompt } = await req.json();
        console.log(prompt);

        const result = await chatSession.sendMessage(prompt);
        const responseText = await result.response.text();
        console.log(responseText);

        return NextResponse.json({ result: JSON.parse(responseText) });
    } catch (e) {
        console.error('Error generating video script:', e);
        return NextResponse.json({ error: "Failed to generate video script", details: e.message }, { status: 500 });
    }
}