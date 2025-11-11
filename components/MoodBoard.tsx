
import React from 'react';
import { MoodBoardItem } from '../types';
import { XMarkIcon, TrashIcon } from './icons';

interface MoodBoardProps {
    isOpen: boolean;
    onClose: () => void;
    items: MoodBoardItem[];
    onRemoveItem: (id: string) => void;
}

export const MoodBoard: React.FC<MoodBoardProps> = ({ isOpen, onClose, items, onRemoveItem }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center" aria-modal="true" role="dialog">
            <div className="bg-white rounded-lg shadow-2xl w-11/12 max-w-6xl h-5/6 flex flex-col">
                <header className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800">My Mood Board</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200">
                        <XMarkIcon className="w-6 h-6 text-gray-600" />
                    </button>
                </header>
                <main className="flex-1 overflow-y-auto p-6">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <p className="text-lg text-gray-600">Your mood board is empty.</p>
                            <p className="text-sm text-gray-500 mt-2">Save your favorite designs to see them here.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {items.map(item => (
                                <div key={item.id} className="group relative overflow-hidden rounded-lg shadow-md">
                                    <img 
                                        src={`data:image/png;base64,${item.imageBase64}`} 
                                        alt={`Mood board item - ${item.styleName}`}
                                        className="w-full h-64 object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex flex-col justify-end p-4">
                                        <h3 className="text-white font-bold text-lg opacity-0 group-hover:opacity-100 transition-opacity">{item.styleName}</h3>
                                        <button 
                                            onClick={() => onRemoveItem(item.id)}
                                            className="absolute top-2 right-2 p-2 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-white"
                                            aria-label="Remove from mood board"
                                        >
                                            <TrashIcon className="w-5 h-5 text-red-600"/>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};
