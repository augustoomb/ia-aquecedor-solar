'use client'

import { useChat } from 'ai/react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import clsx from 'clsx';
import Image from "next/image";

export default function Chatbot() {
    const { messages, input, handleInputChange, handleSubmit } = useChat();

    return (
        <div className='flex flex-col h-full my-2 rounded-lg '>
            <header className='flex items-center justify-between p-12 mb-6 bg-blueLojaDoSol rounded-t-md'>
                <Image src="/logo.png" alt="logo loja do sol" width={150} height={60} />
                <h1 className='flex-grow text-3xl font-bold text-white text-center'>IA Aquecedores</h1>
                <div className="w-[150px]"></div>
            </header>
            <div className='flex flex-col flex-grow p-4 overflow-y-scroll bg-zinc-100 mb-6 rounded-md content-evenly'>
                {messages
                    .filter(message => message.content?.trim() !== "")
                    .map(message => (
                        <div
                            className={clsx(
                                message.role === 'user' ? 'bg-zinc-300 mr-auto text-left' : 'bg-zinc-200 ml-auto text-right',
                                'm-2', 'p-2', 'rounded-md', 'text-neutral-700', 'text-sm'
                            )} key={message.id}>

                            <span className="font-bold">{message.role === 'user' ? 'User: ' : 'AI: '}</span>
                            {message.content}

                        </div>
                    ))}
            </div>

            <form className="flex flex-row gap-x-6" onSubmit={handleSubmit}>
                <Input className='flex-grow' name="prompt" value={input} onChange={handleInputChange} />
                <Button variant={'yellow'} type="submit">Enviar</Button>
            </form>
        </div>
    );
}