/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Sparkles, Sliders, CheckCircle2, RotateCcw, ShoppingBag } from "lucide-react";
import { PRODUCTS } from "../data";
import { Product, ProductShade } from "../types";

export default function VirtualTryOn({ 
  onAddToCart 
}: { 
  onAddToCart: (p: Product, qty: number, shade?: ProductShade) => void 
}) {
  // We've got 3 main triable products in our DB with shades: Lip Velvet (mu-1), Foundation (mu-2), Blush (mu-3)
  const lipProduct = PRODUCTS.find(p => p.id === "mu-1")!;
  const foundationProduct = PRODUCTS.find(p => p.id === "mu-2")!;
  const blushProduct = PRODUCTS.find(p => p.id === "mu-3")!;

  // Try-on variables
  const [selectedLipShade, setSelectedLipShade] = React.useState<ProductShade | null>(lipProduct.shades![0]);
  const [selectedBlushShade, setSelectedBlushShade] = React.useState<ProductShade | null>(null);
  const [selectedFoundationShade, setSelectedFoundationShade] = React.useState<ProductShade | null>(null);

  // Intensity multipliers (Opacities)
  const [lipIntensity, setLipIntensity] = React.useState(0.85); // 0.1 to 1.0
  const [blushIntensity, setBlushIntensity] = React.useState(0.40); // 0.1 to 1.0
  const [foundationIntensity, setFoundationIntensity] = React.useState(0.20); // 0.1 to 1.0

  // Finish type selector
  const [activeFinish, setActiveFinish] = React.useState<"Matte" | "Satin" | "Dewy">("Satin");

  // Show status
  const [addedItemName, setAddedItemName] = React.useState<string | null>(null);

  const handleClearPlayground = () => {
    setSelectedLipShade(lipProduct.shades![0]);
    setSelectedBlushShade(null);
    setSelectedFoundationShade(null);
    setLipIntensity(0.85);
    setBlushIntensity(0.40);
    setFoundationIntensity(0.20);
    setActiveFinish("Satin");
  };

  const handleQuickAdd = (prod: Product, shade: ProductShade | null) => {
    if (!shade) return;
    onAddToCart(prod, 1, shade);
    setAddedItemName(`${prod.name} (${shade.name})`);
    setTimeout(() => {
      setAddedItemName(null);
    }, 2500);
  };

  return (
    <div id="virtual-tryon-space" className="mx-auto max-w-5xl px-4 py-8">
      {/* Page header banner */}
      <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
        <span className="text-[10px] sm:text-xs font-mono font-medium tracking-widest text-stone-900 uppercase flex items-center justify-center gap-1.5 bg-stone-50 px-3 py-1 rounded-full w-fit mx-auto">
          <Sparkles className="h-4 w-4 text-amber-500 animate-spin" /> Virtual Labs
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-light text-stone-900 tracking-wide">
          AURA Interactive Try-On Studio
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto leading-relaxed">
          Experiment with lip velvet textures, watercolor cheek flushes, and silk complexion foundations instantly on our living vector sketch portrait.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: THE INTERACTIVE ILLUSTRATED CANVAS */}
        <div className="lg:col-span-5 bg-stone-50 rounded-3xl p-6 border border-stone-100 flex flex-col items-center justify-center relative min-h-[440px] shadow-xs">
          
          {/* Dynamic Finish filter overlay representation */}
          <div className="absolute top-4 left-4 text-[10px] font-mono tracking-widest uppercase bg-white/90 border border-stone-150 px-3 py-1 rounded shadow-sm text-stone-500 flex items-center gap-1.5">
            <span className={`h-2 w-2 rounded-full ${activeFinish === 'Dewy' ? 'bg-indigo-300 animate-ping' : activeFinish === 'Matte' ? 'bg-stone-800' : 'bg-rose-400'}`} />
            Finish: {activeFinish}
          </div>

          <button
            onClick={handleClearPlayground}
            className="absolute top-4 right-4 rounded-full bg-white border border-stone-200 p-2 text-stone-500 hover:text-stone-800 shadow-sm transition"
            title="Reset Portrait"
          >
            <RotateCcw className="h-4.5 w-4.5" />
          </button>

          {/* BEAUTIFUL WOMAN PORTRAIT VECTOR CANVAS */}
          <div className="relative w-72 h-80 flex items-center justify-center">
            
            {/* STYLIZED SVG FACE SKETCH */}
            <svg 
              viewBox="0 0 300 300" 
              className="w-full h-full drop-shadow-md select-none transition-all duration-300"
            >
              <defs>
                {/* Radial Glow Gradient for Dewy finish */}
                <radialGradient id="glow-grad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* 1. Underlying Base Skin Color (Foundation) if matched */}
              <circle 
                cx="150" 
                cy="140" 
                r="70" 
                fill={selectedFoundationShade ? selectedFoundationShade.hex : "#FCF4EB"} 
                opacity={selectedFoundationShade ? foundationIntensity : 1.0}
                className="transition-all duration-500"
              />

              {/* Subtle face details contour shadows */}
              <path 
                d="M130 90 Q150 110 170 90 M145 155 Q150 162 155 155" 
                stroke="#EAD9C9" 
                strokeWidth="1.5" 
                fill="none" 
              />

              {/* 2. Cheek Blush circles (Left & Right apples) if matched */}
              {selectedBlushShade && (
                <>
                  {/* Left Cheek */}
                  <ellipse 
                    cx="110" 
                    cy="145" 
                    rx="18" 
                    ry="12" 
                    fill={selectedBlushShade.hex} 
                    opacity={blushIntensity}
                    filter="blur"
                    className="transition-all duration-500"
                  />
                  {/* Right Cheek */}
                  <ellipse 
                    cx="190" 
                    cy="145" 
                    rx="18" 
                    ry="12" 
                    fill={selectedBlushShade.hex} 
                    opacity={blushIntensity}
                    filter="blur"
                    className="transition-all duration-500"
                  />
                </>
              )}

              {/* Dynamic Luster/Dewy shine effects on cheeks if Dewy selected */}
              {activeFinish === "Dewy" && (
                <>
                  <ellipse cx="112" cy="142" rx="6" ry="3" fill="url(#glow-grad)" opacity="0.8" />
                  <ellipse cx="188" cy="142" rx="6" ry="3" fill="url(#glow-grad)" opacity="0.8" />
                </>
              )}

              {/* Elegant Hair flowing locks */}
              <path 
                d="M80 140 Q60 50 150 40 Q240 50 220 140 Q205 60 150 65 Q95 60 80 140 Z M220 140 Q230 180 230 220 Q210 200 205 170 M80 140 Q70 180 70 220 Q90 200 95 170" 
                fill="#3A2C22" 
                opacity="0.9"
              />

              {/* Delicate Closed Eyelashes and Eyebrows */}
              {/* Eyebrows */}
              <path d="M105 105 Q120 98 135 106" stroke="#2B1D15" strokeWidth="2.0" fill="none" strokeLinecap="round" />
              <path d="M165 106 Q180 98 195 105" stroke="#2B1D15" strokeWidth="2.0" fill="none" strokeLinecap="round" />
              {/* Closed Eyes / Lashes */}
              <path d="M110 118 Q122 125 133 118" stroke="#100b09" strokeWidth="2.2" strokeLinecap="round" fill="none" />
              <path d="M167 118 Q178 125 190 118" stroke="#100b09" strokeWidth="2.2" strokeLinecap="round" fill="none" />
              {/* Eyelashes flickers */}
              <path d="M130 119 L134 122 M122 121 L124 125 M113 119 L112 123" stroke="#100b09" strokeWidth="1.2" />
              <path d="M170 119 L168 123 M177 121 L176 125 M186 119 L189 122" stroke="#100b09" strokeWidth="1.2" />

              {/* Elegant Nose outline */}
              <path d="M147 132 L150 155 Q148 158 152 158" stroke="#BCA38A" strokeWidth="1.5" strokeLinecap="round" fill="none" />

              {/* 3. Voluptuous Lips Shape */}
              <g className="transition-all duration-300">
                {/* Upper Lip */}
                <path 
                  d="M125 176 Q138 168 150 174 Q162 168 175 176 Q150 180 125 176 Z" 
                  fill={selectedLipShade ? selectedLipShade.hex : "#DBA195"} 
                  opacity={selectedLipShade ? lipIntensity : 0.4}
                  className="transition-all duration-500"
                />
                {/* Lower Lip */}
                <path 
                  d="M125 175 Q150 192 175 175 Q150 182 125 175 Z" 
                  fill={selectedLipShade ? selectedLipShade.hex : "#DBA195"} 
                  opacity={selectedLipShade ? lipIntensity : 0.4}
                  className="transition-all duration-500"
                />
              </g>

              {/* Lip Gloss Highlight details for Satin or Dewy finish */}
              {selectedLipShade && activeFinish !== "Matte" && (
                <path 
                  d="M140 181 Q150 185 160 181" 
                  stroke="#FFFFFF" 
                  strokeWidth="1.2" 
                  strokeLinecap="round" 
                  fill="none" 
                  opacity="0.8" 
                />
              )}
            </svg>

          </div>

          {/* Prompt banner detailing the look */}
          <div className="w-full mt-4 text-center bg-white rounded-2xl p-4.5 border border-stone-150">
            <h4 className="text-xs font-semibold text-stone-800">Composition Formula</h4>
            <div className="mt-1.5 flex flex-wrap justify-center gap-x-2 gap-y-1 text-[10px] text-stone-500 font-mono">
              <span>Lips: <strong className="text-stone-700">{selectedLipShade ? selectedLipShade.name : "Bare"}</strong></span>
              <span>•</span>
              <span>Blush: <strong className="text-stone-700">{selectedBlushShade ? selectedBlushShade.name : "None"}</strong></span>
              <span>•</span>
              <span>Skin Base: <strong className="text-stone-700">{selectedFoundationShade ? selectedFoundationShade.name : "Bio Neutral"}</strong></span>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: INTERACTIVE CONTROLS PORTAL */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* CONTROL SECTION 1: LIP VELVET SHADES */}
          <div className="bg-white rounded-2xl border border-stone-100 p-5 shadow-xs space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-rose-500" />
                <h3 className="font-serif text-sm font-semibold text-stone-900">{lipProduct.name}</h3>
              </div>
              <span className="text-[10px] font-mono font-bold text-stone-400 uppercase">Step 1: Accent</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {lipProduct.shades!.map((shade) => {
                const isActive = selectedLipShade?.name === shade.name;
                return (
                  <button
                    key={shade.name}
                    id={`tryon-lip-${shade.name.replace(/\s+/g, '-').toLowerCase()}`}
                    onClick={() => setSelectedLipShade(shade)}
                    className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition duration-200 hover:scale-[1.02] ${
                      isActive 
                        ? "border-stone-950 bg-stone-950 text-white font-semibold" 
                        : "border-stone-155 bg-stone-50/50 text-stone-600"
                    }`}
                  >
                    <span className="h-3 w-3 rounded-full border border-stone-200" style={{ backgroundColor: shade.hex }} />
                    {shade.name}
                  </button>
                );
              })}
            </div>

            {/* Slider Intensity Control */}
            {selectedLipShade && (
              <div className="flex items-center gap-4 pt-1 text-xs">
                <span className="text-stone-400 font-mono flex items-center gap-1 w-16 uppercase text-[9px]"><Sliders className="h-3 w-3" /> Intensity</span>
                <input
                  type="range"
                  min="0.2"
                  max="1.0"
                  step="0.05"
                  value={lipIntensity}
                  onChange={(e) => setLipIntensity(parseFloat(e.target.value))}
                  className="flex-1 accent-stone-900 bg-stone-100 h-1 rounded-lg"
                />
                <span className="w-8 text-right font-mono text-stone-500">{Math.round(lipIntensity * 100)}%</span>
                <button
                  id="add-lip-tryon-to-bag"
                  onClick={() => handleQuickAdd(lipProduct, selectedLipShade)}
                  className="rounded-full bg-stone-950 text-white p-2 hover:bg-stone-850 flex items-center justify-center transition"
                  title="Add shade to Bag"
                >
                  <ShoppingBag className="h-4.5 w-4.5" />
                </button>
              </div>
            )}
          </div>

          {/* CONTROL SECTION 2: BLUSH GLOW SHADES */}
          <div className="bg-white rounded-2xl border border-stone-100 p-5 shadow-xs space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-pink-400" />
                <h3 className="font-serif text-sm font-semibold text-stone-900">{blushProduct.name}</h3>
              </div>
              <span className="text-[10px] font-mono font-bold text-stone-400 uppercase">Step 2: Flush</span>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                id="tryon-blush-none"
                onClick={() => setSelectedBlushShade(null)}
                className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition duration-200 ${
                  selectedBlushShade === null 
                    ? "border-stone-950 bg-stone-950 text-white font-semibold" 
                    : "border-stone-155 bg-stone-50/50 text-stone-600"
                }`}
              >
                No Blush (Bare cheeks)
              </button>

              {blushProduct.shades!.map((shade) => {
                const isActive = selectedBlushShade?.name === shade.name;
                return (
                  <button
                    key={shade.name}
                    id={`tryon-blush-${shade.name.replace(/\s+/g, '-').toLowerCase()}`}
                    onClick={() => setSelectedBlushShade(shade)}
                    className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition duration-200 hover:scale-[1.02] ${
                      isActive 
                        ? "border-stone-950 bg-stone-950 text-white font-semibold" 
                        : "border-stone-155 bg-stone-50/50 text-stone-600"
                    }`}
                  >
                    <span className="h-3 w-3 rounded-full border border-stone-200" style={{ backgroundColor: shade.hex }} />
                    {shade.name}
                  </button>
                );
              })}
            </div>

            {/* Slider Intensity Control */}
            {selectedBlushShade && (
              <div className="flex items-center gap-4 pt-1 text-xs">
                <span className="text-stone-400 font-mono flex items-center gap-1 w-16 uppercase text-[9px]"><Sliders className="h-3 w-3" /> Dilute</span>
                <input
                  type="range"
                  min="0.1"
                  max="0.8"
                  step="0.05"
                  value={blushIntensity}
                  onChange={(e) => setBlushIntensity(parseFloat(e.target.value))}
                  className="flex-1 accent-stone-900 bg-stone-100 h-1 rounded-lg"
                />
                <span className="w-8 text-right font-mono text-stone-500">{Math.round(blushIntensity * 100)}%</span>
                <button
                  id="add-blush-tryon-to-bag"
                  onClick={() => handleQuickAdd(blushProduct, selectedBlushShade)}
                  className="rounded-full bg-stone-950 text-white p-2 hover:bg-stone-850 flex items-center justify-center transition"
                  title="Add shade to Bag"
                >
                  <ShoppingBag className="h-4.5 w-4.5" />
                </button>
              </div>
            )}
          </div>

          {/* CONTROL SECTION 3: LIQUID FOUNDATION COMPLEXION MATCH */}
          <div className="bg-white rounded-2xl border border-stone-100 p-5 shadow-xs space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-amber-200" />
                <h3 className="font-serif text-sm font-semibold text-stone-900">{foundationProduct.name}</h3>
              </div>
              <span className="text-[10px] font-mono font-bold text-stone-400 uppercase">Step 3: Base Tones</span>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                id="tryon-foundation-none"
                onClick={() => setSelectedFoundationShade(null)}
                className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition duration-200 ${
                  selectedFoundationShade === null 
                    ? "border-stone-950 bg-stone-950 text-white font-semibold" 
                    : "border-stone-155 bg-stone-50/50 text-stone-600"
                }`}
              >
                Bio Skin (Default)
              </button>

              {foundationProduct.shades!.map((shade) => {
                const isActive = selectedFoundationShade?.name === shade.name;
                return (
                  <button
                    key={shade.name}
                    id={`tryon-foundation-${shade.name.replace(/\s+/g, '-').toLowerCase()}`}
                    onClick={() => setSelectedFoundationShade(shade)}
                    className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition duration-200 hover:scale-[1.02] ${
                      isActive 
                        ? "border-stone-950 bg-stone-950 text-white font-semibold" 
                        : "border-stone-155 bg-stone-50/50 text-stone-600"
                    }`}
                  >
                    <span className="h-3 w-3 rounded-full border border-stone-200" style={{ backgroundColor: shade.hex }} />
                    {shade.name}
                  </button>
                );
              })}
            </div>

            {/* Slider Intensity Control */}
            {selectedFoundationShade && (
              <div className="flex items-center gap-4 pt-1 text-xs">
                <span className="text-stone-400 font-mono flex items-center gap-1 w-16 uppercase text-[9px]"><Sliders className="h-3 w-3" /> Thickness</span>
                <input
                  type="range"
                  min="0.1"
                  max="0.5"
                  step="0.03"
                  value={foundationIntensity}
                  onChange={(e) => setFoundationIntensity(parseFloat(e.target.value))}
                  className="flex-1 accent-stone-900 bg-stone-100 h-1 rounded-lg"
                />
                <span className="w-8 text-right font-mono text-stone-500">{Math.round(foundationIntensity * 100)}%</span>
                <button
                  id="add-foundation-tryon-to-bag"
                  onClick={() => handleQuickAdd(foundationProduct, selectedFoundationShade)}
                  className="rounded-full bg-stone-950 text-white p-2 hover:bg-stone-850 flex items-center justify-center transition"
                  title="Add shade to Bag"
                >
                  <ShoppingBag className="h-4.5 w-4.5" />
                </button>
              </div>
            )}
          </div>

          {/* CONTROL SECTION 4: SELECT LUSTER FINISH */}
          <div className="bg-white rounded-2xl border border-stone-100 p-5 shadow-xs space-y-4">
            <h3 className="font-serif text-sm font-semibold text-stone-900">Texture Finishes</h3>
            <div className="grid grid-cols-3 gap-3">
              {(["Matte", "Satin", "Dewy"] as const).map((finish) => (
                <button
                  key={finish}
                  id={`finish-select-${finish.toLowerCase()}`}
                  onClick={() => setActiveFinish(finish)}
                  className={`rounded-xl border py-4 text-xs font-semibold tracking-wider uppercase transition ${
                    activeFinish === finish
                      ? "border-stone-950 bg-stone-50 text-stone-950 font-bold"
                      : "border-stone-150 bg-white text-stone-400 hover:text-stone-700"
                  }`}
                >
                  {finish}
                </button>
              ))}
            </div>
          </div>

          {/* Quick confirmation notification feedback */}
          {addedItemName && (
            <div id="tryon-success-notif" className="bg-stone-900 text-stone-100 text-xs px-4 py-3 rounded-xl shadow border border-stone-800 flex items-center gap-2 animate-scale">
              <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400 stroke-[2]" />
              <span>Added <strong>{addedItemName}</strong> to Bag successfully!</span>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
