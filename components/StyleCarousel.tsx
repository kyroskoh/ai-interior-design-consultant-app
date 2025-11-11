import React from 'react';
import { STYLES } from '../constants';
import { Style } from '../types';

interface StyleCarouselProps {
    onStyleSelect: (style: Style) => void;
    selectedStyle: Style | null;
    isLoading: boolean;
}

export const StyleCarousel: React.FC<StyleCarouselProps> = ({ onStyleSelect, selectedStyle, isLoading }) => {
    return (
        <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4">1. Choose a Style</h2>
            <div className="flex space-x-4 overflow-x-auto pb-4 -mx-4 px-4">
                {STYLES.map(style => (
                    <button
                        key={style.id}
                        onClick={() => onStyleSelect(style)}
                        disabled={isLoading}
                        className={`
                            flex-shrink-0 w-44 h-28 p-4 rounded-lg border text-left transition-all duration-300 transform 
                            ${selectedStyle?.id === style.id 
                                ? 'bg-indigo-600 text-white border-indigo-700 shadow-lg scale-105' 
                                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-md hover:-translate-y-1'}
                            disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none
                        `}
                    >
                        <h3 className="font-bold text-base">{style.name}</h3>
                        <p className={`text-xs mt-1 opacity-90 ${selectedStyle?.id === style.id ? 'text-indigo-100' : 'text-slate-500 dark:text-slate-400'}`}>{style.description}</p>
                    </button>
                ))}
            </div>
        </div>
    );
};