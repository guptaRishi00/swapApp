import { useState } from "react";
import { Wallet } from "lucide-react";

export default function Header() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <header className="w-full bg-black text-white py-4 px-6 border-b border-gray-800">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="h-8 w-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-md flex items-center justify-center">
              <div className="h-3 w-3 bg-white rounded-sm transform rotate-45"></div>
            </div>
            <div className="absolute -bottom-1 -right-1 h-2 w-2 bg-teal-400 rounded-full"></div>
          </div>
          <span className="font-bold text-xl tracking-tight">
            Swap<span className="text-indigo-400">App</span>
          </span>
        </div>

        <div className="flex items-center space-x-6">
          <button
            className="flex cursor-pointer items-center bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 shadow-lg shadow-indigo-900/20"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <Wallet
              size={16}
              className={`mr-2 ${isHovered ? "animate-pulse" : ""}`}
            />
            <span className="text-sm">Connect Wallet</span>
          </button>
        </div>
      </div>
    </header>
  );
}
