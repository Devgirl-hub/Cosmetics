/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { X, Star, Check, Sparkles, AlertCircle, ShoppingBag } from "lucide-react";
import { Product, ProductShade } from "../types";

interface ProductDetailsModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, selectedShade?: ProductShade) => void;
  onNavigateToGlossary: (ingredientName: string) => void;
}

export default function ProductDetailsModal({
  product,
  onClose,
  onAddToCart,
  onNavigateToGlossary
}: ProductDetailsModalProps) {
  const [selectedShade, setSelectedShade] = React.useState<ProductShade | undefined>(
    product.shades && product.shades.length > 0 ? product.shades[0] : undefined
  );
  const [quantity, setQuantity] = React.useState(1);
  const [addedMessage, setAddedMessage] = React.useState(false);

  // Sync selected shade in case product changes
  React.useEffect(() => {
    if (product.shades && product.shades.length > 0) {
      setSelectedShade(product.shades[0]);
    } else {
      setSelectedShade(undefined);
    }
    setQuantity(1);
    setAddedMessage(false);
  }, [product]);

  const handleAddToCartSubmit = () => {
    onAddToCart(product, quantity, selectedShade);
    setAddedMessage(true);
    setTimeout(() => {
      setAddedMessage(false);
    }, 2000);
  };

  return (
    <div id="product-detail-overlay" className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/45 p-4 backdrop-blur-xs animate-fade-in">
      {/* Click outside closer */}
      <div className="absolute inset-0" onClick={onClose} />

      <div 
        id="product-detail-modal-container"
        className="relative flex h-full max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl animate-scale md:flex-row border border-stone-100"
      >
        {/* Close Button top-right absolute */}
        <button
          id="close-detail-modal"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-white/90 p-2 text-stone-500 shadow-md hover:bg-stone-150 hover:text-stone-900 transition"
        >
          <X className="h-4.5 w-4.5" />
        </button>

        {/* Column 1: Image panel */}
        <div className="relative w-full md:w-1/2 bg-stone-50 flex items-center justify-center">
          <img 
            src={product.image} 
            alt={product.name}
            referrerPolicy="no-referrer"
            className="h-64 w-full object-cover object-center md:h-full transition-transform duration-700 hover:scale-[1.03]"
          />
          {product.isBestSeller && (
            <span className="absolute left-4 top-4 rounded bg-stone-900 px-2.5 py-1 text-[10px] font-semibold tracking-wider text-white uppercase font-mono shadow">
              Cult Best Seller
            </span>
          )}
          {product.isNew && (
            <span className="absolute left-4 top-4 rounded bg-rose-500 px-2.5 py-1 text-[10px] font-semibold tracking-wider text-white uppercase font-mono shadow">
              New Release
            </span>
          )}

          {/* Color Matcher Indicator Overlay if shade chosen */}
          {selectedShade && (
            <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2 rounded-lg bg-white/90 p-3 shadow-sm backdrop-blur-xs">
              <span 
                className="h-5 w-5 rounded-full border border-stone-200"
                style={{ backgroundColor: selectedShade.hex }} 
              />
              <div className="min-w-0">
                <p className="text-[10px] text-stone-400 font-mono tracking-wider uppercase leading-none">Active Shade Try-On</p>
                <p className="text-xs font-semibold text-stone-800 truncate">{selectedShade.name}</p>
              </div>
            </div>
          )}
        </div>

        {/* Column 2: Rich Copy description */}
        <div id="modal-details-scrollable" className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          
          {/* Header titles */}
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-widest text-stone-400 uppercase">{product.category}</span>
              <span className="text-stone-300">•</span>
              <span className="text-[10px] font-mono tracking-widest text-stone-400 uppercase">{product.subcategory}</span>
            </div>
            
            <h2 className="font-serif text-2xl font-light text-stone-950 tracking-wide mt-1 leading-tight">
              {product.name}
            </h2>

            {/* Price on desktop */}
            <div className="mt-2.5 flex items-baseline gap-4">
              <span className="text-xl font-bold font-mono text-stone-900">${product.price}</span>
              <div className="flex items-center gap-1 text-amber-500">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-3.5 w-3.5 ${i < Math.floor(product.rating) ? 'fill-current' : 'opacity-30'}`} 
                    />
                  ))}
                </div>
                <span className="text-xs text-stone-500 font-semibold font-mono">{product.rating} ({product.reviewsCount} reviews)</span>
              </div>
            </div>
          </div>

          <div id="product-modal-narrative" className="space-y-4 text-xs tracking-wide leading-relaxed text-stone-600">
            <p className="font-medium text-stone-800">{product.description}</p>
            <p>{product.longDescription}</p>
          </div>

          {/* Sizing Shade Selectors if makeup & customizable */}
          {product.shades && product.shades.length > 0 && selectedShade && (
            <div className="border-t border-b border-stone-100 py-4.5 space-y-3">
              <div className="flex justify-between items-baseline">
                <span className="text-[11px] font-mono font-medium tracking-wide text-stone-400 uppercase">
                  Select Shade Finish
                </span>
                <span className="text-xs font-semibold text-stone-700 font-mono">
                  {selectedShade.name}
                </span>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {product.shades.map((shade) => {
                  const isChosen = selectedShade.name === shade.name;
                  return (
                    <button
                      key={shade.name}
                      id={`shade-button-${shade.name.replace(/\s+/g, '-').toLowerCase()}`}
                      onClick={() => setSelectedShade(shade)}
                      className={`relative h-9 w-9 rounded-full border shadow-xs transition-transform ${
                        isChosen 
                          ? "border-stone-900 scale-105 ring-2 ring-stone-950/25" 
                          : "border-stone-200 hover:scale-105"
                      }`}
                      style={{ backgroundColor: shade.hex }}
                      title={shade.name}
                    >
                      {isChosen && (
                        <Check className="absolute inset-0 m-auto h-4.5 w-4.5 stroke-[2.5] text-white mix-blend-difference" />
                      )}
                    </button>
                  );
                })}
              </div>
              <p className="text-[11px] font-light text-stone-500 italic mt-1 leading-normal">
                {selectedShade.description}
              </p>
            </div>
          )}

          {/* Active dynamic ingredients lookup matrix */}
          <div className="space-y-2.5">
            <h4 className="text-[11px] font-mono font-medium tracking-wide text-stone-400 uppercase">
              High-Perfomance Botanicals & Actives
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {product.ingredientsList.map((ing) => (
                <button
                  key={ing}
                  id={`ingredient-tag-${ing.replace(/\s+/g, '-').toLowerCase()}`}
                  onClick={() => onNavigateToGlossary(ing)}
                  className="rounded-full bg-stone-50 border border-stone-100 px-3 py-1.5 text-[10px] font-semibold text-stone-600 hover:bg-stone-100 hover:border-stone-200 transition-all flex items-center gap-1 font-mono uppercase"
                  title="Click to view benefit profile"
                >
                  <Sparkles className="h-3 w-3 text-rose-400" />
                  {ing}
                </button>
              ))}
            </div>
          </div>

          {/* Benefit checklists */}
          <div className="rounded-xl bg-stone-50 p-4 space-y-2">
            <h4 className="text-[11px] font-mono font-medium tracking-wide text-stone-500 uppercase flex items-center gap-1.5">
              <Check className="h-4 w-4 text-emerald-500" /> Formulation Benefits
            </h4>
            <ul className="text-xs space-y-1.5 text-stone-600 pl-1">
              {product.benefits.map((benefit, i) => (
                <li key={i} className="flex gap-2 items-start leading-tight">
                  <span className="text-stone-400 font-mono">•</span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Directions for Use */}
          <div className="space-y-1.5 text-xs text-stone-600">
            <h4 className="text-[11px] font-mono font-medium tracking-wide text-stone-400 uppercase">
              How To Apply
            </h4>
            <p className="leading-relaxed bg-amber-50/20 border border-amber-100/30 p-3 rounded-lg text-[11px]">
              {product.howToUse}
            </p>
          </div>

          {/* Add-to-bag buy row */}
          <div className="pt-4 flex items-center gap-4">
            <div className="flex items-center rounded-full border border-stone-200">
              <button
                id="qty-minus-detail"
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="px-3 py-2 text-stone-400 hover:text-stone-700"
              >
                -
              </button>
              <span className="w-8 text-center text-xs font-semibold font-mono text-stone-900">
                {quantity}
              </span>
              <button
                id="qty-plus-detail"
                onClick={() => setQuantity(q => q + 1)}
                className="px-3 py-2 text-stone-400 hover:text-stone-700"
              >
                +
              </button>
            </div>

            <button
              id="add-to-bag-modal-submit"
              onClick={handleAddToCartSubmit}
              className="flex-1 rounded-full bg-stone-950 py-3 text-xs font-semibold tracking-widest text-white uppercase shadow hover:bg-stone-850 active:scale-98 transition flex justify-center items-center gap-2"
            >
              <ShoppingBag className="h-4 w-4" /> Add To Signature Bag
            </button>
          </div>

          {addedMessage && (
            <div id="added-alert" className="bg-emerald-50 text-emerald-700 text-xs px-4 py-2.5 rounded-lg border border-emerald-100 flex items-center gap-2 animate-scale">
              <Check className="h-4.5 w-4.5 stroke-[2.5]" />
              <strong>Success:</strong> Product added. Ready on your top bag drawer!
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
