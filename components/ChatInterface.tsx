import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, ShoppingItem } from '../types';
import { SendIcon, SparklesIcon } from './icons';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ShoppingItemCard: React.FC<{ item: ShoppingItem }> = ({ item }) => (
    <div className="bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg p-3 my-2 shadow-sm hover:shadow-md transition-shadow">
        <h4 className="font-bold text-slate-800 dark:text-slate-100">{item.itemName}</h4>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{item.description}</p>
        <div className="flex justify-between items-center mt-3">
            <span className="text-lg font-semibold text-indigo-500">{item.price}</span>
            <a 
                href={item.purchaseUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded-md transition-colors shadow-sm hover:shadow-md"
            >
                View Item
            </a>
        </div>
    </div>
);

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <div className="w-full flex flex-col bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-md h-[40rem] md:h-full">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 rounded-t-lg">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center">
                <SparklesIcon className="w-6 h-6 mr-2 text-indigo-500" />
                Refine & Shop
            </h2>
             <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                e.g., "Make the rug blue" or "Where can I buy that chair?"
            </p>
        </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-100/50 dark:bg-slate-900/50">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs md:max-w-md lg:max-w-lg rounded-xl px-4 py-3 shadow-sm ${message.role === 'user' ? 'bg-indigo-600 text-white rounded-br-lg' : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-bl-lg border border-slate-200 dark:border-slate-600'}`}>
               {typeof message.content === 'string' ? <p className="leading-relaxed">{message.content}</p> : message.content}
            </div>
          </div>
        ))}
        {isLoading && messages[messages.length - 1]?.role === 'user' && (
             <div className="flex justify-start">
                 <div className="max-w-xs md:max-w-md lg:max-w-lg rounded-xl px-4 py-3 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-800 flex items-center space-x-2 shadow-sm">
                    <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-pulse"></div>
                    <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                 </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="border-t border-slate-200 dark:border-slate-700 p-4 bg-white dark:bg-slate-800 rounded-b-lg">
        <form onSubmit={handleSubmit} className="flex items-center space-x-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe your change..."
            className="flex-1 p-2.5 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="p-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-sm hover:shadow-md"
            aria-label="Send message"
          >
            <SendIcon className="w-6 h-6" />
          </button>
        </form>
      </div>
    </div>
  );
};

export const ShoppingLinks: React.FC<{ items: ShoppingItem[] }> = ({ items }) => (
    <div>
        <p className="mb-2 font-medium">Here are some items I found for you:</p>
        <div className="space-y-2">
            {items.map((item, index) => <ShoppingItemCard key={index} item={item} />)}
        </div>
    </div>
);