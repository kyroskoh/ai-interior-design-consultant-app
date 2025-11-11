
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, ShoppingItem } from '../types';
import { SendIcon, SparklesIcon } from './icons';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ShoppingItemCard: React.FC<{ item: ShoppingItem }> = ({ item }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-3 my-2 shadow-sm">
        <h4 className="font-bold text-gray-800">{item.itemName}</h4>
        <p className="text-sm text-gray-600 mt-1">{item.description}</p>
        <div className="flex justify-between items-center mt-3">
            <span className="text-lg font-semibold text-indigo-600">{item.price}</span>
            <a 
                href={item.purchaseUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded-md transition-colors"
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
    <div className="w-full flex flex-col bg-white border border-gray-200 rounded-lg shadow-md h-[40rem] md:h-full">
        <div className="p-4 border-b">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <SparklesIcon className="w-6 h-6 mr-2 text-indigo-500" />
                2. Refine & Shop
            </h2>
             <p className="text-sm text-gray-500 mt-1">
                e.g., "Make the rug blue" or "Where can I buy that chair?"
            </p>
        </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs md:max-w-md lg:max-w-lg rounded-xl px-4 py-2 ${message.role === 'user' ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-800'}`}>
               {typeof message.content === 'string' ? <p>{message.content}</p> : message.content}
            </div>
          </div>
        ))}
        {isLoading && messages[messages.length - 1]?.role === 'user' && (
             <div className="flex justify-start">
                 <div className="max-w-xs md:max-w-md lg:max-w-lg rounded-xl px-4 py-2 bg-gray-100 text-gray-800 flex items-center">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse mr-2"></div>
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse mr-2 delay-150"></div>
                    <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse delay-300"></div>
                 </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="border-t p-4 bg-gray-50">
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe your change..."
            className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="p-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-colors"
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

