'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'ru' | 'en';

export interface Translations {
  // Header
  searchPlaceholder: string;
  signIn: string;
  createAccount: string;
  home: string;
  allProducts: string;
  topDeals: string;
  cart: string;

  // Categories
  chainsaws: string;
  chainsawsDesc: string;
  mowers: string;
  mowersDesc: string;
  construction: string;
  constructionDesc: string;
  electrical: string;
  electricalDesc: string;
  plumbing: string;
  plumbingDesc: string;
  bicycles: string;
  bicyclesDesc: string;
  fishing: string;
  fishingDesc: string;
  aircon: string;
  airconDesc: string;

  // Homepage
  shopByCategory: string;
  shopNow: string;
  dealOfTheDay: string;
  shopThisDeal: string;
  topDealsTitle: string;
  topDealsSub: string;
  viewAllDeals: string;
  featuredProducts: string;
  featuredSub: string;
  shopAll: string;
  topRated: string;
  topRatedSub: string;
  viewAll: string;
  fastDelivery: string;
  fastDeliveryDesc: string;
  qualityGuarantee: string;
  qualityGuaranteeDesc: string;
  expertSupport: string;
  expertSupportDesc: string;
  joinCustomers: string;
  joinSub: string;
  signUpNow: string;
  allProductsLink: string;

  // Combo notification
  comboTitle: string;
  comboDesc: string;
  comboCondition: string;
  comboMinAmount: string;
  comboDiscount: string;
  comboPaySingle: string;
  comboApplied: string;
  comboNotYet: string;
  comboProgress: string;
  comboRemaining: string;

  // Footer
  shop: string;
  account: string;
  support: string;
  myAccount: string;
  orderStatus: string;
  shoppingCart: string;
  helpCenter: string;
  shippingInfo: string;
  returns: string;
  warranty: string;
  contactUs: string;

  // Misc
  save: string;
  addToCart: string;
  available: string;
  outOfStock: string;
  bestSeller: string;
  proGrade: string;
  ecoChoice: string;
  premium: string;
  valuePack: string;
  new: string;
  baitcaster: string;
  commercial: string;
  rideOn: string;
  batteryPower: string;
  tradeQuality: string;
  proChoice: string;
  newArrival: string;
  highTorque: string;
  workshop: string;
  sealed: string;
  flagship: string;
  gameFish: string;
  aussieMade: string;
  smartHome: string;
  clearance: string;
  new2: string;
  gameDay: string;
}

const translations: Record<Language, Translations> = {
  en: {
    searchPlaceholder: 'Search everything at AussieFarm',
    signIn: 'Sign In',
    createAccount: 'Create Account',
    home: 'Home',
    allProducts: 'All Products',
    topDeals: '🔥 Top Deals',
    cart: 'Cart',
    chainsaws: 'Chainsaws',
    chainsawsDesc: 'Professional & domestic chainsaws',
    mowers: 'Lawn Mowers',
    mowersDesc: 'Ride-on & push mowers',
    construction: 'Construction Tools',
    constructionDesc: 'Power & hand tools',
    electrical: 'Electronics',
    electricalDesc: 'Smart devices, gadgets & equipment',
    plumbing: 'Plumbing',
    plumbingDesc: 'Faucets, pipes & accessories',
    bicycles: 'Bicycles',
    bicyclesDesc: 'Mountain, road & city bikes',
    fishing: 'Fishing',
    fishingDesc: 'Rods, reels, lures & accessories',
    aircon: 'Air Conditioners',
    airconDesc: 'Split systems, inverters & portable AC units',
    comboTitle: 'Build a Combo & Get 15% Off',
    comboDesc: 'Add more items to your cart and unlock a 15% discount!',
    comboCondition: 'Condition:',
    comboMinAmount: 'Orders from $3,000',
    comboDiscount: '15% discount',
    comboPaySingle: 'Your order must be paid in a single payment',
    comboApplied: '🎉 15% discount applied to your cart!',
    comboNotYet: 'Add ${remaining} more to unlock 15% off',
    comboProgress: 'Progress',
    comboRemaining: 'Remaining',
    shopByCategory: 'Shop by Category',
    shopNow: 'Shop Now',
    dealOfTheDay: 'Deal of the Day',
    shopThisDeal: 'Shop This Deal',
    topDealsTitle: 'Top Deals',
    topDealsSub: 'Best prices on select equipment',
    viewAllDeals: 'View all deals',
    featuredProducts: 'Featured Products',
    featuredSub: 'Hand-picked by our team',
    shopAll: 'Shop all products',
    topRated: 'Top Rated',
    topRatedSub: 'Highest customer ratings',
    viewAll: 'View all',
    fastDelivery: 'Fast Delivery',
    fastDeliveryDesc: 'Free shipping on orders over $500 across Australia',
    qualityGuarantee: 'Quality Guarantee',
    qualityGuaranteeDesc: 'All products backed by manufacturer warranty',
    expertSupport: 'Expert Support',
    expertSupportDesc: 'Our team is here to help 7 days a week',
    joinCustomers: 'Join Thousands of Happy Customers',
    joinSub: 'Sign up today and get 10% off your first order',
    signUpNow: 'Sign Up Now',
    allProductsLink: 'All Products',
    shop: 'Shop',
    account: 'Account',
    support: 'Support',
    myAccount: 'My Account',
    orderStatus: 'Order Status',
    shoppingCart: 'Shopping Cart',
    helpCenter: 'Help Center',
    shippingInfo: 'Shipping Info',
    returns: 'Returns',
    warranty: 'Warranty',
    contactUs: 'Contact Us',
    save: 'Save',
    addToCart: 'Add to Cart',
    available: 'Available to ship',
    outOfStock: 'Out of Stock',
    bestSeller: 'Best Seller',
    proGrade: 'Pro Grade',
    ecoChoice: 'Eco Choice',
    premium: 'Premium',
    valuePack: 'Value Pack',
    new: 'New',
    baitcaster: 'Baitcaster',
    commercial: 'Commercial',
    rideOn: 'Ride-On',
    batteryPower: 'Battery Power',
    tradeQuality: 'Trade Quality',
    proChoice: 'Pro Choice',
    newArrival: 'New Arrival',
    highTorque: 'High Torque',
    workshop: 'Workshop',
    sealed: 'Sealed',
    flagship: 'Flagship',
    gameFish: 'Game Fish',
    aussieMade: 'Aussie Made',
    smartHome: 'Smart Home',
    clearance: 'Clearance',
    new2: 'New',
    gameDay: 'Game Day',
  },
  ru: {
    searchPlaceholder: 'Искать товары в AussieFarm',
    signIn: 'Войти',
    createAccount: 'Создать аккаунт',
    home: 'Главная',
    allProducts: 'Все товары',
    topDeals: '🔥 Акции',
    cart: 'Корзина',
    chainsaws: 'Бензопилы',
    chainsawsDesc: 'Профессиональные и бытовые бензопилы',
    mowers: 'Все для сада',
    mowersDesc: 'Садовые и профессиональные газонокосилки',
    construction: 'Строительные инструменты',
    constructionDesc: 'Электро- и ручные инструменты',
    electrical: 'Электроника',
    electricalDesc: 'Умные устройства, гаджеты и электрооборудование',
    plumbing: 'Сантехника',
    plumbingDesc: 'Смесители, трубы и аксессуары',
    bicycles: 'Велосипеды',
    bicyclesDesc: 'Горные, шоссейные и городские велосипеды',
    fishing: 'Рыбалка',
    fishingDesc: 'Удилища, катушки, приманки и аксессуары',
    aircon: 'Кондиционеры',
    airconDesc: 'Сплит-системы, инверторы и мобильные кондиционеры',
    comboTitle: 'Собери комбо и получи скидку 15%',
    comboDesc: 'Добавьте больше товаров в корзину и получите скидку 15%!',
    comboCondition: 'Условия:',
    comboMinAmount: 'Заказы от $3,000',
    comboDiscount: 'Скидка 15%',
    comboPaySingle: 'Ваш заказ должен быть оплачен одним платежом',
    comboApplied: '🎉 Скидка 15% применена к вашей корзинее!',
    comboNotYet: 'Добавьте ещё на ${remaining}, чтобы получить скидку 15%',
    comboProgress: 'Прогресс',
    comboRemaining: 'Осталось',
    shopByCategory: 'Покупайте по категориям',
    shopNow: 'Купить',
    dealOfTheDay: 'Товар дня',
    shopThisDeal: 'Купить со скидкой',
    topDealsTitle: 'Лучшие предложения',
    topDealsSub: 'Лучшие цены на избранные товары',
    viewAllDeals: 'Все акции',
    featuredProducts: 'Рекомендуемые товары',
    featuredSub: 'От подобрано нашей командой',
    shopAll: 'Все товары',
    topRated: 'Высокий рейтинг',
    topRatedSub: 'Лучшие оценки покупателей',
    viewAll: 'Смотреть все',
    fastDelivery: 'Быстрая доставка',
    fastDeliveryDesc: 'Бесплатная доставка по Австралии при заказе от $500',
    qualityGuarantee: 'Гарантия качества',
    qualityGuaranteeDesc: 'Все товары с гарантией производителя',
    expertSupport: 'Экспертная поддержка',
    expertSupportDesc: 'Наша команда на связи 7 дней в неделю',
    joinCustomers: 'Присоединяйтесь к тысячам довольных клиентов',
    joinSub: 'Зарегистрируйтесь сегодня и получите скидку 10% на первый заказ',
    signUpNow: 'Зарегистрироваться',
    allProductsLink: 'Все товары',
    shop: 'Магазин',
    account: 'Аккаунт',
    support: 'Поддержка',
    myAccount: 'Мой аккаунт',
    orderStatus: 'Статус заказа',
    shoppingCart: 'Корзина',
    helpCenter: 'Центр помощи',
    shippingInfo: 'Доставка',
    returns: 'Возврат',
    warranty: 'Гарантия',
    contactUs: 'Контакты',
    save: 'Экономия',
    addToCart: 'В корзину',
    available: 'Доступно к отправке',
    outOfStock: 'Нет в наличии',
    bestSeller: 'Хит продаж',
    proGrade: 'Профессиональный',
    ecoChoice: 'Эко-вариант',
    premium: 'Премиум',
    valuePack: 'Выгодный набор',
    new: 'Новинка',
    baitcaster: 'Мультипликатор',
    commercial: 'Коммерческий',
    rideOn: 'Райдер',
    batteryPower: 'Аккумуляторный',
    tradeQuality: 'Торговое качество',
    proChoice: 'Выбор профи',
    newArrival: 'Новое поступление',
    highTorque: 'Высокий крутящий момент',
    workshop: 'Мастерская',
    sealed: 'Герметичный',
    flagship: 'Флагман',
    gameFish: 'Трофейная рыба',
    aussieMade: 'Сделано в Австралии',
    smartHome: 'Умный дом',
    clearance: 'Распродажа',
    new2: 'Новинка',
    gameDay: 'День игры',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('ru');

  useEffect(() => {
    const saved = localStorage.getItem('language') as Language | null;
    if (saved && (saved === 'ru' || saved === 'en')) {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
