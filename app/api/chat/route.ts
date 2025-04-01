import { NextResponse } from 'next/server';
import { streamText } from 'ai';
import { instructions } from '@/app/config/llm';
import { createOpenAI } from '@ai-sdk/openai';

export async function POST(req: Request) {
    try {
        const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
        const HUGGING_FACE_API_KEY = process.env.HUGGING_FACE_API_KEY;
        const LANGFLOW_API_URL = process.env.LANGFLOW_API_URL;
        const url = `${LANGFLOW_API_URL}`;

        const { messages } = await req.json();

        // console.log(messages);

        const question = messages[0].content;

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${HUGGING_FACE_API_KEY}`,
            },
            body: JSON.stringify({
                "input_value": question
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        const systemMessage = data.outputs[0].outputs[0].results.message.data.text;

        const systemMessageWithInstructions = `
            ${instructions}
            ${systemMessage}
        `;

        console.log(systemMessageWithInstructions);

        const openaiProvider = createOpenAI({
            apiKey: OPENAI_API_KEY,
        });

        const result = streamText({
            model: openaiProvider('gpt-4o'),
            messages: messages,
            maxSteps: 3,
            system: systemMessageWithInstructions,
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
