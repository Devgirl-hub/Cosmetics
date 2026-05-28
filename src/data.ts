/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product, CosmeticIngredient } from "./types";

export const PRODUCTS: Product[] = [
  // Skincare
  {
    id: "sk-1",
    name: "Centella Hydrating Cleanser",
    brand: "AURA",
    category: "skincare",
    subcategory: "Cleanser",
    price: 28,
    rating: 4.8,
    reviewsCount: 124,
    description: "A soothing, moisture-balanced gel cleanser that sweeps away impurities without stripping.",
    longDescription: "Formulated at an optimal pH of 5.5, this refreshing gel-to-foam cleanser utilizes Centella Asiatica and Green Tea extracts to calm redness and inflammation while maintaining a resilient moisture barrier. Safe for daily morning and night cycles on even the most sensitive skin.",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80",
    benefits: ["Maintains skin pH balance", "Deeply calms inflammation", "Gently lifts sunscreen and debris"],
    ingredientsList: ["Centella Asiatica Extract", "Green Tea Leaf Extract", "Squalane", "Glycerin", "Allantoin"],
    howToUse: "Massage a dime-sized amount onto damp facial skin in circular motions. Rinse thoroughly with lukewarm water. Use morning and night.",
    isBestSeller: true
  },
  {
    id: "sk-2",
    name: "Triple Hyaluronic Plumping Serum",
    brand: "AURA",
    category: "skincare",
    subcategory: "Serum",
    price: 46,
    rating: 4.9,
    reviewsCount: 382,
    description: "Multidimensional hydration featuring three distinct molecule weights for intense skin bounce.",
    longDescription: "Our signature hydrating serum targets dehydration lines by penetrating multiple epidermal layers with low, medium, and high molecular weight hyaluronic molecules. Fortified with Squalane to lock in hydration, skin immediately appears plumper, smooth, and radiating natural glow.",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80",
    benefits: ["Virtually erases hydration lines", "Instantly boosts dewy plumpness", "Locks moisture for 24 hours"],
    ingredientsList: ["Hyaluronic Acid (Triple Weight)", "Panthenol (Vitamin B5)", "Squalane", "Niacinamide", "Beta-Glucan"],
    howToUse: "Dispense 2-3 drops onto clean, damp palms. Press gently into the damp face and neck, allowing to absorb before sealing with cream.",
    isNew: true
  },
  {
    id: "sk-3",
    name: "Ceramide Barrier Defense Cream",
    brand: "AURA",
    category: "skincare",
    subcategory: "Moisturizer",
    price: 52,
    rating: 4.7,
    reviewsCount: 219,
    description: "A comforting blend of 3 essential ceramides and nourishing squalane for ultimate resilient skin.",
    longDescription: "A rich yet weightless moisturizing dream designed to restore irritated, compromised, or naturally dry skin. Rebuilding your surface barrier with 3 key ceramides and fatty acids, this cream creates a protective silk layer that locks in key treatments and wards off external stressors.",
    image: "https://images.unsplash.com/photo-1608248597481-496100c8c836?auto=format&fit=crop&w=600&q=80",
    benefits: ["Restores damaged cell integrity", "Deep, continuous 72-hour moisture", "Calms flaky or dry tight patches"],
    ingredientsList: ["Ceramide NP", "Ceramide AP", "Ceramide EOP", "Squalane", "Shea Butter", "Niacinamide"],
    howToUse: "Warm a pea-sized portion between fingertips and press into face and neck in upward sweeping movements as the final moisturizing step."
  },
  {
    id: "sk-4",
    name: "Mineral Dewy Glow SPF 50",
    brand: "AURA",
    category: "skincare",
    subcategory: "Sunscreen",
    price: 36,
    rating: 4.6,
    reviewsCount: 177,
    description: "Ultra-weightless zinc protection leaving a satin translucent glow without standard white residue.",
    longDescription: "A revolutionary 100% mineral daily screen using micronized zinc oxide. Protects against UVA/UVB photo-aging while providing a gorgeous satin-finish, dewy-skin gloss. Enriched with thermal waters and dynamic botanicals to hydrate throughout hot, sunny exposure.",
    image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=600&q=80",
    benefits: ["Broad spectrum photo-defense SPF50+", "Elegant luminous glass glow finish", "Zero white cast or heavy feel"],
    ingredientsList: ["Micronized Zinc Oxide 20%", "Thermal Water", "Green Tea Extract", "Vitamin E", "Centella Asiatica"],
    howToUse: "Apply generously as the final step of your morning skincare routine, at least 15 minutes before light exposure. Reapply every 2 hours in direct sun.",
    isBestSeller: true
  },

  // Makeup
  {
    id: "mu-1",
    name: "Satin Velvet Lip Cream",
    brand: "AURA",
    category: "makeup",
    subcategory: "Lipstick",
    price: 24,
    rating: 4.8,
    reviewsCount: 412,
    description: "Immersive buttery whipped lip souffle providing long-wear velvet texture and comfort.",
    longDescription: "A weightless cream lipstick offering vivid coverage in a single stroke. Fortified with organic rosehip seed oil and macadamia parameters, it nourishes lips to prevent drying out, settling into lines, or flaking. Soft-blur filters create a romantic plush appearance.",
    image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=600&q=80",
    benefits: ["Plush, non-drying air-whipped formula", "Vibrant colors with soft focus blur", "Enriched with cushiony Rosehip Oil"],
    ingredientsList: ["Rosehip Seed Oil", "Macadamia Oil", "Dimethicone", "Silica Silylate", "Tocopheryl Acetate"],
    howToUse: "Glide onto the center of lips and blend outward using applicator or fingertips for an omnipotent fully-saturated or blurred ombré effect.",
    isBestSeller: true,
    shades: [
      { name: "Bare Nude", hex: "#D2A292", description: "A quiet, classic dusty-rose neutral with warm beige undertones." },
      { name: "Sunset Coral", hex: "#E07A5F", description: "A joyful pop of warm apricot pink looking like summer suns." },
      { name: "AURA Crimson", hex: "#B82E2E", description: "Our iconic blue-red shade delivering powerful modern sophistication." },
      { name: "Plum Noir", hex: "#623348", description: "A seductive, dramatic deep berry purple for sophisticated elegance." }
    ]
  },
  {
    id: "mu-2",
    name: "Radiant Liquid Silk Foundation",
    brand: "AURA",
    category: "makeup",
    subcategory: "Foundation",
    price: 48,
    rating: 4.7,
    reviewsCount: 298,
    description: "Breathable light-to-medium foundation providing a fresh, second-skin luminous satin finish.",
    longDescription: "Meet skin-perfecting elegance. This fluid foundation acts like a fine silk sheet on your face, scattering light to blur pores, blemishes, and texture with sheer ease. Infused with squalane and hydration minerals, it remains vibrant and dewy all day without settling.",
    image: "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a3ef?auto=format&fit=crop&w=600&q=80",
    benefits: ["Customizable, featherweight breathable veil", "Satin light-reflecting second-skin feel", "12-hour continuous fresh hydration"],
    ingredientsList: ["Squalane", "Mineral Aqua", "Dimethicone", "Titanium Dioxide", "Glycerin"],
    howToUse: "Shake well. Apply 1-2 pumps onto backend of hands and buff outward using a dense foundation brush or moist blending sponge.",
    isNew: true,
    shades: [
      { name: "Alabaster Aura", hex: "#F3E3D3", description: "Very fair porcelain shade with delicate cool pink undertones." },
      { name: "Warm Sand", hex: "#E6C5A9", description: "Medium-light base with natural warm golden undertones." },
      { name: "Amber Tan", hex: "#C79D7C", description: "Deep golden medium tone ideal for warm-tanned complexions." },
      { name: "Espresso Deep", hex: "#7E5136", description: "Rich, deep cocoa bronze with subtle, balanced red undertones." }
    ]
  },
  {
    id: "mu-3",
    name: "Luminous Gel Blush & Glow",
    brand: "AURA",
    category: "makeup",
    subcategory: "Blush",
    price: 26,
    rating: 4.9,
    reviewsCount: 156,
    description: "A bouncy cheek treat offering a sheer, pinch-perfect watercolor glow with dewy finish.",
    longDescription: "Indulge in organic pink warmth. A revolutionary light gel blush that melts instantly into the skin. Non-sticky, translucent, and highly buildable, it lets you construct a natural active-flush cheek look with delicious glass-like luster.",
    image: "https://images.unsplash.com/photo-1631730359575-38e4755d772b?auto=format&fit=crop&w=600&q=80",
    benefits: ["Sheer translucent hydration watercolor finish", "Effortless sweep-on blending", "Non-comedogenic botanical gel"],
    ingredientsList: ["Jojoba Oil", "Avocado Oil", "Rose Dew Hydro", "Glycerin", "Mica (Shimmer)"],
    howToUse: "Dab 2 small dots onto the high apples of your cheeks. Press gently with a warm finger or sponge, blending upwards.",
    isBestSeller: true,
    shades: [
      { name: "Peach Luster", hex: "#F2A18D", description: "A delicate pale peach with fine gold micro-shimmer." },
      { name: "Rose Petal", hex: "#E28B9B", description: "A fresh natural healthy flush of organic dewy pink." },
      { name: "Mauve Whisper", hex: "#B88390", description: "An elegant warm plum mauve for sculpted twilight definition." }
    ]
  },

  // Fragrance
  {
    id: "fr-1",
    name: "Jardin De Rose Eau de Parfum",
    brand: "AURA",
    category: "fragrance",
    subcategory: "Parfum",
    price: 85,
    rating: 4.8,
    reviewsCount: 89,
    description: "An elegant, romantic blend of organic Damask rose, warm cedar leaf, and citrus morning mists.",
    longDescription: "A sensory voyage through a wet botanical glasshouse. Featuring high-grade Damask Rose absolute as the beating heart, tempered by unexpected earthy Cedarwood, Vetiver, and finished with a sparkling top register of Italian Bergamot. Seductive, fresh, and deeply memorable.",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=600&q=80",
    benefits: ["High-concentration perfume grade", "Stays active on skin for up to 10 hours", "Cruelty-free botanical distillation formulation"],
    ingredientsList: ["Organic Cane Alcohol", "Damask Rose Oil", "Bergamot Essence", "Cedarwood Absolute", "Patchouli Leaf"],
    howToUse: "Mist gently onto key warm pulse points (wrists, side inner neck, behind ears) from 6 inches away. Let settle naturally without friction.",
    isNew: true
  },
  {
    id: "fr-2",
    name: "Bergamot Mist Ambient Cologne",
    brand: "AURA",
    category: "fragrance",
    subcategory: "Cologne",
    price: 68,
    rating: 4.5,
    reviewsCount: 44,
    description: "A bright, energetic splash of Sicilian cold-pressed bergamot, sea salts, and green moss.",
    longDescription: "The ultimate clean refreshing escape. This crystalline blend opens with crisp citrus zest, sparkling sea mist accord, and dries down into a modern comforting skin musk with wet mossy stone hints. Clean, genderless, and invigorating.",
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=600&q=80",
    benefits: ["Clean refreshing daytime therapy fragrance", "Calms mood with natural citrus essences", "Vibrant summer citrus aura"],
    ingredientsList: ["Premium Alcol", "Sicily Bergamot Oil", "Sea Salt Accord", "Oakmoss Extract", "Musk Aroma"],
    howToUse: "Generously mist over body, linens, or ambient space to instantly invoke an sunny, maritime landscape mood."
  }
];

export const INGREDIENT_GLOSSARY: CosmeticIngredient[] = [
  {
    name: "Centella Asiatica",
    category: "Botanical Soother",
    benefit: "Calming and Healing",
    description: "Also known as Gotu Kola or Tiger Grass, Centella Asiatica is a potent herbal extract rich in amino acids and active saponins. It is legendary in skincare for rebuilding skin barriers, instantly taking away irritation, calming severe acne flare-ups, and stimulating collagen synthesis.",
    safetyRating: "Excellent"
  },
  {
    name: "Squalane",
    category: "Lipid Hydrator",
    benefit: "Non-clogging Moisture",
    description: "A cruelty-free, olive-derived version of squalene, which occurs naturally in our skin's protective sebum. Squalane is highly stable, incredibly bio-compatible, and moisturizes deeply without clogging pores or feeling heavy. Great for dry, normal, or even acne-prone profiles.",
    safetyRating: "Excellent"
  },
  {
    name: "Niacinamide (Vitamin B3)",
    category: "Multi-Tasking Vitamin",
    benefit: "Barrier Repair & Pore Refinement",
    description: "Niacinamide is a powerhouse active that treats a myriad of skin issues. It regulates sebum production, visibly shrinks enlarged pores, corrects hyperpigmentation/acne scarring, repairs barrier lipid layers, and reduces environmental free radical defense.",
    safetyRating: "Excellent"
  },
  {
    name: "Hyaluronic Acid",
    category: "Humectant Booster",
    benefit: "Deep Moisture Attraction",
    description: "A sugar molecule capable of holding up to 1000 times its weight in pure water. Drawing humidity from the surrounding atmosphere directly into the skin cells, it provides an immediate lifting, smoothing, and bouncy plump finish to dehydrated skin layers.",
    safetyRating: "Excellent"
  },
  {
    name: "Ceramides",
    category: "Structure Rebuilder",
    benefit: "Intense Moisture Retention",
    description: "Ceramides are lipid molecules that form a massive chunk of our natural skin barrier (nearly 50%). Supplementing them topically helps stitch skin cells together, locking crucial moisture in and preventing dry pollutants from penetrating.",
    safetyRating: "Excellent"
  },
  {
    name: "Rosehip Seed Oil",
    category: "Botanical Nourisher",
    benefit: "Smooth Tint and Elasticity",
    description: "Harvested from organic wild rose bushes, Rosehip is loaded with natural retinoic acid, Vitamin C, and essential fatty acids. It aids cell regeneration, intensely softens textural dryness, and gives makeup formulas a luxurious melting feel.",
    safetyRating: "Good"
  }
];
