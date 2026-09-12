'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const translations = {
  en: {
    nav: {
      home: 'Home',
      menu: 'Menu',
      reservation: 'Reservation',
      about: 'About',
      admin: 'Admin',
      reserveTable: 'Reserve Table',
    },
    hero: {
      tag: 'Luxury Fine Dining & Events',
      welcome: 'Welcome to Diamond C',
      tagline: "Excellence beyond all expectations...",
      subtitle: 'Indulge in Cameroon’s finest gastronomic delicacies and continental haute cuisine within a prestigious, gold-kissed ambience in Bamenda.',
      viewMenu: 'Explore Daily Menu',
      reserveTable: 'Book a Table',
      signatureNotice: 'Bamenda • North West Region, Cameroon',
    },
    story: {
      tag: 'Our Heritage',
      title: 'The Diamond C Story',
      subtitle: 'Where culinary tradition meets contemporary royal luxury.',
      p1: 'Founded with a passion for transcendent culinary artistry, Diamond C stands as Bamenda’s premier sanctuary for discerning diners. We celebrate the deep heritage of Cameroonian gastronomy—from the royal bowls of Achu and rich wild-leaf Eru to flame-charred Kati Kati and grilled sea delicacies.',
      p2: 'Every creation is prepared using hand-selected indigenous spices, fresh mountain farm ingredients, and modern haute-cuisine plating inspired by five-star global gastronomy.',
      p3: 'Whether celebrating in our gilded VIP Lounge, hosting executive summits in our private salon, or enjoying a romantic candlelit dinner, Diamond C promises an atmosphere steeped in warmth, prestige, and unrivaled taste.',
      quote: "L'excellence au-delà de toute attente...",
      readMore: 'Discover Our Private Lounge',
      vipLounge: 'Exclusive VIP Wine & Cigar Lounge',
    },
    menu: {
      title: 'Our Weekly Culinary Collection',
      subtitle: 'Organized day by day. Every day at Diamond C unveils freshly prepared authentic Cameroonian specialties and chef signature creations.',
      allDays: 'All Days',
      todaySpecial: "Today's Specials",
      availableOn: 'Served on:',
      orderWhatsApp: 'Order on WhatsApp',
      inStock: 'Available Today',
      soldOut: 'Sold Out',
      categoryAll: 'All Categories',
      categoryCameroonian: 'Traditional Delicacies',
      categoryContinental: 'Chef Specialties',
      categoryBeverages: 'Royal Cellar & Cocktails',
      searchPlaceholder: 'Search dishes, ingredients...',
      noDishesFound: 'No dishes found for this selection.',
      scrollHint: 'Swipe or scroll horizontally to explore',
    },
    reservation: {
      title: 'Table Reservation',
      subtitle: 'Reserve your dining experience at Diamond C. For VIP dining, intimate celebrations, and executive private tables.',
      fullName: 'Full Name',
      namePlaceholder: 'e.g. Roland Fomuki',
      phoneNumber: 'WhatsApp / Phone Number',
      phonePlaceholder: '+237 6XX XXX XXX',
      guests: 'Number of Guests',
      guestsPlaceholder: 'Select party size',
      guest1: '1 Guest (Solo Dining)',
      guest2: '2 Guests (Romantic / Couple)',
      guest4: '3 - 4 Guests (Family / Friends)',
      guestVIP: '5 - 8 Guests (VIP Lounge)',
      guestEvent: '9+ Guests (Private Event)',
      tablePreference: 'Table Preference',
      prefIndoor: 'Main Luxury Dining Hall',
      prefVIP: 'Royal VIP Wine & Dining Lounge',
      prefTerrace: 'Outdoor Terrace & Courtyard',
      prefExecutive: 'Private Executive Suite',
      dateTime: 'Date & Time',
      notes: 'Special Requests / Occasion (Optional)',
      notesPlaceholder: 'Anniversary, birthday cake, champagne on ice, dietary restrictions...',
      submitButton: 'Confirm via WhatsApp',
      redirectNotice: 'Instant Confirmation: Your reservation details will be sent directly to our VIP Concierge on WhatsApp.',
      directCall: 'Need immediate assistance?',
      callNumber: '+237 600 000 000',
    },
    about: {
      tag: 'About Us',
      title: 'Elevating Dining to an Art Form',
      subtitle: 'Diamond C is more than a restaurant—it is a sanctuary of refined taste, exquisite Cameroonian heritage, and royal hospitality.',
      chefTitle: 'Master Craft & Local Heritage',
      chefText: 'Our master chefs blend ancestral spice wisdom with refined culinary technique. From the volcanic soil spices of the North West to fresh Atlantic sea harvests, every plate honors Cameroon’s rich culinary legacy.',
      eventTitle: 'Events & Private Celebrations',
      eventText: 'Diamond C Event space is tailored for weddings, corporate galas, private banquets, and milestone anniversaries with bespoke catering and attentive white-glove service.',
      locationTitle: 'Find Us in Bamenda',
      locationText: 'Commercial Avenue & Up-Station vicinity, Bamenda, North West Region, Cameroon.',
      hoursTitle: 'Hours of Service',
      hoursText: 'Monday to Sunday: 8:00 AM – 11:00 PM',
    },
    footer: {
      headline: 'Visit Diamond C',
      tagline: "L'excellence au-delà de toute attente...",
      description: 'Cameroon’s premier luxury dining venue, offering unforgettable culinary experiences, VIP hospitality, and celebratory event hosting in Bamenda.',
      quickLinks: 'Quick Links',
      hoursTitle: 'Opening Hours',
      hoursDaily: 'Monday – Sunday: 8:00 AM – 11:00 PM',
      kitchenCloses: 'Kitchen last orders at 10:30 PM',
      contactTitle: 'Contact & Location',
      address: 'Bamenda, North West Region, Cameroon',
      phone: '+237 600 000 000',
      whatsapp: 'WhatsApp: +237 600 000 000',
      email: 'reservations@diamondc.cm',
      allRights: 'All rights reserved. Diamond C & Diamond C Event.',
    },
    admin: {
      title: 'Diamond C Admin Portal',
      loginTitle: 'Manager Authentication',
      loginSubtitle: 'Enter credentials to manage Diamond C menu and inventory',
      username: 'Username',
      password: 'Password',
      signIn: 'Sign In to Dashboard',
      dashboardTitle: 'Menu Management System',
      addNewDish: 'Add New Food Item',
      totalDishes: 'Total Dishes',
      activeToday: 'Active Today',
      inStockCount: 'In Stock',
      soldOutCount: 'Sold Out',
      searchDishes: 'Filter by dish name...',
      tableName: 'Dish & Photo',
      tablePrice: 'Price (XAF)',
      tableDays: 'Active Days',
      tableStock: 'Availability',
      tableActions: 'Actions',
      edit: 'Edit',
      delete: 'Delete',
      confirmDelete: 'Are you sure you want to delete this dish?',
      markAvailable: 'In Stock',
      markSoldOut: 'Sold Out',
      backToSite: 'View Live Website',
      logout: 'Log Out',
    }
  },
  fr: {
    nav: {
      home: 'Accueil',
      menu: 'Menu',
      reservation: 'Réservation',
      about: 'À Propos',
      admin: 'Admin',
      reserveTable: 'Réserver une table',
    },
    hero: {
      tag: 'Haute Gastronomie & Événements',
      welcome: 'Bienvenue chez Diamond C',
      tagline: "L'excellence au-delà de toute attente...",
      subtitle: 'Dégustez les mets les plus raffinés du terroir camerounais et une cuisine continentale d’exception dans un cadre royal et doré à Bamenda.',
      viewMenu: 'Découvrir le Menu Quotidien',
      reserveTable: 'Réserver une Table',
      signatureNotice: 'Bamenda • Région du Nord-Ouest, Cameroun',
    },
    story: {
      tag: 'Notre Histoire',
      title: "L'Histoire de Diamond C",
      subtitle: 'Quand tradition culinaire rencontre le luxe contemporain.',
      p1: "Né d'une passion pour l'art gastronomique d'exception, Diamond C s'impose comme l'adresse prestigieuse incontournable de Bamenda. Nous magnifions l'héritage de la cuisine camerounaise—du noble Achu au jaune d'or étincelant, à l'authentique Eru aux feuilles sauvages, en passant par le poulet Kati Kati et nos poissons braisés parfumés.",
      p2: "Chaque recette est élaborée à partir d'épices du terroir soigneusement sélectionnées, de produits frais des hautes terres et d'un dressage digne des plus grandes tables étoilées.",
      p3: 'Que ce soit pour un grand cru dans notre Salon VIP feutré, un déjeuner d’affaires ou un dîner romantique aux chandelles, Diamond C vous accueille dans une atmosphère de prestige, de convivialité et d’élégance.',
      quote: "L'excellence au-delà de toute attente...",
      readMore: 'Découvrir notre Salon VIP',
      vipLounge: 'Lounge VIP Exclusif Vins & Cigares',
    },
    menu: {
      title: 'Notre Carte Gourmande de la Semaine',
      subtitle: 'Organisé jour par jour. Chaque jour chez Diamond C dévoile des créations fraîches du chef et des trésors de la gastronomie camerounaise.',
      allDays: 'Tous les jours',
      todaySpecial: "Spécialités d'Aujourd'hui",
      availableOn: 'Disponible le :',
      orderWhatsApp: 'Commander sur WhatsApp',
      inStock: 'En Stock',
      soldOut: 'Épuisé',
      categoryAll: 'Toutes les catégories',
      categoryCameroonian: 'Mets Traditionnels',
      categoryContinental: 'Spécialités du Chef',
      categoryBeverages: 'Cave Royale & Cocktails',
      searchPlaceholder: 'Rechercher un plat, ingrédient...',
      noDishesFound: 'Aucun plat trouvé pour cette sélection.',
      scrollHint: 'Faites glisser horizontalement pour explorer',
    },
    reservation: {
      title: 'Réservation de Table',
      subtitle: 'Réservez votre table chez Diamond C. Idéal pour dîners VIP, célébrations privées et rendez-vous d’affaires.',
      fullName: 'Nom Complet',
      namePlaceholder: 'ex. Roland Fomuki',
      phoneNumber: 'Numéro WhatsApp / Téléphone',
      phonePlaceholder: '+237 6XX XXX XXX',
      guests: 'Nombre de Personnes',
      guestsPlaceholder: 'Sélectionnez le nombre de convives',
      guest1: '1 Personne (En solo)',
      guest2: '2 Personnes (Romantique / Couple)',
      guest4: '3 - 4 Personnes (Famille / Amis)',
      guestVIP: '5 - 8 Personnes (Salon VIP)',
      guestEvent: '9+ Personnes (Événement Privé)',
      tablePreference: 'Préférence de Table',
      prefIndoor: 'Salle Principale de Prestige',
      prefVIP: 'Salon VIP Privilège & Vins',
      prefTerrace: 'Terrasse Extérieure & Jardin',
      prefExecutive: 'Suite Executive Privée',
      dateTime: 'Date & Heure',
      notes: 'Demandes Particulières / Occasion (Optionnel)',
      notesPlaceholder: 'Anniversaire, gâteau surprise, champagne au frais, allergies...',
      submitButton: 'Confirmer sur WhatsApp',
      redirectNotice: 'Confirmation instantanée : vos détails de réservation sont transmis directement à notre conciergerie WhatsApp.',
      directCall: 'Assistance directe par téléphone ?',
      callNumber: '+237 600 000 000',
    },
    about: {
      tag: 'À Propos',
      title: "Quand la Table Devient un Art",
      subtitle: 'Diamond C est bien plus qu’un restaurant : une célébration de l’art de vivre, du patrimoine culinaire camerounais et du luxe authentique.',
      chefTitle: 'Savoir-Faire & Terroir Ancestral',
      chefText: 'Nos maîtres queux marient la puissance des aromates des monts du Cameroun aux techniques modernes de la haute cuisine. Chaque bouchée est un hommage vibrant à nos traditions.',
      eventTitle: 'Événements & Réceptions Privées',
      eventText: 'Diamond C Event accueille vos mariages de rêve, dîners d’affaires, banquets et soirées de gala avec un service irréprochable et des menus gastronomiques personnalisés.',
      locationTitle: 'Notre Emplacement à Bamenda',
      locationText: 'Avenue Commerciale et secteur Up-Station, Bamenda, Région du Nord-Ouest, Cameroun.',
      hoursTitle: 'Horaires d’Ouverture',
      hoursText: 'Lundi au Dimanche : 08h00 – 23h00',
    },
    footer: {
      headline: 'Rendez-vous chez Diamond C',
      tagline: "L'excellence au-delà de toute attente...",
      description: 'Le haut lieu de la gastronomie et de l’événementiel à Bamenda, alliant saveurs authentiques, service de prestige et accueil chaleureux.',
      quickLinks: 'Accès Rapide',
      hoursTitle: 'Horaires d’Ouverture',
      hoursDaily: 'Lundi – Dimanche : 08h00 – 23h00',
      kitchenCloses: 'Dernière commande en cuisine à 22h30',
      contactTitle: 'Contact & Localisation',
      address: 'Bamenda, Région du Nord-Ouest, Cameroun',
      phone: '+237 600 000 000',
      whatsapp: 'WhatsApp : +237 600 000 000',
      email: 'reservations@diamondc.cm',
      allRights: 'Tous droits réservés. Diamond C & Diamond C Event.',
    },
    admin: {
      title: 'Portail Administrateur Diamond C',
      loginTitle: 'Authentification Gestionnaire',
      loginSubtitle: 'Connectez-vous pour gérer les menus et la disponibilité',
      username: 'Nom d’utilisateur',
      password: 'Mot de passe',
      signIn: 'Se connecter au tableau de bord',
      dashboardTitle: 'Gestion du Menu Diamond C',
      addNewDish: 'Ajouter un Nouveau Plat',
      totalDishes: 'Total Plats',
      activeToday: 'Actifs Aujourd’hui',
      inStockCount: 'En Stock',
      soldOutCount: 'Épuisés',
      searchDishes: 'Filtrer par nom de plat...',
      tableName: 'Plat & Photo',
      tablePrice: 'Prix (FCFA)',
      tableDays: 'Jours Actifs',
      tableStock: 'Disponibilité',
      tableActions: 'Actions',
      edit: 'Modifier',
      delete: 'Supprimer',
      confirmDelete: 'Êtes-vous sûr de vouloir supprimer ce plat ?',
      markAvailable: 'En Stock',
      markSoldOut: 'Épuisé',
      backToSite: 'Voir le Site en Direct',
      logout: 'Déconnexion',
    }
  }
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en');

  useEffect(() => {
    const savedLang = localStorage.getItem('diamond_c_lang');
    if (savedLang === 'fr' || savedLang === 'en') {
      setLang(savedLang);
    }
  }, []);

  const switchLanguage = (newLang) => {
    setLang(newLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('diamond_c_lang', newLang);
    }
  };

  const t = translations[lang] || translations.en;

  return (
    <LanguageContext.Provider value={{ lang, setLang: switchLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
