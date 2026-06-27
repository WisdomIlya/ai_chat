"use client";

import { useState } from "react";
import { ChatWindow } from '../src/components/index';

export default function Home() {
  const [text, setText] = useState('');
  const [chatHistory, setChatHistory] = useState<{
    question: string;
    answer: string | null;
    isLoading: boolean;
  }[]
  >([]);

  const handleSendMessageToAi = async() => {
    if(!text) return;

    setChatHistory((prev) => [
      ...prev,
      {
        question: text,
        answer: null,
        isLoading: true
      }
    ]);


    try {
      const response = await fetch('/api/send-ai', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text })
      });

      const data = await response.json();

      setChatHistory((prev) => {
        const newHistory = [...prev];

        const lastIndex = newHistory.findIndex((item) => item.isLoading);

        if(lastIndex !== -1){
          newHistory[lastIndex] = {
            question:text,
            answer: data.message,
            isLoading: false
          }
        }

        setText('');
        return newHistory;
      })
    } catch (error) {
      setChatHistory((prev) => {
        const newHistory = [...prev];

        const lastIndex = newHistory.findIndex((item) => item.isLoading);

        if(lastIndex !== -1){
          newHistory[lastIndex] = {
            question:text,
            answer: 'Произошла ошибка при получении ответа.',
            isLoading: false
          }
        }

        setText('');
        return newHistory;
      })
    }
  }

  const handleClearHistory = () => {
    setChatHistory([]);
  }

  return (
    <div className="w-full md:max-w-[1440px] py-20 px-4 md:px-8 mx-auto bg-black font-sans">
      <div>
        <textarea 
        value={text}
        onChange = {(e) => setText(e.target.value)}
        className="border-white/50 outline-none text-xl resize-none w-full h-40 transition-all duration-300 focus:border-white border rounded-md" />
      </div>
      <div className="flex gap-4 items-center w-full mb-4">
        <button onClick={handleSendMessageToAi} className="border border-white/50 flex-1 cursor-pointer hover:border-white transition-all rounded-sm h-12 bg-black text-white disabled:opacity-50 disabled:cursor-not-allowed">Отправить в AI</button>
        <button onClick={handleClearHistory} className="border border-white/50 flex-1 cursor-pointer hover:border-white transition-all rounded-sm h-12 bg-black text-white disabled:opacity-50 disabled:cursor-not-allowed">Очистить историю</button>
      </div>
      
      <div className="flex flex-col gap-4">
        <h2 className="text-center my-8 font-semibold text-2xl">История чата</h2>
        {chatHistory?.map(({question, answer, isLoading}, index) => (
          <ChatWindow key={index} question={question} answer={answer} isLoading={isLoading} />
        ))}
      </div>
      
    </div>
  );
}
