import { NextApiResponse } from 'next';
import { NextResponse } from 'next/server';
import { google } from '@ai-sdk/google';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText } from 'ai';

const geminiAPI = process.env.GEMINI_API_KEY;

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();

        const google = createGoogleGenerativeAI({
            apiKey: geminiAPI,
        });

        const result = streamText({
            model: google('gemini-1.5-flash'), //ver essa linha
            messages,
            maxSteps: 3,
            system: `Você é um assistente útil. Verifique sua base de conhecimento antes de responder a quaisquer perguntas.`,
        });

        return result.toDataStreamResponse();
    } catch (error) {
        return NextResponse.error();
    }
}
