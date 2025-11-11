
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
        <div className="w-full">
            <h2 className="text-xl font-bold text-gray-800 mb-4 text-center md:text-left">1. Choose a Style</h2>
            <div className="flex space-x-4 overflow-x-auto p-2 -mx-2">
                {STYLES.map(style => (
                    <button
                        key={style.id}
                        onClick={() => onStyleSelect(style)}
                        disabled={isLoading}
                        className={`
                            flex-shrink-0 w-40 h-24 p-4 rounded-lg border transition-all duration-200
                            ${selectedStyle?.id === style.id ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg scale-105' : 'bg-white text-gray-700 border-gray-300 hover:border-indigo-500 hover:shadow-md'}
                            disabled:opacity-50 disabled:cursor-not-allowed
                        `}
                    >
                        <h3 className="font-bold text-sm text-left">{style.name}</h3>
                        <p className="text-xs text-left mt-1 opacity-90">{style.description}</p>
                    </button>
                ))}
            </div>
        </div>
    );
};
