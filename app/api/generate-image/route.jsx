import { NextResponse } from "next/server";
import Replicate from "replicate";
import { Readable } from "stream";
import { Buffer } from "buffer";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { storage } from "@/configs/FirebaseConfig";

export async function POST(req) {
    try {
        const { prompt } = await req.json();

        const replicate = new Replicate({
            auth: process.env.REPLICATE_API_TOKEN,
        });

        const input = {
            prompt: prompt,
            height: 1280,
            width: 1024,
            num_outputs: 1,
        };

        const output = await replicate.run("bytedance/hyper-flux-8step:81946b1e09b256c543b35f37333a30d0d02ee2cd8c4f77cd915873a1ca622bad", { input });

        const stream = Readable.from(output[0]);
        const chunks = [];
        for await (const chunk of stream) {
            chunks.push(chunk);
        }
        const buffer = Buffer.concat(chunks);

        const base64Image = buffer.toString('base64');

        const fileName = 'ai-short-video-files/' + Date.now() + ".png";
        const storageRef = ref(storage, fileName);

        await uploadString(storageRef, `data:image/png;base64,${base64Image}`, 'data_url');

        const downloadUrl = await getDownloadURL(storageRef);
        console.log(downloadUrl);

        return NextResponse.json({ result: downloadUrl });
    } catch (e) {
        console.error('Error:', e.message, e.stack);
        return NextResponse.json({ error: "Failed to generate image", details: e.message }, { status: 500 });
    }
}