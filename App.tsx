
import React, { useState } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { StyleCarousel } from './components/StyleCarousel';
import { ImageComparator } from './components/ImageComparator';
import { ChatInterface, ShoppingLinks } from './components/ChatInterface';
import { ChatMessage, Style, ImageFile, ShoppingItem } from './types';
import { generateImage, getShoppableLinks } from './services/geminiService';
import { SparklesIcon } from './components/icons';

const App: React.FC = () => {
    const [originalImage, setOriginalImage] = useState<ImageFile | null>(null);
    const [generatedImage, setGeneratedImage] = useState<ImageFile | null>(null);
    const [selectedStyle, setSelectedStyle] = useState<Style | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [loadingMessage, setLoadingMessage] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

    const handleImageUpload = (file: ImageFile) => {
        setOriginalImage(file);
        setGeneratedImage(null);
        setSelectedStyle(null);
        setChatMessages([]);
        setError(null);
    };

    const handleStyleSelect = async (style: Style) => {
        if (!originalImage || isLoading) return;
        
        setSelectedStyle(style);
        setIsLoading(true);
        setLoadingMessage(`Reimagining your room in ${style.name} style...`);
        setError(null);
        setGeneratedImage(null);
        
        try {
            const newImageBase64 = await generateImage(originalImage.base64, originalImage.mimeType, style.prompt);
            setGeneratedImage({ ...originalImage, base64: newImageBase64 });
            setChatMessages([
              { id: 'start', role: 'assistant', content: `Here is your room in a ${style.name} style! How can I help you refine it?` }
            ]);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
            setLoadingMessage('');
        }
    };

    const handleSendMessage = async (prompt: string) => {
        if (!generatedImage || isLoading) return;

        const newUserMessage: ChatMessage = { id: Date.now().toString(), role: 'user', content: prompt };
        setChatMessages(prev => [...prev, newUserMessage]);
        setIsLoading(true);
        setError(null);

        const shopKeywords = ['shop', 'buy', 'find', 'link', 'purchase', 'item', 'chair', 'sofa', 'table', 'lamp', 'rug'];
        const isShoppingQuery = shopKeywords.some(keyword => prompt.toLowerCase().includes(keyword));

        if (isShoppingQuery) {
            setLoadingMessage('Searching for shoppable items...');
            try {
                const items = await getShoppableLinks(generatedImage.base64, generatedImage.mimeType, prompt);
                const assistantMessage: ChatMessage = {
                    id: Date.now().toString() + '-1',
                    role: 'assistant',
                    content: <ShoppingLinks items={items} />
                };
                setChatMessages(prev => [...prev, assistantMessage]);
            } catch (e) {
                const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
                setError(errorMessage);
                 const assistantMessage: ChatMessage = {
                    id: Date.now().toString() + '-1',
                    role: 'assistant',
                    content: `Sorry, I couldn't find items for that. ${errorMessage}`
                };
                setChatMessages(prev => [...prev, assistantMessage]);
            }
        } else {
            setLoadingMessage('Applying your changes...');
            try {
                const newImageBase64 = await generateImage(generatedImage.base64, generatedImage.mimeType, prompt);
                setGeneratedImage({ ...generatedImage, base64: newImageBase64 });
                const assistantMessage: ChatMessage = {
                    id: Date.now().toString() + '-1',
                    role: 'assistant',
                    content: "I've updated the design with your changes. What's next?"
                };
                setChatMessages(prev => [...prev, assistantMessage]);
            } catch (e) {
                const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
                setError(errorMessage);
                 const assistantMessage: ChatMessage = {
                    id: Date.now().toString() + '-1',
                    role: 'assistant',
                    content: `Sorry, I couldn't apply that change. ${errorMessage}`
                };
                setChatMessages(prev => [...prev, assistantMessage]);
            }
        }
        setIsLoading(false);
        setLoadingMessage('');
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
            <header className="bg-white shadow-sm">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center">
                    <SparklesIcon className="w-8 h-8 text-indigo-600 mr-3" />
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">AI Interior Design Consultant</h1>
                </div>
            </header>
            <main className="container mx-auto p-4 sm:p-6 lg:p-8">
                {!originalImage ? (
                    <div className="mt-16">
                        <ImageUploader onImageUpload={handleImageUpload} isLoading={isLoading} />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                        <div className="lg:col-span-3 flex flex-col space-y-8">
                            <StyleCarousel onStyleSelect={handleStyleSelect} selectedStyle={selectedStyle} isLoading={isLoading} />
                             {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md" role="alert">{error}</div>}
                            {isLoading && (
                                <div className="flex flex-col items-center justify-center bg-white p-8 rounded-lg shadow-md h-96">
                                    <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4 animate-spin" style={{ borderTopColor: '#4f46e5' }}></div>
                                    <p className="text-lg font-semibold text-gray-700">{loadingMessage}</p>
                                    <p className="text-sm text-gray-500 mt-2">AI is working its magic. This may take a moment.</p>
                                </div>
                            )}
                            {!isLoading && generatedImage && (
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800 mb-4 text-center md:text-left">Compare Your Room</h2>
                                    <ImageComparator originalImage={originalImage.base64} generatedImage={generatedImage.base64} />
                                </div>
                            )}
                             {!isLoading && !generatedImage && (
                                 <div className="flex flex-col items-center justify-center text-center bg-gray-100 p-8 rounded-lg h-96 border-2 border-dashed">
                                    <SparklesIcon className="w-16 h-16 text-gray-400 mb-4" />
                                    <h3 className="text-xl font-semibold text-gray-700">Your reimagined room will appear here.</h3>
                                    <p className="text-gray-500 mt-2">Select a style above to get started.</p>
                                </div>
                            )}
                        </div>
                        <div className="lg:col-span-2">
                             {generatedImage && (
                                <ChatInterface messages={chatMessages} onSendMessage={handleSendMessage} isLoading={isLoading} />
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default App;
