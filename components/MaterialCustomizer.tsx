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
        <div className="w-full bg-white dark:bg-slate-800 p-6 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-5">3. Customize Materials (Optional)</h2>
            <div className="space-y-5">
                {Object.entries(CUSTOMIZATIONS).map(([category, options]) => (
                    <div key={category}>
                        <h3 className="text-base font-semibold text-slate-600 dark:text-slate-300 mb-2">{category}</h3>
                        <div className="flex flex-wrap gap-2">
                            {options.map(option => {
                                const isSelected = selections[category] === option;
                                return (
                                    <button
                                        key={option}
                                        onClick={() => onSelectionChange(category, isSelected ? '' : option)}
                                        disabled={isLoading}
                                        className={`
                                            px-3 py-1.5 text-sm font-medium rounded-full border transition-all duration-200 transform
                                            ${isSelected 
                                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' 
                                                : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600 hover:border-slate-400 dark:hover:border-slate-500 active:scale-95'}
                                            disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
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
                    disabled={isLoading || Object.values(selections).every(v => !v)}
                    className="w-full px-4 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-sm hover:shadow-md"
                >
                    {isLoading ? 'Applying...' : 'Apply Customizations'}
                </button>
            </div>
        </div>
    );
};