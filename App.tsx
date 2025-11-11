
import React, { useState, useEffect } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { StyleCarousel } from './components/StyleCarousel';
import { ImageComparator } from './components/ImageComparator';
import { ChatInterface, ShoppingLinks } from './components/ChatInterface';
import { MaterialCustomizer } from './components/MaterialCustomizer';
import { MoodBoard } from './components/MoodBoard';
import { ChatMessage, Style, ImageFile, CustomizationSelections, MoodBoardItem } from './types';
import { generateImage, getShoppableLinks } from './services/geminiService';
import { SparklesIcon, HeartIcon, BookmarkIcon } from './components/icons';

const App: React.FC = () => {
    const [originalImage, setOriginalImage] = useState<ImageFile | null>(null);
    const [generatedImage, setGeneratedImage] = useState<ImageFile | null>(null);
    const [selectedStyle, setSelectedStyle] = useState<Style | null>(null);
    const [customizations, setCustomizations] = useState<CustomizationSelections>({});
    const [moodBoardItems, setMoodBoardItems] = useState<MoodBoardItem[]>([]);
    const [isMoodBoardOpen, setIsMoodBoardOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [loadingMessage, setLoadingMessage] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

    useEffect(() => {
        try {
            const savedMoodBoard = localStorage.getItem('moodBoard');
            if (savedMoodBoard) {
                setMoodBoardItems(JSON.parse(savedMoodBoard));
            }
        } catch (e) {
            console.error("Failed to load mood board from localStorage", e);
        }
    }, []);

    useEffect(() => {
        try {
            localStorage.setItem('moodBoard', JSON.stringify(moodBoardItems));
        } catch (e) {
            console.error("Failed to save mood board to localStorage", e);
        }
    }, [moodBoardItems]);

    const handleImageUpload = (file: ImageFile) => {
        setOriginalImage(file);
        setGeneratedImage(null);
        setSelectedStyle(null);
        setCustomizations({});
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
        setCustomizations({});
        
        try {
            const newImageBase64 = await generateImage(originalImage.base64, originalImage.mimeType, style.prompt);
            setGeneratedImage({ ...originalImage, base64: newImageBase64 });
            setChatMessages([
              { id: 'start', role: 'assistant', content: `Here is your room in a ${style.name} style! You can now customize materials or use the chat to refine the design.` }
            ]);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
            setLoadingMessage('');
        }
    };
    
    const handleCustomizationChange = (category: string, value: string) => {
        setCustomizations(prev => ({ ...prev, [category]: value }));
    };

    const handleApplyCustomizations = async () => {
        if (!generatedImage || isLoading) return;
        
        setIsLoading(true);
        setLoadingMessage('Applying your customizations...');
        setError(null);
        
        const prompt = "Update the design with the user's new material and texture choices, keeping the overall style and layout the same.";
        try {
            const newImageBase64 = await generateImage(generatedImage.base64, generatedImage.mimeType, prompt, customizations);
            setGeneratedImage({ ...generatedImage, base64: newImageBase64 });
            const assistantMessage: ChatMessage = {
                id: Date.now().toString(),
                role: 'assistant',
                content: "I've applied your material choices to the design."
            };
            setChatMessages(prev => [...prev, assistantMessage]);
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
                const newImageBase64 = await generateImage(generatedImage.base64, generatedImage.mimeType, prompt, customizations);
                setGeneratedImage({ ...generatedImage, base64: newImageBase64 });
                const assistantMessage: ChatMessage = {
                    id: Date.now().toString() + '-1',
                    role: 'assistant',
                    content: "I've updated the design with your changes. What's next?"
                };
                setChatMessages(prev => [...prev, assistantMessage]);
            } catch (e) {
                const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
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
    
    const handleSaveToMoodBoard = () => {
        if (!generatedImage || !selectedStyle) return;
        const newItem: MoodBoardItem = {
            id: Date.now().toString(),
            imageBase64: generatedImage.base64,
            styleName: selectedStyle.name,
            customizations: customizations
        };
        setMoodBoardItems(prev => [newItem, ...prev]);
    };

    const handleRemoveMoodBoardItem = (id: string) => {
        setMoodBoardItems(prev => prev.filter(item => item.id !== id));
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
            <header className="bg-white shadow-sm sticky top-0 z-40">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
                    <div className="flex items-center">
                        <SparklesIcon className="w-8 h-8 text-indigo-600 mr-3" />
                        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">AI Interior Design Consultant</h1>
                    </div>
                     <button
                        onClick={() => setIsMoodBoardOpen(true)}
                        className="flex items-center space-x-2 px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors"
                        aria-label="Open mood board"
                    >
                        <BookmarkIcon className="w-5 h-5 text-gray-700" />
                        <span className="font-semibold text-sm hidden sm:block">My Mood Board</span>
                        {moodBoardItems.length > 0 && (
                            <span className="bg-indigo-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">{moodBoardItems.length}</span>
                        )}
                    </button>
                </div>
            </header>
            
            <MoodBoard isOpen={isMoodBoardOpen} onClose={() => setIsMoodBoardOpen(false)} items={moodBoardItems} onRemoveItem={handleRemoveMoodBoardItem} />

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
                                <div className="space-y-8">
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-800 mb-4 text-center md:text-left">2. Compare Your Room</h2>
                                        <div className="relative">
                                            <ImageComparator originalImage={originalImage.base64} generatedImage={generatedImage.base64} />
                                            <button 
                                                onClick={handleSaveToMoodBoard}
                                                className="absolute top-3 right-28 bg-white/80 backdrop-blur-sm rounded-full p-2 hover:bg-white shadow-lg transition-all"
                                                title="Save to Mood Board"
                                                aria-label="Save to Mood Board"
                                            >
                                                <HeartIcon className="w-6 h-6 text-red-500 hover:scale-110 transition-transform" />
                                            </button>
                                        </div>
                                    </div>
                                    <MaterialCustomizer onSelectionChange={handleCustomizationChange} selections={customizations} onApply={handleApplyCustomizations} isLoading={isLoading} />
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
