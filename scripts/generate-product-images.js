#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, '..', 'public', 'images');

const products = [
  // Chainsaws
  { id: 'chainsaw-1', name: 'Husqvarna 450e II', brand: 'Husqvarna', category: 'chainsaw', color1: '#1B5E20', color2: '#4CAF50', emoji: '⛽', price: '$579', specs: '18" Bar | 50.2cc' },
  { id: 'chainsaw-2', name: 'STIHL MS 261 C-M', brand: 'STIHL', category: 'chainsaw', color1: '#E65100', color2: '#FF8F00', emoji: '⛽', price: '$849', specs: '16" Bar | M-Tronic' },
  { id: 'chainsaw-3', name: 'Echo CS-400', brand: 'Echo', category: 'chainsaw', color1: '#2E7D32', color2: '#66BB6A', emoji: '⛽', price: '$349', specs: '14" Bar | 40.2cc' },
  { id: 'chainsaw-4', name: 'Makita EA3202S', brand: 'Makita', category: 'chainsaw', color1: '#00695C', color2: '#26A69A', emoji: '⛽', price: '$399', specs: '12" Bar | 30.2cc' },
  { id: 'chainsaw-5', name: 'Husqvarna 120i', brand: 'Husqvarna', category: 'chainsaw', color1: '#1B5E20', color2: '#81C784', emoji: '🔋', price: '$299', specs: 'Battery | Brushless' },
  // Lawn Mowers
  { id: 'mower-1', name: 'Honda HRX537C5', brand: 'Honda', category: 'lawn mower', color1: '#C62828', color2: '#EF5350', emoji: '🏠', price: '$1299', specs: 'Self-Propelled | 190cc' },
  { id: 'mower-2', name: 'Victa GCVX190', brand: 'Victa', category: 'lawn mower', color1: '#1565C0', color2: '#42A5F5', emoji: '🏠', price: '$649', specs: '4-in-1 | Aussie Made' },
  { id: 'mower-3', name: 'Rover 4545 ProCut', brand: 'Rover', category: 'lawn mower', color1: '#00838F', color2: '#4DD0E1', emoji: '🏠', price: '$799', specs: '20" Deck | B&S' },
  { id: 'mower-4', name: 'EGO LM2135E', brand: 'EGO', category: 'lawn mower', color1: '#6A1B9A', color2: '#AB47BC', emoji: '🔋', price: '$899', specs: 'Battery | 56V Lithium' },
  { id: 'mower-5', name: 'Masport President', brand: 'Masport', category: 'lawn mower', color1: '#2E7D32', color2: '#4CAF50', emoji: '🏠', price: '$749', specs: 'Hi-Flow | 19" Deck' },
  // Fishing
  { id: 'fishing-1', name: 'Shimano Stradic FL', brand: 'Shimano', category: 'spinning reel', color1: '#0D47A1', color2: '#1E88E5', emoji: '🎣', price: '$349', specs: '2500 | 6+1 BB' },
  { id: 'fishing-2', name: 'Daiwa Saltiga Rod', brand: 'Daiwa', category: 'fishing rod', color1: '#B71C1C', color2: '#E53935', emoji: '🎣', price: '$189', specs: '7ft | IM8 Graphite' },
  { id: 'fishing-3', name: 'Rapala X-Rap Kit', brand: 'Rapala', category: 'lure kit', color1: '#006064', color2: '#26C6DA', emoji: '🐟', price: '$59', specs: '12pc | Suspending' },
  { id: 'fishing-4', name: 'Penn Battle III', brand: 'Penn', category: 'rod & reel', color1: '#C62828', color2: '#EF5350', emoji: '🎣', price: '$219', specs: '3000 | Full Combo' },
  { id: 'fishing-5', name: 'Daiwa BG MQ 4000', brand: 'Daiwa', category: 'spinning reel', color1: '#F57F17', color2: '#FFEE58', emoji: '🎣', price: '$199', specs: '4000 | Magsealed' },
  // Construction
  { id: 'construction-1', name: 'DeWalt DCD999N', brand: 'DeWalt', category: 'drill driver', color1: '#F57F17', color2: '#FFC107', emoji: '🔧', price: '$279', specs: '20V XR | Brushless' },
  { id: 'construction-2', name: 'Milwaukee M18CCS55', brand: 'Milwaukee', category: 'circular saw', color1: '#C62828', color2: '#EF5350', emoji: '🔧', price: '$449', specs: 'M18 Fuel | 165mm' },
  { id: 'construction-3', name: 'Makita HM1213C', brand: 'Makita', category: 'demo hammer', color1: '#00695C', color2: '#26A69A', emoji: '⚡', price: '$899', specs: '35J | AVT' },
  { id: 'construction-4', name: 'Bosch GWS 24-230', brand: 'Bosch', category: 'angle grinder', color1: '#1B5E20', color2: '#43A047', emoji: '⚙️', price: '$229', specs: '2400W | 230mm' },
  { id: 'construction-5', name: 'DeWalt DCH273N', brand: 'DeWalt', category: 'rotary hammer', color1: '#F57F17', color2: '#FFC107', emoji: '🔧', price: '$399', specs: '18V XR | SDS Plus' },
];

products.forEach(product => {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
  <defs>
    <linearGradient id="bg-${product.id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${product.color1};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${product.color2};stop-opacity:1" />
    </linearGradient>
    <filter id="shadow-${product.id}">
      <feDropShadow dx="0" dy="4" stdDeviation="8" flood-opacity="0.3"/>
    </filter>
    <linearGradient id="card-${product.id}" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:white;stop-opacity:0.15" />
      <stop offset="100%" style="stop-color:white;stop-opacity:0.05" />
    </linearGradient>
  </defs>
  
  <!-- Background -->
  <rect width="400" height="300" fill="url(#bg-${product.id})"/>
  
  <!-- Product card -->
  <rect x="40" y="20" width="320" height="200" rx="12" fill="url(#card-${product.id})" filter="url(#shadow-${product.id})"/>
  
  <!-- Product emoji icon -->
  <text x="200" y="130" font-family="Arial, sans-serif" font-size="90" text-anchor="middle" dominant-baseline="central">${product.emoji}</text>
  
  <!-- Brand badge top-left -->
  <rect x="15" y="15" rx="6" ry="6" width="90" height="28" fill="white" opacity="0.95"/>
  <text x="60" y="34" font-family="Arial, sans-serif" font-size="13" font-weight="bold" text-anchor="middle" fill="${product.color1}">${product.brand}</text>
  
  <!-- Category badge top-right -->
  <rect x="280" y="15" rx="6" ry="6" width="85" height="22" fill="white" opacity="0.25"/>
  <text x="322" y="30" font-family="Arial, sans-serif" font-size="10" text-anchor="middle" fill="white">${product.category}</text>
  
  <!-- Product name -->
  <text x="200" y="240" font-family="Arial, sans-serif" font-size="20" font-weight="bold" text-anchor="middle" fill="white">${product.name}</text>
  
  <!-- Specs -->
  <text x="200" y="265" font-family="Arial, sans-serif" font-size="14" text-anchor="middle" fill="white" opacity="0.85">${product.specs}</text>
  
  <!-- Price -->
  <rect x="130" y="275" rx="8" ry="8" width="140" height="20" fill="#FFC107" opacity="0.95"/>
  <text x="200" y="290" font-family="Arial, sans-serif" font-size="16" font-weight="bold" text-anchor="middle" fill="#333">${product.price}</text>
</svg>`;

  const filePath = path.join(imagesDir, `${product.id}.svg`);
  fs.writeFileSync(filePath, svg);
  console.log(`✓ Created: ${product.id}.svg  ${product.brand} ${product.name} ${product.price}`);
});

console.log(`\n✅ Generated ${products.length} product images`);
