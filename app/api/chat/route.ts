import { NextApiResponse } from 'next';
import { NextResponse } from 'next/server';

const geminiAPI = process.env.GEMINI_API_KEY;

export async function GET(req: Request, res: NextApiResponse) {

    const { GoogleGenerativeAI } = require("@google/generative-ai");

    const genAI = new GoogleGenerativeAI(geminiAPI);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = "Explain how AI works";

    const result = await model.generateContent(prompt);
    console.log(result.response.text());

    return NextResponse.json({ message: result.response.text() }, { status: 200 });
}   