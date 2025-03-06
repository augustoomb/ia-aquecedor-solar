import { NextApiResponse } from 'next';
import { NextResponse } from 'next/server';

export function GET(req: Request, res: NextApiResponse) {
    return NextResponse.json({ message: 'Teste' }, { status: 200 });
}   