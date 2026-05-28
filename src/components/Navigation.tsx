/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { ShoppingBag, Sparkles, Wand2, BookOpen, MessageSquare, Menu, X } from "lucide-react";

interface NavigationProps {
  currentView: string;
  setView: (view: string) => void;
  cartCount: number;
  onOpenCart: () => void;
  toggleChat: () => void;
  isChatOpen: boolean;
}

export default function Navigation({
  currentView,
  setView,
  cartCount,
  onOpenCart,
  toggleChat,
  isChatOpen
}: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems = [
    { id: "nav-shop", label: "Product Boutique", view: "shop", icon: ShoppingBag },
    { id: "nav-tryon", label: "Virtual Shade Try-On", view: "tryon", icon: Wand2 },
    { id: "nav-quiz", label: "Skincare Analyzer AI", view: "quiz", icon: Sparkles },
    { id: "nav-glossary", label: "Ingredient Glossary", view: "glossary", icon: BookOpen },
  ];

  const handleNavClick = (view: string) => {
    setView(view);
    setMobileMenuOpen(false);
  };

  return (
    <header id="aura-header" className="sticky top-0 z-40 w-full border-b border-stone-100 bg-white/80 backdrop-blur-md">
      {/* Editorial Top Line */}
      <div id="top-announcement" className="bg-stone-900 py-1.5 text-center text-[10px] sm:text-xs font-medium tracking-widest text-stone-100 uppercase">
        Complimentary Signature Keepsake Gift with all orders over $75
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo Brand */}
          <div 
            id="brand-logo" 
            onClick={() => handleNavClick("shop")}
            className="flex cursor-pointer flex-col items-start select-none"
          >
            <span style={{ borderColor: "#171c1c" }} className="font-serif text-xl sm:text-2xl font-light tracking-[0.25em] text-stone-900 transition hover:opacity-80">
              A U R A
            </span>
            <span className="text-[9px] tracking-[0.35em] text-stone-400 font-mono -mt-1 uppercase">
              COSMETICS & LAB
            </span>
          </div>

          {/* Desktop Nav Items */}
          <nav id="desktop-nav" className="hidden md:flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.view;
              return (
                <button
                  key={item.id}
                  id={item.id}
                  onClick={() => handleNavClick(item.view)}
                  className={`group relative flex items-center gap-1.5 px-4 py-2 text-sm font-medium tracking-wide transition-all ${
                    isActive 
                      ? "text-stone-950" 
                      : "text-stone-500 hover:text-stone-900"
                  }`}
                >
                  <Icon className={`h-4 w-4 stroke-[1.5] transition-transform ${isActive ? 'scale-110' : 'group-hover:scale-105'}`} />
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-stone-950 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Counters */}
          <div id="header-actions" className="flex items-center gap-2 sm:gap-3">
            {/* AI Assistant Toggle Button */}
            <button
              id="ai-consultant-toggle"
              onClick={toggleChat}
              className={`relative flex items-center justify-center rounded-full p-2.5 transition-all duration-300 border ${
                isChatOpen 
                  ? "bg-stone-950 border-stone-950 text-white shadow-sm" 
                  : "bg-white border-stone-200 text-stone-700 hover:border-stone-400 hover:bg-stone-50"
              }`}
              title="Aura AI Expert Consultation"
            >
              <MessageSquare className="h-4.5 w-4.5 stroke-[1.5]" />
              <span className={`absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full ${isChatOpen ? 'bg-amber-400' : 'bg-rose-500 animate-pulse'}`} />
            </button>

            {/* Shopping Cart Button */}
            <button
              id="cart-trigger-btn"
              onClick={onOpenCart}
              className="relative flex items-center gap-2 rounded-full border border-stone-200 bg-white px-3 py-2 text-stone-700 transition hover:border-stone-400 hover:bg-stone-50"
            >
              <ShoppingBag className="h-4.5 w-4.5 stroke-[1.5]" />
              <span className="hidden sm:inline text-xs font-medium tracking-wide">Bags</span>
              {cartCount > 0 && (
                <span id="cart-count-badge" className="flex h-5 w-5 items-center justify-center rounded-full bg-stone-950 text-[10px] font-bold text-white shadow-sm animate-scale">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile menu button */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-full border border-stone-200 bg-white p-2 text-stone-600 hover:bg-stone-50 md:hidden"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div id="mobile-nav-panel" className="border-t border-stone-100 bg-white px-4 py-3 md:hidden space-y-1 animate-fade-in shadow-lg">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.view;
            return (
              <button
                key={item.id + "-mobile"}
                id={item.id + "-mobile"}
                onClick={() => handleNavClick(item.view)}
                className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                  isActive 
                    ? "bg-stone-50 text-stone-950 font-semibold border-l-2 border-stone-950" 
                    : "text-stone-500 hover:bg-stone-50/50 hover:text-stone-900"
                }`}
              >
                <Icon className="h-5 w-5 stroke-[1.5]" />
                {item.label}
              </button>
            );
          })}
          <div className="pt-2 border-t border-stone-50">
            <button
              id="mobile-chat-trigger"
              onClick={() => {
                toggleChat();
                setMobileMenuOpen(false);
              }}
              className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-stone-700 bg-stone-50/50 hover:bg-stone-50"
            >
              <MessageSquare className="h-5 w-5 text-rose-500" />
              AURA AI Expert Chat
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
