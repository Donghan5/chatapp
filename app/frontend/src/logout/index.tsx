import React, { useEffect } from "react";

interface LogoutProps {
  onLogoutComplete: () => void;
}

export default function Logout({ onLogoutComplete }: LogoutProps) {
  
  useEffect(() => {
    localStorage.removeItem('jwtToken');

    const timer = setTimeout(() => {
      onLogoutComplete(); 
    }, 2000);

    return () => clearTimeout(timer);
  }, [onLogoutComplete]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
        <div className="rounded-lg shadow-xl w-full max-w-md overflow-hidden bg-white">
            <div className="bg-whatsapp-green p-6">
                <h1 className="text-3xl font-bold text-white text-center">
                    Goodbye!
                </h1>
                <p className="text-center text-white/80 mt-2">
                    Logging you out...
                </p>
            </div>
             <div className="p-8 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-whatsapp-green"></div>
            </div>
        </div>
    </div>
  );
}