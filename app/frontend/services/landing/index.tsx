import React from 'react';

interface LandingPageProps {
  onStart: () => void;
}

export default function LandingPage({ onStart }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <header className="mb-12 text-center">
        <div className="w-20 h-20 bg-whatsapp-green rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Connect Simply.
        </h1>
        <p className="text-xl text-gray-600 max-w-md">
          Experience the new era of messaging. Fast, secure, and designed for you.
        </p>
      </header>

      <main className="w-full max-w-sm space-y-4">
        <button
          onClick={onStart}
          className="w-full py-3 px-6 bg-whatsapp-green hover:bg-whatsapp-dark-green text-white text-lg font-semibold rounded-full shadow-md transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-whatsapp-green"
        >
          Get Started
        </button>
        
        <p className="text-center text-sm text-gray-400 mt-8">
          © 2025 ChatApp Inc. All rights reserved.
        </p>
      </main>
    </div>
  );
}