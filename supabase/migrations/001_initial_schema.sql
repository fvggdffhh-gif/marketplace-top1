-- Australian Marketplace - Initial Schema

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Users profile table (extends Supabase auth.users)
create table profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  name text not null,
  email text not null,
  phone text,
  address text,
  has_purchased boolean not null default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Products table
create table products (
  id bigint generated always as identity primary key,
  name text not null,
  description text,
  price decimal(10, 2) not null,
  original_price decimal(10, 2),
  category text not null,
  image text,
  features text[],
  rating decimal(3, 2) default 0,
  reviews_count integer default 0,
  in_stock boolean default true,
  australian_made boolean default false,
  badge text,
  created_at timestamp with time zone default now()
);

-- Cart items table
create table cart_items (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  product_id bigint references products(id) on delete cascade not null,
  quantity integer not null default 1,
  created_at timestamp with time zone default now(),
  unique(user_id, product_id)
);

-- Orders table
create table orders (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  status text not null default 'pending',
  total decimal(10, 2) not null,
  shipping_address text,
  created_at timestamp with time zone default now()
);

-- Order items table
create table order_items (
  id bigint generated always as identity primary key,
  order_id bigint references orders(id) on delete cascade not null,
  product_id bigint references products(id) on delete cascade not null,
  quantity integer not null,
  price decimal(10, 2) not null
);

-- Discounts table
create table discounts (
  id bigint generated always as identity primary key,
  code text unique not null,
  percentage decimal(5, 2) not null,
  valid_from timestamp with time zone default now(),
  valid_until timestamp with time zone,
  active boolean default true,
  created_at timestamp with time zone default now()
);

-- Reviews table
create table reviews (
  id bigint generated always as identity primary key,
  product_id bigint references products(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete set null,
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table profiles enable row level security;
alter table cart_items enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table products enable row level security;
alter table discounts enable row level security;
alter table reviews enable row level security;

-- RLS Policies

-- Profiles: users can only see/update their own profile
create policy "Users can view own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on profiles for insert
  with check (auth.uid() = id);

-- Cart items: users can only manage their own cart
create policy "Users can view own cart"
  on cart_items for select
  using (auth.uid() = user_id);

create policy "Users can insert into own cart"
  on cart_items for insert
  with check (auth.uid() = user_id);

create policy "Users can update own cart"
  on cart_items for update
  using (auth.uid() = user_id);

create policy "Users can delete from own cart"
  on cart_items for delete
  using (auth.uid() = user_id);

-- Orders: users can only see their own orders
create policy "Users can view own orders"
  on orders for select
  using (auth.uid() = user_id);

create policy "Users can create own orders"
  on orders for insert
  with check (auth.uid() = user_id);

-- Order items: users can only see their own order items
create policy "Users can view own order items"
  on order_items for select
  using (
    exists (
      select 1 from orders
      where orders.id = order_items.order_id
      and orders.user_id = auth.uid()
    )
  );

create policy "Users can create own order items"
  on order_items for insert
  with check (
    exists (
      select 1 from orders
      where orders.id = order_items.order_id
      and orders.user_id = auth.uid()
    )
  );

-- Products: public read access
create policy "Anyone can view products"
  on products for select
  using (true);

-- Discounts: public read access
create policy "Anyone can view discounts"
  on discounts for select
  using (true);

-- Reviews: public read, authenticated users can create
create policy "Anyone can view reviews"
  on reviews for select
  using (true);

create policy "Authenticated users can create reviews"
  on reviews for insert
  with check (auth.uid() is not null);

create policy "Users can update own reviews"
  on reviews for update
  using (auth.uid() = user_id);

create policy "Users can delete own reviews"
  on reviews for delete
  using (auth.uid() = user_id);

-- Function to handle new user profile creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, email)
  values (new.id, new.raw_user_meta_data->>'name', new.email);
  return new;
end;
$$ language plpgsql security definer;

-- Trigger on new user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Insert sample products
INSERT INTO products (name, price, original_price, category, description, features, image, rating, reviews_count, in_stock, badge) VALUES
('Husqvarna 450e II 18" Chainsaw', 579.00, 724.00, 'chainsaws', 'Professional-grade chainsaw perfect for landowners and farmers. Features X-Torq engine technology.', ARRAY['50.2cc engine', '18" guide bar', 'X-Torq engine', 'Air purge system', 'Low vibration', '0.95L fuel'], '/images/chainsaw-1.svg', 4.8, 234, true, 'Best Seller'),
('STIHL MS 261 C-M 16" Chainsaw', 849.00, 1061.00, 'chainsaws', 'Professional arborist chainsaw with M-Tronic electronic engine management.', ARRAY['50.2cc M-Tronic', '16" Rollomatic ES', 'Electronic management', 'Decompression valve', 'Anti-vibration', '4.0kg weight'], '/images/chainsaw-2.svg', 4.9, 187, true, 'Pro Grade'),
('Echo CS-400 14" Chainsaw', 349.00, 436.00, 'chainsaws', 'Ideal homeowner chainsaw for light pruning and firewood preparation.', ARRAY['40.2cc engine', '14" bar and chain', 'Side-access tensioner', 'Automatic oiler', 'Tool-less filter', 'Easy start'], '/images/chainsaw-3.svg', 4.5, 156, true, null),
('Makita EA3202S 12" Chainsaw', 399.00, 499.00, 'chainsaws', 'Compact and lightweight chainsaw designed for safety and ease of use.', ARRAY['30.2cc engine', '12" safety bar', 'Low kickback chain', 'Hand guard', 'Tool-free adjustment', '5.4kg weight'], '/images/chainsaw-4.svg', 4.6, 98, true, null),
('Husqvarna 120i Battery Chainsaw', 299.00, 374.00, 'chainsaws', 'Cordless battery chainsaw for eco-conscious homeowners.', ARRAY['Brushless motor', '12" guide bar', '40min runtime', 'Zero emissions', 'Low noise', 'SavE mode'], '/images/chainsaw-5.svg', 4.4, 142, true, 'Eco Choice'),
('Honda HRX537C5 Self-Propelled Mower', 1299.00, 1624.00, 'mowers', 'Premium commercial-grade mower with Honda GCVx190 engine.', ARRAY['GCVx190 190cc', '21" NeXite deck', 'Versamow control', 'Twin blade micro cut', 'Roto-Stop', 'Variable speed'], '/images/mower-1.svg', 4.9, 312, true, 'Premium'),
('Victa GCVX190 19" Mower', 649.00, 811.00, 'mowers', 'Iconic Australian brand mower designed for tough Aussie conditions.', ARRAY['Honda GCVx190', '19" steel deck', '4-in-1 cutting', 'Pro Cut blade', 'Washout port', 'Single lever adjust'], '/images/mower-2.svg', 4.7, 289, true, 'Aussie Made'),
('Rover 4545 ProCut 20" Mower', 799.00, 999.00, 'mowers', 'Australian designed and built mower with Briggs & Stratton engine.', ARRAY['B&S 163cc', '20" premium deck', 'High rear discharge', 'Tri-Rover blade', 'Quick-adjust height', 'Fold-away handles'], '/images/mower-3.svg', 4.6, 178, true, null),
('EGO LM2135E Battery Mower', 899.00, 1124.00, 'mowers', 'Revolutionary 56V lithium-ion battery mower.', ARRAY['56V ARC lithium', '21" steel deck', 'LED headlights', '6-position height', 'Foldable design', '55min runtime'], '/images/mower-4.svg', 4.8, 245, true, 'Battery Power'),
('Masport President 3000 S30', 749.00, 936.00, 'mowers', 'Premium Australian designed mower with Hi-Flow deck technology.', ARRAY['Honda GCV190', '19" Hi-Flow deck', '4-in-1 mowing', 'Quick-change blade', 'Single point adjust', 'Ergonomic handles'], '/images/mower-5.svg', 4.5, 134, true, null),
('Shimano Stradic FL 2500 Spinning Reel', 349.00, 436.00, 'fishing', 'Flagship Stradic reel with Hagane body and X-Ship technology.', ARRAY['Hagane body', 'X-Ship gears', '6+1 bearings', 'Cross Carbon drag', 'Propulsion line', '6.0:1 ratio'], '/images/fishing-1.svg', 4.9, 523, true, 'Top Rated'),
('Daiwa Saltiga Casting Rod 7ft', 189.00, 236.00, 'fishing', 'Premium IM8 graphite blank rod designed for serious anglers.', ARRAY['IM8 graphite', 'Fuji K-guides', 'Fuji DPS seat', 'EVA grip', 'Medium-heavy', 'Casting'], '/images/fishing-2.svg', 4.7, 267, true, null),
('Rapala X-Rap Lure Kit 12pc', 59.99, 75.00, 'fishing', 'Comprehensive collection of proven X-Rap jerkbait patterns.', ARRAY['12 lures in box', 'Suspending design', 'VMC hooks', 'Holographic patterns', 'XR-10 size', 'Bass & bream'], '/images/fishing-3.svg', 4.6, 345, true, null),
('Penn Battle III 3000 Spinning Combo', 219.00, 274.00, 'fishing', 'Complete rod and reel combo ready for the water.', ARRAY['Full carbon body', 'HT-100 drag', '7ft medium rod', 'Aluminium spool', 'Line capacity ring', 'Ready to fish'], '/images/fishing-4.svg', 4.8, 412, true, 'Value Pack'),
('Daiwa BG MQ 4000 Spinning Reel', 199.00, 249.00, 'fishing', 'Monocoque body spinning reel built tough for saltwater.', ARRAY['Monocoque MQ body', 'Magsealed tech', 'DigiGear system', '6+1 bearings', 'ATD drag', 'Corrosion resistant'], '/images/fishing-5.svg', 4.7, 198, true, null),
('DeWalt DCD999N 20V XR Brushless Drill', 279.00, 349.00, 'construction', 'Professional grade compact brushless drill/driver.', ARRAY['Brushless motor', '13mm chuck', '2-speed gearbox', '16 torque settings', 'LED work light', '177mm length'], '/images/construction-1.svg', 4.8, 678, true, 'Trade Quality'),
('Milwaukee M18CCS55-0 Circular Saw', 449.00, 561.00, 'construction', 'Fuel brushless circular saw with POWERSTATE motor.', ARRAY['POWERSTATE motor', '165mm blade', '67mm depth', 'REDLINK PLUS', 'Magnesium shoe', 'Bevel adjust'], '/images/construction-2.svg', 4.9, 445, true, 'Pro Choice'),
('Makita HM1213C Demo Hammer', 899.00, 1124.00, 'construction', 'Heavy duty 35J demolition hammer for breaking concrete.', ARRAY['35J impact', '1100W motor', 'AVT anti-vibration', '1700 RPM', 'Soft start', 'Variable speed'], '/images/construction-3.svg', 4.7, 156, true, null),
('Bosch GWS 24-230JH Angle Grinder', 229.00, 286.00, 'construction', 'Powerful 2400W angle grinder with restart protection.', ARRAY['2400W motor', '230mm disc', '11,000 RPM', 'Restart protection', 'Overload protection', 'Vibration handle'], '/images/construction-4.svg', 4.6, 289, true, null),
('DeWalt DCH273N 18V SDS Rotary Hammer', 399.00, 499.00, 'construction', 'XR brushless rotary hammer with 3 modes.', ARRAY['Brushless motor', '2.7J impact', '3 mode selection', 'SHS technology', 'SDS Plus chuck', 'Active vibration'], '/images/construction-5.svg', 4.8, 334, true, 'New Arrival');

-- Insert sample discount
INSERT INTO discounts (code, percentage, valid_until, active) VALUES
('WELCOME20', 20.00, '2026-12-31', true);
