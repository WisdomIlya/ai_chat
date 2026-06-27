import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                Authorization: 'Bearer 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',
                'HTTP-Referer': 'http://localhost:3000',
                'X-Title': 'ai_chat',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'openai/gpt-4o-mini',
                messages: [
                {
                    role: 'user',
                    content: body.text,
                },
                ],
            }),
        });

        const responseText = await response.text();

        if (!response.ok) {
            let errorMessage = 'Ошибка при запросе к OpenRouter';
            try {
                const errorData = JSON.parse(responseText);
                errorMessage = errorData.error?.message || errorData.message || errorMessage;
            } catch (e) {
                errorMessage = responseText || errorMessage;
            }
        
            return NextResponse.json(
                { error: `OpenRouter: ${errorMessage}` },
                { status: response.status }
            );
        }

        const data = JSON.parse(responseText);
        
        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
            return NextResponse.json(
                { error: 'Неожиданный формат ответа от OpenRouter' },
                { status: 500 }
            );
        }

        const message = data.choices[0].message.content;

        return NextResponse.json({ message });
        
    } catch (error) {
        return NextResponse.json(
            { 
                error: 'Произошла ошибка при обработке запроса',
                details: error instanceof Error ? error.message : 'Неизвестная ошибка'
            },
            { status: 500 }
        );
    }
}