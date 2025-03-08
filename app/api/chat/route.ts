import { NextApiResponse } from 'next';
import { NextResponse } from 'next/server';
import { google } from '@ai-sdk/google';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText } from 'ai';
import { retrieveContext } from '@/lib/langchain';
import test from 'node:test';


export async function POST(req: Request) {
    try {
        const geminiAPI = process.env.GEMINI_API_KEY;

        const { messages } = await req.json();

        const question = messages[0].content;

        const retrievedContext = await retrieveContext(question);

        const systemMessage = `Você é um assistente útil. Evite responder avisando que você é um assistente ou de onde pegou a informação.
        Apenas responda a pergunta.
        Utilize as informações a seguir para responder às perguntas:
        Contexto: ${retrievedContext}`

        const google = createGoogleGenerativeAI({
            apiKey: geminiAPI,
        });

        const result = streamText({
            model: google('gemini-1.5-flash'),
            messages: messages,
            maxSteps: 3,
            system: systemMessage,
        });

        return result.toDataStreamResponse();

    } catch (error) {
        console.error("Erro na API:", error);
        return NextResponse.json(
            { error: "Ocorreu um erro ao processar sua solicitação" },
            { status: 500 }
        );
    }
}
