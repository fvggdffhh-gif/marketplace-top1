# AussieFarm Marketplace 🌏

Australian marketplace for farming equipment, fishing gear, and construction tools.

## Stack

- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS v4
- **Backend:** Supabase (Auth, Database, RLS)
- **Language:** TypeScript

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Copy `.env.local.example` to `.env.local`
3. Add your Supabase URL and anon key to `.env.local`
4. Run the SQL in `supabase/setup.sql` in your Supabase SQL Editor

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Supabase Setup

Run this SQL in your Supabase SQL Editor to create tables and seed data:

```
supabase/setup.sql
```

This creates:
- `products` - Product catalog
- `profiles` - User profiles (linked to auth.users)
- `cart_items` - Shopping cart
- `orders` - Order history
- Row Level Security policies
- Trigger for auto-profile creation on signup

## Features

- 🪚 **Chainsaws** - 5 products (Husqvarna, STIHL, Echo, Makita)
- 🌿 **Lawn Mowers** - 5 products (Honda, Victa, Rover, EGO, Masport)
- 🎣 **Fishing Gear** - 5 products (Shimano, Daiwa, Rapala, Penn)
- 🔨 **Construction Tools** - 5 products (DeWalt, Milwaukee, Makita, Bosch)

### Key Features
- 🛒 Persistent cart (synced to Supabase when logged in)
- 👤 Supabase authentication
- 💰 20% first-purchase discount
- 📱 Responsive design
- ✨ Animated backgrounds and interactions
