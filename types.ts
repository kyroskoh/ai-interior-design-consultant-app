// Fix: Import React to use the React.ReactNode type.
import React from 'react';

export interface Style {
  id: string;
  name: string;
  description: string;
  prompt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string | React.ReactNode;
}

export interface ShoppingItem {
  itemName: string;
  description: string;
  price: string;
  purchaseUrl: string;
}

export interface ImageFile {
  base64: string;
  mimeType: string;
  name: string;
}

export interface CustomizationSelections {
    [category: string]: string;
}

export interface MoodBoardItem {
    id: string;
    imageBase64: string;
    styleName: string;
    customizations: CustomizationSelections;
}
