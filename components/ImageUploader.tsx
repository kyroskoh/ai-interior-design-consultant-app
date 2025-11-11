import React, { useState, useCallback } from 'react';
import { UploadIcon } from './icons';
import { ImageFile } from '../types';

interface ImageUploaderProps {
  onImageUpload: (file: ImageFile) => void;
  isLoading: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, isLoading }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (file: File | null) => {
    if (file && file.type.startsWith('image/')) {
       const reader = new FileReader();
       reader.onloadend = () => {
         const base64String = (reader.result as string).split(',')[1];
         onImageUpload({
             base64: base64String,
             mimeType: file.type,
             name: file.name,
         });
       };
       reader.readAsDataURL(file);
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto text-center">
      <div
        className={`relative block w-full rounded-lg border-2 border-dashed p-12 text-center transition-colors ${
          isDragging ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/50' : 'border-gray-300 dark:border-slate-600 hover:border-gray-400 dark:hover:border-slate-500'
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <UploadIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-slate-500" />
        <span className="mt-2 block text-sm font-semibold text-gray-900 dark:text-slate-100">
          Upload a photo of your room
        </span>
        <span className="mt-1 block text-sm text-gray-500 dark:text-slate-400">
          Drag and drop, or click to select a file
        </span>
        <input
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            accept="image/*"
            onChange={(e) => handleFileChange(e.target.files ? e.target.files[0] : null)}
            disabled={isLoading}
        />
      </div>
    </div>
  );
};