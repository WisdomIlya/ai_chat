import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        console.log('📥 Получен текст:', body.text);

        // Проверяем наличие API-ключа
        if (!process.env.OPENROUTER_API_KEY) {
            console.error('❌ OPENROUTER_API_KEY не найден в переменных окружения');
            return NextResponse.json(
                { error: 'API ключ не настроен на сервере' },
                { status: 500 }
            );
        }

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
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

        // 🔍 Логируем статус ответа от OpenRouter
        console.log('📊 Статус ответа от OpenRouter:', response.status);

        // Получаем тело ответа как текст для детального логирования
        const responseText = await response.text();
        console.log('📄 Сырой ответ от OpenRouter:', responseText);

        // Если ответ не успешный (не 200)
        if (!response.ok) {
            let errorMessage = 'Ошибка при запросе к OpenRouter';
            try {
                const errorData = JSON.parse(responseText);
                errorMessage = errorData.error?.message || errorData.message || errorMessage;
            } catch (e) {
                // Если не удалось распарсить JSON, используем текст ошибки
                errorMessage = responseText || errorMessage;
            }
            
            console.error('❌ Ошибка от OpenRouter:', errorMessage);
            return NextResponse.json(
                { error: `OpenRouter: ${errorMessage}` },
                { status: response.status }
            );
        }

        // Парсим успешный ответ
        const data = JSON.parse(responseText);
        
        // Проверяем структуру ответа
        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
            console.error('❌ Неожиданная структура ответа:', data);
            return NextResponse.json(
                { error: 'Неожиданный формат ответа от OpenRouter' },
                { status: 500 }
            );
        }

        const message = data.choices[0].message.content;
        console.log('✅ Успешный ответ от AI:', message);

        return NextResponse.json({ message });
        
    } catch (error) {
        console.error('❌ Критическая ошибка в API роуте:', error);
        return NextResponse.json(
            { 
                error: 'Произошла ошибка при обработке запроса',
                details: error instanceof Error ? error.message : 'Неизвестная ошибка'
            },
            { status: 500 }
        );
    }
}