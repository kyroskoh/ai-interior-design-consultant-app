# AI Interior Design Consultant

An interactive web application that uses the Google Gemini's Nano Banana API to help users reimagine their living spaces. Upload a photo of a room, choose a new style, and let AI generate a fresh look. Refine the design with text prompts, customize materials, find shoppable items, and save your favorite concepts to a personal mood board.

![AI Interior Design Consultant Screenshot](https://storage.googleapis.com/aistudio-project-marketplace-app-assets/interior-design-consultant/screenshot.png)

## Features

- **Upload Your Space**: Easily upload a photo of any room from your device.
- **Style Selection**: Choose from a curated list of popular interior design styles like Mid-Century Modern, Scandinavian, and Bohemian.
- **AI-Powered Redesigns**: Generates a new image of your room based on the selected style using `gemini-2.5-flash-image`.
- **Interactive Comparison**: Use a draggable slider to seamlessly compare the "before" and "after" images.
- **Material Customization**: Fine-tune the design by selecting specific materials and finishes for flooring, walls, and furniture.
- **Chat to Refine**: Use a chat interface to make further changes to the design (e.g., "Make the rug blue").
- **Shop the Look**: Ask the AI to find shoppable links for furniture and decor items in the generated image.
- **Mood Board**: Save your favorite designs and customizations to a personal mood board that persists in your browser.

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **AI & API**: Google Gemini API (`@google/genai`)
  - **Image Generation**: `gemini-2.5-flash-image`
  - **Chat & Data Extraction**: `gemini-2.5-flash`
- **Platform**: AI Studio

## Getting Started

### Prerequisites

- A modern web browser.
- A Google Gemini API Key.

### Setup

1.  **Clone the repository or open in AI Studio.**

2.  **Set up your API Key:**
    - The application requires a Google Gemini API key to function.
    - This project assumes the API key is available as an environment variable (`process.env.API_KEY`).
    - When running in a secure environment like AI Studio, this key is automatically configured.

3.  **Install dependencies (if running locally):**
    ```bash
    npm install
    ```

4.  **Run the application (if running locally):**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

## Project Structure

```
/
├── public/
├── src/
│   ├── components/       # Reusable React components
│   │   ├── ChatInterface.tsx
│   │   ├── icons.tsx
│   │   ├── ImageComparator.tsx
│   │   ├── ImageUploader.tsx
│   │   ├── MaterialCustomizer.tsx
│   │   ├── MoodBoard.tsx
│   │   └── StyleCarousel.tsx
│   ├── services/         # API service for Gemini
│   │   └── geminiService.ts
│   ├── constants.ts      # Static data (styles, customizations)
│   ├── types.ts          # TypeScript type definitions
│   └── App.tsx           # Main application component
├── index.html
├── index.tsx
└── README.md
```
