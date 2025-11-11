import React, { useEffect, useState, useRef } from 'react';
import { MoodBoardItem } from '../types';
import { XMarkIcon, TrashIcon, ArrowDownTrayIcon, ArrowUpTrayIcon } from './icons';

interface MoodBoardProps {
    isOpen: boolean;
    onClose: () => void;
    items: MoodBoardItem[];
    onRemoveItem: (id: string) => void;
    onImport: (items: MoodBoardItem[]) => void;
}

export const MoodBoard: React.FC<MoodBoardProps> = ({ isOpen, onClose, items, onRemoveItem, onImport }) => {
    const [isRendered, setIsRendered] = useState(false);
    const importInputRef = useRef<HTMLInputElement>(null);
    
    useEffect(() => {
        if(isOpen) {
            setIsRendered(true);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    const handleAnimationEnd = () => {
        if (!isOpen) {
            setIsRendered(false);
        }
    };

    const handleExport = () => {
        if (items.length === 0) {
            alert("Mood board is empty. Nothing to export.");
            return;
        }
        const dataStr = JSON.stringify(items, null, 2);
        const dataBlob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'moodboard.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleImportChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const text = e.target?.result;
                if (typeof text !== 'string') throw new Error("File content could not be read.");
                
                const importedItems = JSON.parse(text);

                if (!Array.isArray(importedItems) || !importedItems.every(item => 'id' in item && 'imageBase64' in item && 'styleName' in item)) {
                    throw new Error("Invalid mood board file format. Please select a valid JSON file exported from this app.");
                }
                
                onImport(importedItems);
            } catch (error) {
                console.error("Failed to import mood board:", error);
                alert(`Error importing file: ${error instanceof Error ? error.message : "Unknown error"}`);
            }
        };
        reader.readAsText(file);
        // Reset the input so the same file can be selected again
        event.target.value = '';
    };

    if (!isRendered) return null;

    return (
        <div 
            className={`fixed inset-0 bg-black z-50 flex items-center justify-center transition-opacity duration-300 ${isOpen ? 'bg-opacity-70' : 'bg-opacity-0'}`}
            onAnimationEnd={handleAnimationEnd}
            onClick={onClose}
            aria-modal="true" 
            role="dialog"
        >
            <div 
                className={`bg-white dark:bg-slate-800 rounded-lg shadow-2xl w-11/12 max-w-6xl h-5/6 flex flex-col transition-transform duration-300 ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
                onClick={(e) => e.stopPropagation()}
            >
                <header className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center flex-shrink-0">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">My Mood Board</h2>
                    <div className="flex items-center space-x-2">
                        <input type="file" ref={importInputRef} onChange={handleImportChange} accept=".json" className="hidden" />
                        <button 
                            onClick={() => importInputRef.current?.click()}
                            className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" title="Import Mood Board"
                        >
                            <ArrowUpTrayIcon className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                        </button>
                        <button 
                            onClick={handleExport}
                            className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" title="Export Mood Board"
                        >
                            <ArrowDownTrayIcon className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                        </button>
                        <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                            <XMarkIcon className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                        </button>
                    </div>
                </header>
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50 dark:bg-slate-900">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <p className="text-lg text-slate-600 dark:text-slate-400">Your mood board is empty.</p>
                            <p className="text-sm text-slate-500 mt-2">Save your favorite designs to see them here.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {items.map(item => (
                                <div key={item.id} className="group relative overflow-hidden rounded-lg shadow-md aspect-square bg-slate-200 dark:bg-slate-700">
                                    <img 
                                        src={`data:image/png;base64,${item.imageBase64}`} 
                                        alt={`Mood board item - ${item.styleName}`}
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                                        <h3 className="text-white font-bold text-lg">{item.styleName}</h3>
                                        <button 
                                            onClick={() => onRemoveItem(item.id)}
                                            className="absolute top-2 right-2 p-2 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-white transform-gpu scale-90 group-hover:scale-100"
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