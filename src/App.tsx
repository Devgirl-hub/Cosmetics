/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { 
  Search, 
  Filter, 
  SlidersHorizontal, 
  Star, 
  Sparkles, 
  Plus, 
  ChevronRight, 
  ArrowRight,
  BookOpen, 
  Award, 
  ShieldCheck,
  CheckCircle2,
  Heart
} from "lucide-react";

import { PRODUCTS, INGREDIENT_GLOSSARY } from "./data";
import { Product, CartItem, ProductShade } from "./types";

import Navigation from "./components/Navigation";
import CartDrawer from "./components/CartDrawer";
import ProductDetailsModal from "./components/ProductDetailsModal";
import CustomizerQuiz from "./components/CustomizerQuiz";
import VirtualTryOn from "./components/VirtualTryOn";
import BeautyChat from "./components/BeautyChat";

export default function App() {
  const [currentView, setView] = React.useState<string>("shop"); // 'shop' | 'tryon' | 'quiz' | 'glossary'
  
  // Cart management
  const [cartItems, setCartItems] = React.useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = React.useState(false);
  
  // AI Chat Sidebar management
  const [isChatOpen, setIsChatOpen] = React.useState(false);

  // Detail Popover overlay state
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);

  // Shop filters
  const [activeCategory, setActiveCategory] = React.useState<string>("all");
  const [searchTerm, setSearchTerm] = React.useState("");
  const [sortOption, setSortOption] = React.useState<string>("featured");
  const [glossarySearch, setGlossarySearch] = React.useState("");

  // Wishlist list
  const [wishlist, setWishlist] = React.useState<string[]>([]);

  // Checkout successful notification banner
  const [checkoutNotice, setCheckoutNotice] = React.useState(false);

  // Sync cart from LocalStorage on mount
  React.useEffect(() => {
    const savedCart = localStorage.getItem("aura_checkout_bag");
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error(e);
      }
    }
    const savedWish = localStorage.getItem("aura_heart_list");
    if (savedWish) {
      try {
        setWishlist(JSON.parse(savedWish));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Save cart to LocalStorage when changed
  const saveCartToStorage = (updated: CartItem[]) => {
    setCartItems(updated);
    localStorage.setItem("aura_checkout_bag", JSON.stringify(updated));
  };

  // Add Item to cart
  const handleAddToCart = (product: Product, quantity: number, selectedShade?: ProductShade) => {
    const existingIndex = cartItems.findIndex(item => 
      item.product.id === product.id && 
      (!selectedShade || item.selectedShade?.name === selectedShade.name)
    );

    if (existingIndex > -1) {
      const updated = [...cartItems];
      updated[existingIndex].quantity += quantity;
      saveCartToStorage(updated);
    } else {
      const updated = [...cartItems, { product, quantity, selectedShade }];
      saveCartToStorage(updated);
    }
  };

  // Modify quantities inside Drawer
  const handleUpdateQuantity = (productId: string, quantity: number, shadeName?: string) => {
    if (quantity <= 0) {
      handleRemoveItem(productId, shadeName);
      return;
    }
    const updated = cartItems.map(item => {
      const matchShade = !shadeName || item.selectedShade?.name === shadeName;
      if (item.product.id === productId && matchShade) {
        return { ...item, quantity };
      }
      return item;
    });
    saveCartToStorage(updated);
  };

  // Delete Item from drawer
  const handleRemoveItem = (productId: string, shadeName?: string) => {
    const updated = cartItems.filter(item => {
      const matchShade = !shadeName || item.selectedShade?.name === shadeName;
      return !(item.product.id === productId && matchShade);
    });
    saveCartToStorage(updated);
  };

  // Checkout Success triggers empty state
  const handleCheckoutSuccess = () => {
    setCartItems([]);
    localStorage.removeItem("aura_checkout_bag");
    setCheckoutNotice(true);
    setTimeout(() => {
      setCheckoutNotice(false);
    }, 4500);
  };

  // Toggle Heart Wishlist
  const handleToggleWishlist = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    let updated: string[];
    if (wishlist.includes(id)) {
      updated = wishlist.filter(item => item !== id);
    } else {
      updated = [...wishlist, id];
    }
    setWishlist(updated);
    localStorage.setItem("aura_heart_list", JSON.stringify(updated));
  };

  // When clicking dynamic ingredient tags, route directly to Glossary view and highlight
  const handleNavigateToGlossary = (ingredientName: string) => {
    setView("glossary");
    setGlossarySearch(ingredientName);
    setSelectedProduct(null); // closer detail modal
    // Smooth scroll page helper
    window.scrollTo({ top: 320, behavior: "smooth" });
  };

  // Filters logic
  const filteredProducts = PRODUCTS.filter(prod => {
    const matchCategory = activeCategory === "all" || prod.category === activeCategory;
    const matchSearch = prod.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        prod.subcategory.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        prod.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        prod.ingredientsList.some(ing => ing.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchCategory && matchSearch;
  });

  // Sorting logics
  const sortedProducts = [...filteredProducts].sort((a,b) => {
    if (sortOption === "price-asc") return a.price - b.price;
    if (sortOption === "price-desc") return b.price - a.price;
    if (sortOption === "rating") return b.rating - a.rating;
    return 0; // featured/default
  });

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div id="aura-app" className="min-h-screen bg-stone-50/30 text-stone-900 font-sans flex flex-col justify-between selection:bg-stone-900 selection:text-white">
      
      {/* Standard top header navigation */}
      <Navigation 
        currentView={currentView}
        setView={setView}
        cartCount={cartCount}
        onOpenCart={() => setIsCartOpen(true)}
        toggleChat={() => setIsChatOpen(!isChatOpen)}
        isChatOpen={isChatOpen}
      />

      {/* SECURE CHECKOUT COMPLETION BANNER POPUP */}
      {checkoutNotice && (
        <div id="checkout-banner-notice" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-4 animate-scale">
          <div className="rounded-2xl border border-emerald-150 bg-emerald-50 p-4.5 text-emerald-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-emerald-500 p-2 text-white">
                <ShieldCheck className="h-5 w-5" />
              </span>
              <div>
                <p className="font-serif text-sm font-semibold tracking-wide">Signature Order Confirmed</p>
                <p className="text-[11px] opacity-85 font-light">Your premium selection has been reserved and forwarded to our compounding boutique safely!</p>
              </div>
            </div>
            <button 
              onClick={() => setCheckoutNotice(false)} 
              className="text-xs font-mono font-bold hover:underline"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* CORE FRAMEWORK SWITCHS */}
      <main className="flex-1 pb-16">
        {currentView === "shop" && (
          <div id="boutique-showcase-view" className="space-y-12">
            
            {/* HERO INTERACTIVE SPOTLIGHT BLOCK */}
            <section id="luxury-spotlight-hero" className="relative h-[280px] sm:h-[420px] overflow-hidden bg-stone-900 flex items-center">
              {/* Luxury dark high contrast background art overlay */}
              <div className="absolute inset-0 z-0 opacity-40">
                <img 
                  src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1200&q=80" 
                  alt="Aura cosmetics formulas"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Decorative radial blur gradient light */}
              <div className="absolute inset-0 z-0 bg-radial-gradient from-amber-500/10 via-transparent to-stone-950/70" />

              <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-stone-100 flex flex-col items-start space-y-4 max-w-xl sm:max-w-2xl">
                <span className="text-[10px] font-mono tracking-[0.4em] uppercase text-amber-300">The Glow Synthesizer</span>
                <h2 className="font-serif text-3xl sm:text-5xl font-light tracking-wide leading-tight text-white">
                  Clinical Simplicity.<br />Pure Botanical Alchemy.
                </h2>
                <p className="max-w-md text-xs sm:text-sm font-light text-stone-300 tracking-wide leading-relaxed">
                  Cruelty-free medical-grade skincare formulation coupled with soft velvet-focus makeup finishes designed to protect and celebrate your unique cellular aura.
                </p>
                
                <div className="pt-2 flex items-center gap-3">
                  <button 
                    id="hero-quiz-cta"
                    onClick={() => setView("quiz")}
                    className="rounded-full bg-white text-stone-950 px-5 sm:px-6 py-2.5 sm:py-3 text-xs font-semibold tracking-widest uppercase hover:bg-stone-100 transition shadow flex items-center gap-2"
                  >
                    Diagnose Skin <Sparkles className="h-4 w-4 text-rose-500" />
                  </button>
                  <button 
                    id="hero-tryon-cta"
                    onClick={() => setView("tryon")}
                    className="rounded-full bg-stone-800/10 hover:bg-stone-800/30 border border-stone-100/50 text-white px-5 sm:px-6 py-2.5 sm:py-3 text-xs font-semibold tracking-widest uppercase transition backdrop-blur-xs flex items-center gap-1.5"
                  >
                    Virtual shades <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </section>

            {/* PRODUCT BAZE MATRIX COMPARTMENT */}
            <section id="boutique-inventory-section" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
              
              {/* Category Controls toolbar and searches */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-stone-100 pb-5 gap-4">
                
                {/* Horizontal Category pills tabs list */}
                <div id="product-category-pills" className="flex flex-wrap gap-2">
                  {[
                    { id: "all", label: "All Formulations" },
                    { id: "skincare", label: "Active Skincare" },
                    { id: "makeup", label: "Skin Velvet Makeup" },
                    { id: "fragrance", label: "Botanical Aromas" }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      id={`cat-tab-${tab.id}`}
                      onClick={() => setActiveCategory(tab.id)}
                      className={`rounded-full px-5 py-2.5 text-xs font-medium tracking-wide transition-all ${
                        activeCategory === tab.id
                          ? "bg-stone-950 text-white font-semibold shadow-sm"
                          : "bg-white border border-stone-200/60 text-stone-500 hover:border-stone-400 hover:text-stone-900"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Search bar and Dropdowns */}
                <div className="flex flex-wrap items-center gap-3">
                  {/* Search input field */}
                  <div className="relative flex-1 sm:w-64">
                    <Search className="absolute left-3.5 top-3 h-4 w-4 text-stone-400 stroke-[1.5]" />
                    <input
                      type="text"
                      id="catalog-search-field"
                      placeholder="Search formulas or ingredients..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full rounded-full border border-stone-200 bg-white pl-10 pr-4 py-2.5 text-xs text-stone-800 placeholder-stone-400 focus:border-stone-400 focus:outline-none"
                    />
                  </div>

                  {/* Ordering dropdown */}
                  <div className="relative">
                    <select
                      id="catalog-sort-select"
                      value={sortOption}
                      onChange={(e) => setSortOption(e.target.value)}
                      className="appearance-none rounded-full border border-stone-200 bg-white px-5 pr-9 py-2.5 text-xs font-medium text-stone-600 focus:border-stone-400 focus:outline-none cursor-pointer"
                    >
                      <option value="featured">Highly Featured</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                      <option value="rating">Top Rated Stars</option>
                    </select>
                    <SlidersHorizontal className="pointer-events-none absolute right-4 top-3 h-3.5 w-3.5 text-stone-400" />
                  </div>
                </div>

              </div>

              {/* Grid block of product listing cards */}
              {sortedProducts.length === 0 ? (
                <div id="no-products-found" className="flex flex-col items-center justify-center text-center py-16 space-y-3 bg-white border border-stone-100 rounded-3xl">
                  <BookOpen className="h-8 w-8 text-stone-300 stroke-[1.2]" />
                  <h3 className="font-serif text-base font-semibold text-stone-800">No formulations found</h3>
                  <p className="max-w-xs text-xs text-stone-400 leading-normal">
                    Try adjusting your filter parameters or search values to discover our other laboratory remedies.
                  </p>
                  <button
                    onClick={() => { setSearchTerm(""); setActiveCategory("all"); }}
                    className="mt-2 text-xs font-semibold text-stone-900 border-b-2 border-stone-900 pb-0.5"
                  >
                    Reset all filters
                  </button>
                </div>
              ) : (
                <div id="products-catalog-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {sortedProducts.map((prod) => {
                    const isFav = wishlist.includes(prod.id);
                    return (
                      <div
                        key={prod.id}
                        id={`product-card-${prod.id}`}
                        onClick={() => setSelectedProduct(prod)}
                        className="group relative cursor-pointer flex flex-col justify-between bg-white rounded-2xl border border-stone-100 p-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                      >
                        {/* Dynamic category badge */}
                        <div className="absolute top-6 left-6 z-10 flex flex-col gap-1">
                          {prod.isNew && (
                            <span className="rounded bg-rose-500 px-2 py-0.5 text-[9px] font-bold tracking-wider text-white uppercase font-mono shadow-xs">
                              New
                            </span>
                          )}
                          {prod.isBestSeller && (
                            <span className="rounded bg-stone-950 px-2 py-0.5 text-[9px] font-bold tracking-wider text-white uppercase font-mono shadow-xs">
                              Bestseller
                            </span>
                          )}
                        </div>

                        {/* Heart icon button */}
                        <button
                          id={`wish-toggle-${prod.id}`}
                          onClick={(e) => handleToggleWishlist(prod.id, e)}
                          className="absolute top-6 right-6 z-10 rounded-full bg-white/90 p-2 text-stone-400 hover:text-rose-500 transition shadow-sm hover:scale-105"
                          title="Save to profile vault"
                        >
                          <Heart className={`h-4 w-4 ${isFav ? 'fill-rose-500 text-rose-500' : 'stroke-[1.5]'}`} />
                        </button>

                        {/* Image canvas */}
                        <div className="overflow-hidden rounded-xl bg-stone-50 h-56 relative flex items-center justify-center">
                          <img 
                            src={prod.image} 
                            alt={prod.name}
                            referrerPolicy="no-referrer"
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>

                        {/* Titles copying */}
                        <div className="mt-4 flex-1 space-y-1.5 flex flex-col justify-end">
                          <div className="flex items-center gap-1 text-[9px] tracking-widest text-stone-400 font-mono uppercase font-semibold">
                            <span>{prod.brand}</span>
                            <span>•</span>
                            <span>{prod.subcategory}</span>
                          </div>

                          <h3 className="font-serif text-[15px] font-medium text-stone-900 group-hover:text-stone-950 leading-tight">
                            {prod.name}
                          </h3>

                          {/* Quick shades dots indicator inside makeup */}
                          {prod.shades && prod.shades.length > 0 && (
                            <div className="flex gap-1 items-center pb-1">
                              {prod.shades.slice(0, 4).map((sh) => (
                                <span 
                                  key={sh.name} 
                                  className="h-2.5 w-2.5 rounded-full border border-stone-200" 
                                  style={{ backgroundColor: sh.hex }}
                                  title={sh.name}
                                />
                              ))}
                              {prod.shades.length > 4 && (
                                <span className="text-[9px] text-stone-400 font-mono font-bold">+{prod.shades.length - 4}</span>
                              )}
                            </div>
                          )}

                          {/* Ratings stars display */}
                          <div className="flex items-center gap-1 pb-1">
                            <Star className="h-3 w-3 text-amber-500 fill-current" />
                            <span className="text-[11px] font-mono font-semibold text-stone-600">{prod.rating}</span>
                            <span className="text-[10px] text-stone-400 font-light">({prod.reviewsCount})</span>
                          </div>

                          {/* Bottom price and active CTAs */}
                          <div className="pt-2 border-t border-stone-50/50 flex items-center justify-between">
                            <span className="text-sm font-bold font-mono text-stone-900">${prod.price}</span>
                            <span className="text-[10px] font-semibold tracking-widest uppercase text-stone-400 font-mono group-hover:text-stone-950 transition flex items-center gap-1.5">
                              Apply Formula <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                            </span>
                          </div>

                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

            </section>

            {/* BRAND VALUE ASSETS BLOCK */}
            <section id="aura-trust-banner bg-white" className="border-t border-stone-100 bg-white py-12">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center sm:text-left">
                {[
                  { icon: Award, title: "Compounded Clinician Botanical", desc: "Formulated beneath tight medical certification using organic compounds." },
                  { icon: ShieldCheck, title: "100% Bio-Active Cruelty-Free", desc: "No microplastics, zero chemical parabens, absolute ethical vegan parameters." },
                  { icon: Sparkles, title: "AI-Coupled Diagnostic System", desc: "Bespoke beauty routine recommendations driven by secure neural calculations." }
                ].map((val, i) => {
                  const Icon = val.icon;
                  return (
                    <div key={i} className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-2">
                      <span className="rounded-full bg-stone-50 p-3.5 text-stone-800 border border-stone-100 shadow-xs">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div className="space-y-1">
                        <h4 className="font-serif text-sm font-semibold text-stone-900 tracking-wide">{val.title}</h4>
                        <p className="text-xs text-stone-400 font-light leading-relaxed">{val.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

          </div>
        )}

        {currentView === "tryon" && (
          <VirtualTryOn onAddToCart={handleAddToCart} />
        )}

        {currentView === "quiz" && (
          <CustomizerQuiz onProductSelect={(p) => setSelectedProduct(p)} />
        )}

        {currentView === "glossary" && (
          <div id="ingredients-glossary-view" className="mx-auto max-w-4xl px-4 py-8 space-y-8 animate-fade-in">
            {/* Header copy */}
            <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
              <span className="text-[10px] sm:text-xs font-mono font-medium tracking-widest text-stone-400 uppercase">Chemical Transparency Matrix</span>
              <h1 className="font-serif text-3xl sm:text-4xl font-light text-stone-900 tracking-wide">Ingredients Dictionary</h1>
              <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto leading-relaxed">
                Discover the active botanical compounds and medical-grade moisturizers inside our formulas. We believe in complete clinical transparency.
              </p>
            </div>

            {/* Glossary active search bar component */}
            <div className="max-w-md mx-auto relative mb-6">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-stone-400 stroke-[1.5]" />
              <input
                type="text"
                id="glossary-lookup-field"
                placeholder="Lookup active ingredients e.g., Centella, Ceramide..."
                value={glossarySearch}
                onChange={(e) => setGlossarySearch(e.target.value)}
                className="w-full rounded-full border border-stone-200 bg-white pl-10 pr-4 py-2.5 text-xs text-stone-800 focus:border-stone-400 focus:outline-none placeholder-stone-400"
              />
              {glossarySearch && (
                <button 
                  onClick={() => setGlossarySearch("")} 
                  className="absolute right-4 top-2 text-xs font-mono text-stone-400 hover:text-stone-950 font-bold"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Grid display of glossary items */}
            <div id="glossary-matrix-deck" className="space-y-6">
              {INGREDIENT_GLOSSARY.filter(item => 
                item.name.toLowerCase().includes(glossarySearch.toLowerCase()) ||
                item.benefit.toLowerCase().includes(glossarySearch.toLowerCase()) ||
                item.description.toLowerCase().includes(glossarySearch.toLowerCase())
              ).map((item) => (
                <div 
                  key={item.name}
                  id={`glossary-item-${item.name.replace(/\s+/g, '-').toLowerCase()}`}
                  className="rounded-2xl border border-stone-150 bg-white p-5 sm:p-6 shadow-xs space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-stone-100 pb-2.5 gap-2">
                    <div className="flex items-center gap-2.5">
                      <h3 className="font-serif text-base font-semibold text-stone-900">{item.name}</h3>
                      <span className="rounded bg-stone-50 border border-stone-150 px-2 py-0.5 text-[9px] font-mono tracking-wider uppercase text-stone-500">
                        {item.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-stone-400 font-mono text-[10px]">Safety Rating</span>
                      <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold font-mono tracking-wider uppercase ${
                        item.safetyRating === 'Excellent' 
                          ? 'bg-emerald-50 text-emerald-700' 
                          : 'bg-amber-50 text-amber-700'
                      }`}>
                        {item.safetyRating}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs font-semibold text-rose-500 font-mono uppercase tracking-wider">Benefit: {item.benefit}</p>
                  <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">{item.description}</p>
                  
                  {/* Filter products matching ingredient */}
                  <div className="pt-2 flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] text-stone-400 font-mono uppercase">Found inside:</span>
                    {PRODUCTS.filter(p => p.ingredientsList.includes(item.name)).map((matchedP) => (
                      <button
                        key={matchedP.id}
                        id={`glossary-linked-prod-${matchedP.id}`}
                        onClick={() => setSelectedProduct(matchedP)}
                        className="rounded bg-stone-50 border border-stone-100 px-2 py-1 text-[9px] font-semibold text-stone-600 hover:bg-stone-100 hover:text-stone-900 transition font-mono uppercase"
                      >
                        {matchedP.name}
                      </button>
                    ))}
                  </div>

                </div>
              ))}
            </div>

          </div>
        )}
      </main>

      {/* FOOTER BLOCK */}
      <footer id="aura-editorial-footer" className="bg-stone-950 text-stone-400 py-10 border-t border-stone-900 mt-12 text-xs tracking-wide">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="space-y-3">
            <span className="font-serif text-lg tracking-[0.25em] text-stone-100 font-extralight uppercase">
              A U R A
            </span>
            <p className="text-stone-500 font-light leading-relaxed max-w-xs text-[11px]">
              Compounding scientific dermal answers and dewy satin color palettes for the modern global complexion.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-[11px] font-mono tracking-widest text-stone-300 uppercase">Interactive Studios</h4>
            <ul className="space-y-1.5 text-stone-500">
              <li><button onClick={() => setView("tryon")} className="hover:text-stone-200 transition">Virtual Try-On</button></li>
              <li><button onClick={() => setView("quiz")} className="hover:text-stone-200 transition">AI Skincare Analyzer</button></li>
              <li><button onClick={() => setView("glossary")} className="hover:text-stone-200 transition">Ingredient glossary</button></li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="text-[11px] font-mono tracking-widest text-stone-300 uppercase">Customer Concierge</h4>
            <ul className="space-y-1.5 text-stone-500">
              <li><a href="#" className="hover:text-stone-200 transition">Shipping & Delivery Logistics</a></li>
              <li><a href="#" className="hover:text-stone-200 transition">Signature Refund Returns</a></li>
              <li><a href="#" className="hover:text-stone-200 transition">Lab Formulatory Contact</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-[11px] font-mono tracking-widest text-stone-300 uppercase">Newsletter list</h4>
            <p className="text-stone-500 text-[11px] font-light leading-normal">Subscribe to unlock early access to our luxury limited collections and raw ingredient releases.</p>
            <div className="flex rounded-full border border-stone-850 overflow-hidden bg-stone-900">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="bg-transparent text-stone-100 px-3 py-1.5 flex-1 focus:outline-none text-[10px]"
              />
              <button className="bg-stone-100 text-stone-950 px-3.5 text-[10px] font-bold tracking-wider uppercase font-mono hover:bg-stone-200 transition">Join</button>
            </div>
          </div>

        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 border-t border-stone-900 mt-8 pt-6 flex flex-col sm:flex-row justify-between text-[11px] text-stone-600 gap-3">
          <p>© 2026 AURA Beauty Group LLC. Certified Cruelty-Free & Carbon-Neutral.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-stone-400 transition">Terms of Service</a>
            <a href="#" className="hover:text-stone-400 transition">Privacy Statement</a>
          </div>
        </div>
      </footer>

      {/* RENDER MODAL OVERLAYS */}
      {selectedProduct && (
        <ProductDetailsModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
          onNavigateToGlossary={handleNavigateToGlossary}
        />
      )}

      {/* Cartwright slideout drawer */}
      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckoutSuccess={handleCheckoutSuccess}
      />

      {/* Floating conversational bot overlay */}
      <BeautyChat 
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />

    </div>
  );
}
