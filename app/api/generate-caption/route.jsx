import { AssemblyAI } from 'assemblyai';
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const { audioFileUrl } = await req.json();
        const client = new AssemblyAI({
            apiKey: process.env.CAPTION_API,
        });

        const data = {
            audio: audioFileUrl
        };

        const transcript = await client.transcripts.transcribe(data);
        console.log(transcript.words);
        return NextResponse.json({ result: transcript.words });
    } catch (e) {
        console.error('Error generating caption:', e);
        return NextResponse.json({ error: "Failed to generate caption", details: e.message }, { status: 500 });
    }
}