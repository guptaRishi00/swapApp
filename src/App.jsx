// src/App.js
import React from "react";
import "./App.css";
import Header from "./components/Header";
import CryptoSwap from "./components/CryptoSwap";
import { WalletConnectionProvider } from "./solana/WalletProvider";

function App() {
  return (
    <WalletConnectionProvider>
      <Header />
      <CryptoSwap />
    </WalletConnectionProvider>
  );
}

export default App;
