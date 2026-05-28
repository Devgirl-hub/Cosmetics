/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Sparkles, Loader2, RefreshCw, Send, CheckCircle2, Bookmark } from "lucide-react";
import { PRODUCTS } from "../data";
import { Product } from "../types";

export default function CustomizerQuiz({ onProductSelect }: { onProductSelect: (p: Product) => void }) {
  const [skinType, setSkinType] = React.useState<"Dry" | "Oily" | "Sensitive" | "Combination" | "">("");
  const [selectedConcerns, setSelectedConcerns] = React.useState<string[]>([]);
  const [budget, setBudget] = React.useState<"No Limit (Luxury)" | "Premium Mid-Tier" | "Budget-Conscious" | "">("");
  const [preferences, setPreferences] = React.useState("");
  const [currentRoutine, setCurrentRoutine] = React.useState("");

  const [loading, setLoading] = React.useState(false);
  const [aiReport, setAiReport] = React.useState<string | null>(null);
  const [matchedProducts, setMatchedProducts] = React.useState<Product[]>([]);
  const [savedToLibrary, setSavedToLibrary] = React.useState(false);

  const concernsList = [
    "Acne & Pore Clogs",
    "Redness & Rosacea",
    "Hyperpigmentation & Dark Spots",
    "Fine Lines & Aging",
    "Dehydration & Flakiness",
    "Uneven Texture & Dullness"
  ];

  const handleConcernToggle = (concern: string) => {
    setSelectedConcerns(prev => 
      prev.includes(concern) 
        ? prev.filter(c => c !== concern) 
        : [...prev, concern]
    );
  };

  const handleFormReset = () => {
    setSkinType("");
    setSelectedConcerns([]);
    setBudget("");
    setPreferences("");
    setCurrentRoutine("");
    setAiReport(null);
    setMatchedProducts([]);
    setSavedToLibrary(false);
  };

  const executeAnalyzeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!skinType || !budget || selectedConcerns.length === 0) {
      return;
    }

    setLoading(true);
    setAiReport(null);
    setSavedToLibrary(false);

    try {
      const response = await fetch("/api/gemini/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skinType,
          skinConcerns: selectedConcerns,
          budget,
          preferences,
          currentRoutine
        })
      });

      const data = await response.json();
      if (response.ok && data.result) {
        setAiReport(data.result);

        // Intelligently match products from our database to display alongside AI insights
        const matched: Product[] = [];
        const resTextLower = data.result.toLowerCase();

        // Check mentions or related keywords to suggest products
        for (const prod of PRODUCTS) {
          const nameLower = prod.name.toLowerCase();
          const subLower = prod.subcategory.toLowerCase();
          const benLower = prod.benefits.join(" ").toLowerCase();
          const ingLower = prod.ingredientsList.join(" ").toLowerCase();

          // Match by broad categories
          if (
            resTextLower.includes(nameLower) || 
            resTextLower.includes(subLower) ||
            prod.ingredientsList.some(ing => resTextLower.includes(ing.toLowerCase())) ||
            (selectedConcerns.includes("Dehydration & Flakiness") && prod.id === "sk-2") || // hyaluronic serum
            (selectedConcerns.includes("Redness & Rosacea") && prod.id === "sk-1") || // centella cleanser
            (selectedConcerns.includes("Fine Lines & Aging") && prod.id === "sk-3") // ceramide barrier cream
          ) {
            matched.push(prod);
          }
        }

        // De-duplicate and take maximum 3
        const uniqueMatched = Array.from(new Set(matched)).slice(0, 3);
        // If nothing matched, suggest key skincare bestsellers
        setMatchedProducts(uniqueMatched.length > 0 ? uniqueMatched : PRODUCTS.filter(p => p.category === "skincare").slice(0, 3));
      } else {
        throw new Error(data.error || "Failed skincare diagnosis.");
      }
    } catch (err: any) {
      console.error(err);
      setAiReport(`### Diagnosis Failed\n\nWe encountered a server-routing issue while constructing your skincare routine. Please ensure your Gemini API secrets are configured correctly.`);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToCard = () => {
    setSavedToLibrary(true);
    // Persist in localStorage
    localStorage.setItem("aura_saved_ai_skincare", JSON.stringify({
      skinType,
      concerns: selectedConcerns,
      report: aiReport,
      date: new Date().toLocaleDateString()
    }));
  };

  return (
    <div id="ai-quiz-view-root" className="mx-auto max-w-4xl px-4 py-8">
      {/* Editorial Header */}
      <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
        <span className="text-[10px] sm:text-xs font-mono font-medium tracking-widest text-rose-500 uppercase flex items-center justify-center gap-1.5">
          <Sparkles className="h-4 w-4 stroke-[1.5] animate-pulse" /> AI Diagnostician
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-light text-stone-900 tracking-wide">
          Interactive Skincare Analyzer
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto leading-relaxed">
          Provide your dermal profile parameters to construct a bespoke routine recommended by clinical algorithms and pure botanicals.
        </p>
      </div>

      {!aiReport && !loading ? (
        /* THE FORM QUESTIONNAIRE */
        <form onSubmit={executeAnalyzeSubmit} id="skincare-quiz-form" className="rounded-2xl border border-stone-100 bg-white p-6 sm:p-8 shadow-sm space-y-8 animate-fade-in">
          
          {/* Question 1: Skin Type Bubble Buttons */}
          <div className="space-y-3">
            <label className="block text-xs font-mono font-semibold tracking-wider text-stone-400 uppercase">
              1. What is your biological skin environment type? <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(["Dry", "Oily", "Sensitive", "Combination"] as const).map((type) => (
                <button
                  type="button"
                  key={type}
                  id={`quiz-skintype-${type.toLowerCase()}`}
                  onClick={() => setSkinType(type)}
                  className={`rounded-xl border py-4.5 text-xs font-medium tracking-wide transition-all ${
                    skinType === type
                      ? "border-stone-900 bg-stone-950 text-white shadow-sm"
                      : "border-stone-200 bg-white text-stone-600 hover:border-stone-400 hover:bg-stone-50"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Question 2: Checkboxes Concerns */}
          <div className="space-y-3">
            <label className="block text-xs font-mono font-semibold tracking-wider text-stone-400 uppercase">
              2. What are your active skin concerns? (Select all that apply) <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {concernsList.map((concern) => {
                const isSelected = selectedConcerns.includes(concern);
                return (
                  <button
                    type="button"
                    key={concern}
                    id={`quiz-concern-${concern.replace(/\s+/g, '-').toLowerCase()}`}
                    onClick={() => handleConcernToggle(concern)}
                    className={`rounded-xl border p-4 text-xs font-semibold text-left transition-all flex items-center justify-between ${
                      isSelected
                        ? "border-stone-950 bg-stone-950/5 text-stone-950 font-bold"
                        : "border-stone-150 bg-stone-50/20 text-stone-600 hover:bg-stone-50 hover:border-stone-300"
                    }`}
                  >
                    <span>{concern}</span>
                    <span className={`h-4.5 w-4.5 rounded-full border flex items-center justify-center transition-colors ${
                      isSelected ? "bg-stone-950 border-stone-950 text-white" : "border-stone-300"
                    }`}>
                      {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Question 3: Budget tier */}
          <div className="space-y-3">
            <label className="block text-xs font-mono font-semibold tracking-wider text-stone-400 uppercase">
              3. Select your investment tier profile <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(["Budget-Conscious", "Premium Mid-Tier", "No Limit (Luxury)"] as const).map((b) => (
                <button
                  type="button"
                  key={b}
                  id={`quiz-budget-${b.replace(/\s+/g, '-').toLowerCase()}`}
                  onClick={() => setBudget(b)}
                  className={`rounded-xl border py-4 text-xs font-medium tracking-wide transition-all ${
                    budget === b
                      ? "border-stone-900 bg-stone-950 text-white"
                      : "border-stone-200 bg-white text-stone-600 hover:border-stone-400 hover:bg-stone-50"
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* Question 4: Current Routine text field */}
          <div className="space-y-3">
            <label className="block text-xs font-mono font-semibold tracking-wider text-stone-400 uppercase flex justify-between">
              <span>4. Your Current Routine (Optional)</span>
              <span className="text-[10px] text-stone-400 italic">E.g., Cleanser and hydration cream</span>
            </label>
            <input
              type="text"
              id="quiz-routine-input"
              value={currentRoutine}
              onChange={(e) => setCurrentRoutine(e.target.value)}
              placeholder="List whatever you currently apply, or leave empty if starting fresh..."
              className="w-full rounded-xl border border-stone-200 px-4 py-3 text-xs tracking-wide focus:border-stone-400 focus:outline-none"
            />
          </div>

          {/* Question 5: Preference Notes area */}
          <div className="space-y-3">
            <label className="block text-xs font-mono font-semibold tracking-wider text-stone-400 uppercase">
              5. Ingredient preferences or notes (Optional)
            </label>
            <textarea
              rows={3}
              id="quiz-preferences-input"
              value={preferences}
              onChange={(e) => setPreferences(e.target.value)}
              placeholder="Mention organic desires, vegan demands, scent preferences, pregnancy safety, or severe dermal allergies..."
              className="w-full rounded-xl border border-stone-200 px-4 py-3 text-xs tracking-wide focus:border-stone-400 focus:outline-none resize-none"
            />
          </div>

          {/* Action button row */}
          <div className="pt-4 border-t border-stone-150/60 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleFormReset}
              className="rounded-full border border-stone-200 hover:border-stone-400 bg-white px-5 py-2.5 text-xs font-medium text-stone-600 tracking-wide transition"
            >
              Clear
            </button>
            <button
              type="submit"
              id="submit-quiz-diagnose"
              disabled={!skinType || !budget || selectedConcerns.length === 0}
              className="rounded-full bg-stone-950 px-6 py-2.5 text-xs font-semibold tracking-widest text-white uppercase shadow hover:bg-stone-850 active:scale-98 transition disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1.5"
            >
              Construct Bespoke Plan <Sparkles className="h-4 w-4 animate-scale" />
            </button>
          </div>

        </form>
      ) : loading ? (
        /* DETAILED GLOW LOADING STATE */
        <div id="quiz-diagnosing-card" className="rounded-2xl border border-stone-100 bg-white p-12 text-center shadow-lg space-y-6 animate-pulse max-w-xl mx-auto">
          <div className="flex justify-center">
            <div className="relative flex items-center justify-center">
              <div className="h-16 w-16 border-4 border-stone-950 border-t-transparent rounded-full animate-spin" />
              <Sparkles className="absolute h-6 w-6 text-rose-500 animate-bounce" />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="font-serif text-lg font-medium text-stone-900">Synthesizing Dermal Compounds...</h3>
            <p className="max-w-xs mx-auto text-xs text-stone-400 leading-normal">
              Analyzing Centella botanical balances and ceramides counts matching skin concern variables of {skinType} profiles.
            </p>
          </div>
          <div className="flex justify-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-stone-900 animate-ping" />
            <span className="h-1.5 w-1.5 rounded-full bg-stone-600 animate-ping delay-75" />
            <span className="h-1.5 w-1.5 rounded-full bg-stone-400 animate-ping delay-150" />
          </div>
        </div>
      ) : (
        /* SCREEN DISPLAYING GEMINI AI MARKDOWN RESPONSE */
        <div id="ai-quiz-result-view" className="space-y-8 animate-fade-in">
          
          <div className="bg-white rounded-2xl border border-stone-150 p-6 sm:p-8 shadow-sm space-y-6">
            
            {/* Header toolbar for report */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-stone-100 pb-4 gap-3">
              <div>
                <span className="text-[10px] font-mono tracking-wider text-rose-500 uppercase font-semibold">Your Live Formulated Recipe</span>
                <h2 className="font-serif text-xl font-medium text-stone-900">Clinically Approved Skin Blueprint</h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  id="save-report-library"
                  onClick={handleSaveToCard}
                  className={`rounded-full border px-4 py-2 text-xs font-semibold tracking-wide transition flex items-center gap-1.5 ${
                    savedToLibrary
                      ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                      : "border-stone-200 bg-white text-stone-600 hover:border-stone-400"
                  }`}
                >
                  {savedToLibrary ? <CheckCircle2 className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                  {savedToLibrary ? "Saved Draft" : "Save Report"}
                </button>
                <button
                  id="reset-quiz-re-diagnose"
                  onClick={handleFormReset}
                  className="rounded-full border border-stone-200 hover:border-stone-400 bg-white p-2 text-stone-500 transition"
                  title="Diagnose a new profile"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* AI Report Markdown Wrapper */}
            <div id="markdown-beauty-report" className="prose prose-stone max-w-none text-xs sm:text-sm tracking-wide leading-relaxed text-stone-700 space-y-5">
              {aiReport?.split("\n").map((line, idx) => {
                const trimmed = line.trim();
                
                // Render elegant custom blocks for headings easily without extra markdown libraries
                if (trimmed.startsWith("###")) {
                  return <h4 key={idx} className="font-serif text-sm font-bold text-stone-900 tracking-wide pt-2 uppercase border-l-2 border-stone-900 pl-2.5 mt-4">{trimmed.replace("###", "")}</h4>;
                }
                if (trimmed.startsWith("##")) {
                  return <h3 key={idx} className="font-serif text-base font-semibold text-stone-950 tracking-wide pt-3 border-b border-stone-100 pb-1 mt-6">{trimmed.replace("##", "")}</h3>;
                }
                if (trimmed.startsWith("**")) {
                  // Maybe highlight subparts
                  return <p key={idx} className="font-serif text-stone-900 font-medium pl-1">{trimmed}</p>;
                }
                if (trimmed.startsWith("-") || trimmed.startsWith("*")) {
                  return (
                    <div key={idx} className="flex gap-2.5 items-start pl-2">
                      <span className="text-stone-400">•</span>
                      <span>{trimmed.substring(1).trim()}</span>
                    </div>
                  );
                }
                if (trimmed.length === 0) return <div key={idx} className="h-2" />;
                return <p key={idx} className="text-stone-600 font-light">{trimmed}</p>;
              })}
            </div>

          </div>

          {/* Matches section - recommends specifically curated AURA skincares */}
          {matchedProducts.length > 0 && (
            <div id="ai-recommended-bazaar" className="space-y-4 animate-fade-in scroll-mt-20">
              <div className="flex items-center gap-1.5">
                <Sparkles className="h-4.5 w-4.5 text-stone-500" />
                <h3 className="font-serif text-lg font-medium text-stone-900 tracking-wide">
                  Curated AURA Product Pairings
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {matchedProducts.map((prod) => (
                  <div 
                    key={prod.id}
                    id={`ai-suggestion-card-${prod.id}`}
                    onClick={() => onProductSelect(prod)} 
                    className="group cursor-pointer rounded-2xl border border-stone-100 bg-white p-4 shadow-xs hover:shadow-md transition duration-300"
                  >
                    <div className="overflow-hidden rounded-xl bg-stone-50 h-40 relative">
                      <img 
                        src={prod.image} 
                        alt={prod.name}
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="mt-3.5 space-y-1">
                      <p className="text-[9px] font-mono tracking-widest text-stone-400 uppercase">{prod.subcategory}</p>
                      <h4 className="font-serif text-xs font-semibold text-stone-800 line-clamp-1 group-hover:text-stone-950 transition">
                        {prod.name}
                      </h4>
                      <p className="text-xs font-bold font-mono text-stone-900">${prod.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
