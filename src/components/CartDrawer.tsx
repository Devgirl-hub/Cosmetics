/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { X, Plus, Minus, Trash2, ShieldCheck, ShoppingBag, Landmark } from "lucide-react";
import { CartItem } from "../types";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number, shadeName?: string) => void;
  onRemoveItem: (productId: string, shadeName?: string) => void;
  onCheckoutSuccess: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onCheckoutSuccess
}: CartDrawerProps) {
  const [isCheckingOut, setIsCheckingOut] = React.useState(false);
  const [checkoutStep, setCheckoutStep] = React.useState<"idle" | "shipping" | "confirming" | "complete">("idle");
  const [shippingForm, setShippingForm] = React.useState({
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
    cardNumber: "•••• •••• •••• 4242"
  });

  if (!isOpen) return null;

  const totalItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const shippingCharge = subtotal > 75 || subtotal === 0 ? 0 : 5.99;
  const estimatedTax = subtotal * 0.08;
  const totalAmount = subtotal + shippingCharge + estimatedTax;

  const handleCheckoutClick = () => {
    setCheckoutStep("shipping");
    setIsCheckingOut(true);
  };

  const handleBackToCart = () => {
    setCheckoutStep("idle");
    setIsCheckingOut(false);
  };

  const handlePlaceOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (checkoutStep === "shipping") {
      setCheckoutStep("confirming");
      setTimeout(() => {
        setCheckoutStep("complete");
        setTimeout(() => {
          // Fire complete state
          onCheckoutSuccess();
          setIsCheckingOut(false);
          setCheckoutStep("idle");
          onClose();
        }, 2200);
      }, 1500);
    }
  };

  return (
    <div id="cart-drawer-overlay" className="fixed inset-0 z-50 flex justify-end bg-stone-900/40 backdrop-blur-xs transition-opacity animate-fade-in">
      {/* Background closer click overlay */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Slideout Content Body */}
      <div 
        id="cart-drawer-container"
        className="relative flex h-full w-full max-w-md flex-col bg-white shadow-2xl animate-slide-left border-l border-stone-100"
      >
        {/* Drawer Header */}
        <div id="cart-drawer-hdr" className="flex items-center justify-between border-b border-stone-100 px-6 py-5">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-stone-800 stroke-[1.5]" />
            <span className="font-serif text-lg font-medium text-stone-900 tracking-wide">
              {isCheckingOut ? "Boutique Checkout" : "Your Signature Bag"}
            </span>
            <span className="text-xs text-stone-400 font-mono">({totalItemCount})</span>
          </div>
          <button 
            id="close-cart-drawer"
            onClick={onClose}
            className="rounded-full p-1.5 text-stone-400 hover:bg-stone-50 hover:text-stone-700 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {checkoutStep === "idle" ? (
          <>
            {/* Products scrolling list */}
            <div id="cart-items-list" className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {cartItems.length === 0 ? (
                <div id="empty-cart-view" className="flex h-64 flex-col items-center justify-center text-center space-y-3">
                  <div className="rounded-full bg-stone-50 p-4">
                    <ShoppingBag className="h-8 w-8 text-stone-300 stroke-[1.2]" />
                  </div>
                  <h3 className="font-serif text-base font-medium text-stone-800">Your bag is empty</h3>
                  <p className="max-w-xs text-xs text-stone-400">
                    Explore our exquisite collections of cosmetics and organic skincare formulation to fill your vault.
                  </p>
                  <button 
                    onClick={onClose}
                    className="mt-2 rounded-full bg-stone-950 px-5 py-2 text-xs font-semibold text-white transition hover:bg-stone-800 tracking-wide"
                  >
                    Continue Exploring
                  </button>
                </div>
              ) : (
                cartItems.map((item, idx) => (
                  <div 
                    key={`cart-item-${item.product.id}-${item.selectedShade?.name || "none"}`}
                    id={`cart-item-${idx}`}
                    className="flex gap-4 border-b border-stone-50 pb-4 last:border-0"
                  >
                    {/* Thumbnail Image */}
                    <img 
                      src={item.product.image}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      className="h-20 w-16 rounded object-cover object-center bg-stone-100"
                    />

                    {/* Meta and Details */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] tracking-wider text-stone-400 uppercase font-mono">{item.product.subcategory}</p>
                      <h4 className="font-serif text-sm font-medium text-stone-900 truncate leading-tight mt-0.5">
                        {item.product.name}
                      </h4>
                      
                      {/* Shade Selection Detail Tag */}
                      {item.selectedShade && (
                        <div className="mt-1 flex items-center gap-1.5">
                          <span 
                            className="h-3 w-3 rounded-full border border-stone-300 shadow-xs" 
                            style={{ backgroundColor: item.selectedShade.hex }}
                          />
                          <span className="text-[11px] text-stone-500 font-medium tracking-wide">
                            {item.selectedShade.name}
                          </span>
                        </div>
                      )}

                      {/* Quantum Multipliers */}
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center rounded-full border border-stone-200 py-0.5 px-1.5 bg-stone-50/50">
                          <button
                            id={`qty-minus-${item.product.id}`}
                            onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1, item.selectedShade?.name)}
                            disabled={item.quantity <= 1}
                            className="p-1 text-stone-400 hover:text-stone-700 disabled:opacity-30 disabled:hover:text-stone-400"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-6 text-center text-xs font-semibold font-mono text-stone-900">
                            {item.quantity}
                          </span>
                          <button
                            id={`qty-plus-${item.product.id}`}
                            onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1, item.selectedShade?.name)}
                            className="p-1 text-stone-400 hover:text-stone-700"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold font-mono text-stone-900">
                            ${item.product.price * item.quantity}
                          </span>
                          <button
                            id={`cart-remove-${item.product.id}`}
                            onClick={() => onRemoveItem(item.product.id, item.selectedShade?.name)}
                            className="text-stone-300 hover:text-rose-500 transition-colors"
                            title="Remove from bag"
                          >
                            <Trash2 className="h-4 w-4 stroke-[1.5]" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Calculations and Action Banner */}
            {cartItems.length > 0 && (
              <div id="cart-totals-banner" className="border-t border-stone-100 bg-stone-50 p-6 space-y-3.5">
                <div className="space-y-1.5 text-xs text-stone-500 font-medium">
                  <div className="flex justify-between">
                    <span>Boutique Subtotal</span>
                    <span className="font-mono text-stone-900">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping Fee</span>
                    <span className="font-mono text-stone-900">
                      {shippingCharge === 0 ? "Complimentary" : `$${shippingCharge.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated Sales Tax</span>
                    <span className="font-mono text-stone-900">${estimatedTax.toFixed(2)}</span>
                  </div>
                </div>

                <div className="border-t border-stone-200/60 pt-3 flex justify-between items-baseline">
                  <span className="font-serif text-sm font-semibold text-stone-800">Total Investment</span>
                  <span className="font-mono text-lg font-bold text-stone-950">${totalAmount.toFixed(2)}</span>
                </div>

                {subtotal < 75 && (
                  <p className="text-[10px] text-stone-400 text-center leading-normal">
                    Add <strong className="font-semibold text-stone-600">${(75 - subtotal).toFixed(2)}</strong> more to receive <strong>Complimentary Shipping & Keepsake Gift</strong>
                  </p>
                )}

                <button
                  id="checkout-trigger-btn"
                  onClick={handleCheckoutClick}
                  className="w-full rounded-full bg-stone-950 py-3.5 text-xs font-semibold tracking-widest text-white uppercase shadow-md transition-all hover:bg-stone-800 active:scale-98"
                >
                  Proceed To Secure Checkout
                </button>
              </div>
            )}
          </>
        ) : (
          /* CHECKOUT SEQUENTIAL FLOWS */
          <div id="checkout-views" className="flex-1 flex flex-col justify-between overflow-y-auto">
            {checkoutStep === "shipping" ? (
              <form onSubmit={handlePlaceOrderSubmit} className="p-6 space-y-5 flex-1">
                <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
                  <landmark className="h-4.5 w-4.5 text-stone-600" />
                  <h3 className="font-serif text-sm font-semibold text-stone-900">Delivery & Payment Information</h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-mono font-medium tracking-wide text-stone-500 uppercase mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Diana Prince"
                      value={shippingForm.fullName}
                      onChange={(e) => setShippingForm({ ...shippingForm, fullName: e.target.value })}
                      className="w-full rounded-lg border border-stone-200 px-3.5 py-2.5 text-xs focus:border-stone-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono font-medium tracking-wide text-stone-500 uppercase mb-1.5">
                      Shipping Address
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="100 Luxury Avenue, Suite A"
                      value={shippingForm.address}
                      onChange={(e) => setShippingForm({ ...shippingForm, address: e.target.value })}
                      className="w-full rounded-lg border border-stone-200 px-3.5 py-2.5 text-xs focus:border-stone-400 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono font-medium tracking-wide text-stone-500 uppercase mb-1.5">
                        City
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="New York"
                        value={shippingForm.city}
                        onChange={(e) => setShippingForm({ ...shippingForm, city: e.target.value })}
                        className="w-full rounded-lg border border-stone-200 px-3.5 py-2.5 text-xs focus:border-stone-400 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono font-medium tracking-wide text-stone-500 uppercase mb-1.5">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="10001"
                        value={shippingForm.postalCode}
                        onChange={(e) => setShippingForm({ ...shippingForm, postalCode: e.target.value })}
                        className="w-full rounded-lg border border-stone-200 px-3.5 py-2.5 text-xs focus:border-stone-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono font-medium tracking-wide text-stone-500 uppercase mb-1.5">
                      Secure Credit Card (Simulation)
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        disabled
                        value={shippingForm.cardNumber}
                        className="w-full rounded-lg border border-stone-200 bg-stone-50 px-3.5 py-2.5 text-xs font-mono text-stone-500 focus:outline-none"
                      />
                      <ShieldCheck className="absolute right-3 top-2.5 h-4 w-4 text-emerald-500" />
                    </div>
                    <p className="text-[10px] text-stone-400 mt-1">This demo utilizes certified mock payment gateways securely.</p>
                  </div>
                </div>

                {/* Sub-order overview box */}
                <div className="rounded-xl border border-stone-100 bg-stone-50 p-4 space-y-2 mt-2">
                  <h4 className="text-[11px] font-mono font-medium tracking-wide text-stone-500 uppercase">Sub bags overview</h4>
                  <p className="text-xs text-stone-700 font-medium">Investing in {totalItemCount} elegant product lines.</p>
                  <p className="text-xs text-stone-900 border-t border-stone-200/80 pt-2 flex justify-between font-bold">
                    <span>Amount Charged</span>
                    <span className="font-mono">${totalAmount.toFixed(2)}</span>
                  </p>
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={handleBackToCart}
                    className="flex-1 rounded-full border border-stone-200 py-3 text-xs font-medium text-stone-600 hover:bg-stone-50 transition"
                  >
                    Back to Bag
                  </button>
                  <button
                    type="submit"
                    className="flex-1 rounded-full bg-stone-950 py-3 text-xs font-semibold tracking-widest text-white uppercase shadow-md hover:bg-stone-800 transition"
                  >
                    Place Premium Order
                  </button>
                </div>
              </form>
            ) : checkoutStep === "confirming" ? (
              <div id="confirming-stage" className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="h-10 w-10 border-2 border-stone-950 border-t-white rounded-full animate-spin" />
                <h3 className="font-serif text-lg font-medium text-stone-900">Authorizing Credentials...</h3>
                <p className="max-w-xs text-xs text-stone-400">
                  Connecting to secure luxury routing nodes to lock in inventory and authenticate simulated payments.
                </p>
              </div>
            ) : (
              <div id="complete-stage" className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="rounded-full bg-emerald-50 p-4 border border-emerald-100">
                  <ShieldCheck className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="font-serif text-xl font-medium text-stone-900">Signature Pack Released!</h3>
                <p className="max-w-xs text-xs text-stone-400">
                  Thank you for shopping on AURA Beauty. A premium packaging slip and digital receipt has been routed to your address.
                </p>
                <div className="w-48 bg-stone-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-full animate-pulse" />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
