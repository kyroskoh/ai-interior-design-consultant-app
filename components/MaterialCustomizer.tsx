
import React from 'react';
import { CUSTOMIZATIONS } from '../constants';
import { CustomizationSelections } from '../types';

interface MaterialCustomizerProps {
    onSelectionChange: (category: string, value: string) => void;
    selections: CustomizationSelections;
    onApply: () => void;
    isLoading: boolean;
}

export const MaterialCustomizer: React.FC<MaterialCustomizerProps> = ({ onSelectionChange, selections, onApply, isLoading }) => {
    return (
        <div className="w-full bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-4 text-center md:text-left">3. Customize Materials (Optional)</h2>
            <div className="space-y-4">
                {Object.entries(CUSTOMIZATIONS).map(([category, options]) => (
                    <div key={category}>
                        <h3 className="text-sm font-semibold text-gray-600 mb-2">{category}</h3>
                        <div className="flex flex-wrap gap-2">
                            {options.map(option => {
                                const isSelected = selections[category] === option;
                                return (
                                    <button
                                        key={option}
                                        onClick={() => onSelectionChange(category, isSelected ? '' : option)}
                                        disabled={isLoading}
                                        className={`
                                            px-3 py-1.5 text-sm font-medium rounded-full border transition-all duration-200
                                            ${isSelected ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}
                                            disabled:opacity-50 disabled:cursor-not-allowed
                                        `}
                                    >
                                        {option}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-6">
                 <button
                    onClick={onApply}
                    disabled={isLoading}
                    className="w-full px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 disabled:bg-indigo-300 transition-colors"
                >
                    Apply Customizations
                </button>
            </div>
        </div>
    );
};
