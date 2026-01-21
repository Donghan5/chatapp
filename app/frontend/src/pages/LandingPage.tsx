import React from 'react';
import { useNavigate } from 'react-router-dom';

interface LandingPageProps {
  onStart: () => void;
}

export default function LandingPage({ onStart }: LandingPageProps) {
  const navigate = useNavigate();
  
  const handleStart = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-whatsapp-green rounded-lg flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight">ChatApp</span>
        </div>
        <button
          onClick={handleStart}
          className="text-sm font-semibold text-gray-600 hover:text-whatsapp-green transition-colors"
        >
          Log in
        </button>
      </nav>

      <section className="pt-20 pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
        <div className="flex-1 text-center lg:text-left">
          <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 mb-6 leading-tight">
            Connect simply. <br />
            <span className="text-whatsapp-green">Chat securely.</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto lg:mx-0">
            Experience the new era of messaging. Fast, reliable, and designed to keep your conversations private and effortless.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <button
              onClick={handleStart}
              className="px-8 py-4 bg-whatsapp-green hover:bg-whatsapp-dark-green text-white text-lg font-bold rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
            >
              Start Chatting Now
            </button>
            <button className="px-8 py-4 bg-gray-100 hover:bg-gray-200 text-gray-900 text-lg font-semibold rounded-full transition-colors">
              Learn More
            </button>
          </div>
        </div>
        <div className="flex-1 relative w-full max-w-lg lg:max-w-none">
          <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 z-10 transform rotate-2 hover:rotate-0 transition-transform duration-500">
            <div className="flex items-center gap-4 mb-6 border-b border-gray-100 pb-4">
              <div className="w-12 h-12 rounded-full bg-gray-200"></div>
              <div>
                <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 w-20 bg-gray-100 rounded"></div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0"></div>
                <div className="bg-gray-100 p-3 rounded-2xl rounded-tl-none max-w-[80%]">
                  <div className="h-3 w-48 bg-gray-300 rounded mb-2"></div>
                  <div className="h-3 w-32 bg-gray-300 rounded"></div>
                </div>
              </div>
              <div className="flex gap-3 flex-row-reverse">
                <div className="w-8 h-8 rounded-full bg-whatsapp-green flex-shrink-0"></div>
                <div className="bg-whatsapp-light-green p-3 rounded-2xl rounded-tr-none max-w-[80%]">
                  <div className="h-3 w-40 bg-whatsapp-green/20 rounded mb-2"></div>
                  <div className="h-3 w-24 bg-whatsapp-green/20 rounded"></div>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0"></div>
                <div className="bg-gray-100 p-3 rounded-2xl rounded-tl-none max-w-[80%]">
                  <div className="h-3 w-56 bg-gray-300 rounded"></div>
                </div>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-100 flex gap-3">
              <div className="flex-1 h-10 bg-gray-100 rounded-full"></div>
              <div className="w-10 h-10 bg-whatsapp-green rounded-full"></div>
            </div>
          </div>
          <div className="absolute top-10 -right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>
      </section>

      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why choose ChatApp?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">We prioritize your experience with features that matter.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Lightning Fast</h3>
              <p className="text-gray-600 leading-relaxed">
                Messages are delivered instantly. No lag, no waiting. Stay connected in real-time with friends and family.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Secure by Default</h3>
              <p className="text-gray-600 leading-relaxed">
                Your conversations are private. End-to-end encryption ensures only you and the person you're communicating with can read what's sent.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Simple & Intuitive</h3>
              <p className="text-gray-600 leading-relaxed">
                A clean interface that just works. No clutter, no confusion. Just the features you need to communicate effectively.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-whatsapp-green rounded-lg flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <span className="text-xl font-bold">ChatApp</span>
            </div>
            <div className="flex gap-8 text-gray-400 text-sm">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
            © 2025 ChatApp Inc. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}