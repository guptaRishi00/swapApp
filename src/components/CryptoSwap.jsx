import { useState, useEffect } from "react";
import {
  ChevronDown,
  ArrowDown,
  Info,
  Search,
  X,
  RefreshCw,
} from "lucide-react";

import { fetchQuote } from "@mayanfinance/swap-sdk";
import axios from "axios";

export default function CryptoSwap() {
  const [fromToken, setFromToken] = useState("SOL");
  const [toToken, setToToken] = useState("RAY");
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [conversionRate, setConversionRate] = useState(12.85);
  const { publicKey, connect, disconnect, connected } = useWallet();

  // Generate mock exchange rates
  const getExchangeRate = (from, to) => {
    const rates = {
      SOL_RAY: 12.85,
      SOL_USDC: 59.82,
      SOL_ETH: 0.0087,
      SOL_BTC: 0.00045,
      RAY_SOL: 0.0778,
      USDC_SOL: 0.0167,
      ETH_SOL: 114.94,
      BTC_SOL: 2217.78,
    };

    const pair = `${from}_${to}`;
    return rates[pair] || (Math.random() * 100).toFixed(2);
  };

  const cryptoOptions = [
    {
      symbol: "SOL",
      name: "Solana",
      icon: "bg-blue-500",
      balance: "1.45",
      price: 59.82,
    },
    {
      symbol: "RAY",
      name: "Raydium",
      icon: "bg-pink-500",
      balance: "245.8",
      price: 4.65,
    },
    {
      symbol: "USDC",
      name: "USD Coin",
      icon: "bg-blue-400",
      balance: "350.20",
      price: 1.0,
    },
    {
      symbol: "ETH",
      name: "Ethereum",
      icon: "bg-purple-500",
      balance: "0.15",
      price: 6870.25,
    },
    {
      symbol: "BTC",
      name: "Bitcoin",
      icon: "bg-yellow-500",
      balance: "0.008",
      price: 132500.0,
    },
    {
      symbol: "USDT",
      name: "Tether",
      icon: "bg-green-500",
      balance: "520.75",
      price: 1.0,
    },
    {
      symbol: "BONK",
      name: "Bonk",
      icon: "bg-yellow-400",
      balance: "1,250,000",
      price: 0.000034,
    },
    {
      symbol: "ORCA",
      name: "Orca",
      icon: "bg-cyan-500",
      balance: "68.21",
      price: 1.72,
    },
  ];

  useEffect(() => {
    // Update conversion rate when tokens change
    const rate = getExchangeRate(fromToken, toToken);
    setConversionRate(rate);

    // Recalculate to amount when from amount changes
    if (fromAmount) {
      setToAmount((parseFloat(fromAmount) * rate).toFixed(4));
    } else {
      setToAmount("");
    }
  }, [fromToken, toToken, fromAmount]);

  const filteredOptions = cryptoOptions.filter(
    (option) =>
      option.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      option.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFromTokenSelect = (symbol) => {
    if (symbol === toToken) {
      setToToken(fromToken); // Swap tokens if same is selected
    }
    setFromToken(symbol);
    setShowFromDropdown(false);
    setSearchQuery("");
  };

  const handleToTokenSelect = (symbol) => {
    if (symbol === fromToken) {
      setFromToken(toToken); // Swap tokens if same is selected
    }
    setToToken(symbol);
    setShowToDropdown(false);
    setSearchQuery("");
  };

  const getTokenPrice = (symbol) => {
    const token = cryptoOptions.find((t) => t.symbol === symbol);
    return token ? token.price : 0;
  };

  const calculateUsdValue = (amount, tokenSymbol) => {
    if (!amount) return "0.00";
    const tokenPrice = getTokenPrice(tokenSymbol);
    return (parseFloat(amount) * tokenPrice).toFixed(2);
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white font-sans p-6">
      <div className="max-w-md mx-auto">
        {/* Top Controls */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-2 text-sm">
            <button className="flex items-center bg-cyan-500 bg-opacity-20 hover:bg-opacity-30 rounded-lg px-3 py-1 text-cyan-400">
              <span>Buy</span>
            </button>
          </div>
          <div className="flex space-x-4 items-center">
            <span className="text-gray-400">0.5%</span>
            <button className="text-gray-400 hover:text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                />
              </svg>
            </button>
            <button className="text-gray-400 hover:text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Swap Card */}
        <div className="bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-700">
          {/* Title */}
          <div className="flex items-center space-x-1 mb-4 text-gray-300">
            <h3 className="font-medium">
              {toToken} / {fromToken}
            </h3>
            <span className="text-xs text-gray-400">25/05/05 18:05</span>
          </div>

          {/* Swap Form */}
          <div className="space-y-6">
            {/* From Token */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">From</span>
                <div className="flex space-x-2">
                  <button className="text-gray-400 hover:text-white text-xs px-2 border border-gray-600 rounded">
                    0
                  </button>
                  <button className="text-gray-400 hover:text-white text-xs px-2 border border-gray-600 rounded">
                    Max
                  </button>
                  <button className="text-gray-400 hover:text-white text-xs px-2 border border-gray-600 rounded">
                    50%
                  </button>
                </div>
              </div>

              <div className="bg-gray-900 rounded-lg p-2 flex justify-between items-center relative">
                <div
                  className="flex items-center space-x-2 cursor-pointer"
                  onClick={() => setShowFromDropdown(!showFromDropdown)}
                >
                  <div className="w-6 h-6 bg-blue-500 rounded-full"></div>
                  <div className="flex items-center">
                    <span className="font-medium">{fromToken}</span>
                    <ChevronDown size={16} className="ml-1 text-gray-400" />
                  </div>
                </div>
                <div className="text-right">
                  <input
                    type="number"
                    placeholder="0.0"
                    className="bg-transparent text-right text-lg font-medium focus:outline-none w-32"
                    value={fromAmount}
                    onChange={(e) => setFromAmount(e.target.value)}
                  />
                  <div className="text-xs text-gray-400">
                    ${calculateUsdValue(fromAmount, fromToken)}
                  </div>
                </div>

                {/* From Token Dropdown */}
                {showFromDropdown && (
                  <div className="absolute top-12 left-0 w-full bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-10">
                    <div className="p-3 border-b border-gray-700">
                      <div className="relative">
                        <Search
                          size={16}
                          className="absolute left-2 top-2.5 text-gray-400"
                        />
                        <input
                          type="text"
                          placeholder="Search tokens"
                          className="w-full bg-gray-900 text-white pl-8 pr-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="max-h-64 overflow-y-auto py-2">
                      {filteredOptions.map((option) => (
                        <div
                          key={option.symbol}
                          className="flex items-center justify-between px-3 py-2 hover:bg-gray-700 cursor-pointer"
                          onClick={() => handleFromTokenSelect(option.symbol)}
                        >
                          <div className="flex items-center space-x-2">
                            <div
                              className={`w-6 h-6 ${option.icon} rounded-full`}
                            ></div>
                            <div>
                              <div className="font-medium">{option.symbol}</div>
                              <div className="text-xs text-gray-400">
                                {option.name}
                              </div>
                            </div>
                          </div>
                          <div className="text-sm text-gray-300">
                            {option.balance}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-2 border-t border-gray-700 flex justify-end">
                      <button
                        className="text-sm text-gray-400 hover:text-white flex items-center"
                        onClick={() => setShowFromDropdown(false)}
                      >
                        <X size={14} className="mr-1" /> Close
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Arrow */}
            <div className="space-y-2">
              <div className="flex justify-center">
                <div
                  className="bg-gray-700 rounded-full p-2 cursor-pointer hover:bg-gray-600"
                  onClick={() => {
                    // Swap tokens
                    const tempToken = fromToken;
                    setFromToken(toToken);
                    setToToken(tempToken);
                    // Swap amounts
                    setFromAmount(toAmount);
                  }}
                >
                  <ArrowDown size={20} className="text-blue-400" />
                </div>
              </div>

              {/* Conversion Rate */}
              <div className="flex justify-center">
                <div className="bg-gray-800 rounded-lg px-3 py-1 text-gray-400 text-xs flex items-center">
                  <span>
                    1 {fromToken} ≈ {conversionRate} {toToken}
                  </span>
                  <button className="ml-2 text-blue-400 hover:text-blue-300">
                    <RefreshCw size={12} />
                  </button>
                </div>
              </div>
            </div>

            {/* To Token */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">To</span>
                <div className="flex space-x-2">
                  <button className="text-gray-400 hover:text-white text-xs px-2 border border-gray-600 rounded">
                    0
                  </button>
                  <button className="text-gray-400 hover:text-white text-xs px-2 border border-gray-600 rounded">
                    Max
                  </button>
                  <button className="text-gray-400 hover:text-white text-xs px-2 border border-gray-600 rounded">
                    50%
                  </button>
                </div>
              </div>

              <div className="bg-gray-900 rounded-lg p-2 flex justify-between items-center relative">
                <div
                  className="flex items-center space-x-2 cursor-pointer"
                  onClick={() => setShowToDropdown(!showToDropdown)}
                >
                  <div className="w-6 h-6 bg-pink-500 rounded-full"></div>
                  <div className="flex items-center">
                    <span className="font-medium">{toToken}</span>
                    <ChevronDown size={16} className="ml-1 text-gray-400" />
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-medium">{toAmount || "0.0"}</div>
                  <div className="text-xs text-gray-400">
                    ${calculateUsdValue(toAmount, toToken)}
                  </div>
                </div>

                {/* To Token Dropdown */}
                {showToDropdown && (
                  <div className="absolute top-12 left-0 w-full bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-10">
                    <div className="p-3 border-b border-gray-700">
                      <div className="relative">
                        <Search
                          size={16}
                          className="absolute left-2 top-2.5 text-gray-400"
                        />
                        <input
                          type="text"
                          placeholder="Search tokens"
                          className="w-full bg-gray-900 text-white pl-8 pr-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="max-h-64 overflow-y-auto py-2">
                      {filteredOptions.map((option) => (
                        <div
                          key={option.symbol}
                          className="flex items-center justify-between px-3 py-2 hover:bg-gray-700 cursor-pointer"
                          onClick={() => handleToTokenSelect(option.symbol)}
                        >
                          <div className="flex items-center space-x-2">
                            <div
                              className={`w-6 h-6 ${option.icon} rounded-full`}
                            ></div>
                            <div>
                              <div className="font-medium">{option.symbol}</div>
                              <div className="text-xs text-gray-400">
                                {option.name}
                              </div>
                            </div>
                          </div>
                          <div className="text-sm text-gray-300">
                            {option.balance}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-2 border-t border-gray-700 flex justify-end">
                      <button
                        className="text-sm text-gray-400 hover:text-white flex items-center"
                        onClick={() => setShowToDropdown(false)}
                      >
                        <X size={14} className="mr-1" /> Close
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Connect Wallet Button */}
            <button className="w-full bg-cyan-400 hover:bg-cyan-300 text-gray-900 font-medium py-3 px-4 rounded-lg transition-colors">
              Connected Wallet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
