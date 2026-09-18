'use client';

import { useState, useRef, useEffect, type FormEvent } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Loader2, Send } from 'lucide-react';

interface ChatMessage {
	role: 'user' | 'assistant';
	content: string;
}

export default function AssistantChat() {
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [input, setInput] = useState('');
	const [isStreaming, setIsStreaming] = useState(false);
	const scrollRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [messages]);

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		const question = input.trim();
		if (!question || isStreaming) return;

		const nextMessages: ChatMessage[] = [
			...messages,
			{ role: 'user', content: question },
		];
		setMessages([...nextMessages, { role: 'assistant', content: '' }]);
		setInput('');
		setIsStreaming(true);

		try {
			const response = await fetch('/api/chat', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ messages: nextMessages }),
			});

			if (!response.ok || !response.body) {
				const data = await response.json().catch(() => null);
				throw new Error(data?.error || 'Failed to get a response');
			}

			const reader = response.body.getReader();
			const decoder = new TextDecoder();

			while (true) {
				const { done, value } = await reader.read();
				if (done) break;
				const chunkText = decoder.decode(value, { stream: true });
				setMessages((prev) => {
					const updated = [...prev];
					const last = updated[updated.length - 1];
					updated[updated.length - 1] = {
						...last,
						content: last.content + chunkText,
					};
					return updated;
				});
			}
		} catch (error) {
			toast('', {
				description:
					error instanceof Error
						? error.message
						: 'Failed to get a response from the assistant',
			});
			setMessages((prev) => prev.slice(0, -1));
		} finally {
			setIsStreaming(false);
		}
	};

	return (
		<Card className='flex h-[70vh] flex-col p-4'>
			<div className='flex-1 overflow-y-auto pr-1'>
				{messages.length === 0 ? (
					<p className='text-sm text-muted-foreground'>
						Ask me things like &ldquo;how much did I spend on Groceries this
						month?&rdquo; or &ldquo;what&apos;s my net income?&rdquo;
					</p>
				) : (
					<div className='flex flex-col gap-3'>
						{messages.map((message, i) => (
							<div
								key={i}
								className={cn(
									'max-w-[85%] rounded-lg px-3 py-2 text-sm whitespace-pre-wrap',
									message.role === 'user'
										? 'self-end bg-primary text-primary-foreground'
										: 'self-start bg-muted',
								)}>
								{message.content ||
									(isStreaming && i === messages.length - 1 ? (
										<Loader2 className='h-4 w-4 animate-spin' />
									) : (
										''
									))}
							</div>
						))}
						<div ref={scrollRef} />
					</div>
				)}
			</div>
			<form onSubmit={handleSubmit} className='mt-3 flex gap-2'>
				<Input
					value={input}
					onChange={(e) => setInput(e.target.value)}
					placeholder='Ask about your finances...'
					disabled={isStreaming}
				/>
				<Button type='submit' size='icon' disabled={isStreaming || !input.trim()}>
					<Send className='h-4 w-4' />
				</Button>
			</form>
		</Card>
	);
}
