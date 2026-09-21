// Diamond C WhatsApp Integration Utility

export const DEFAULT_PHONE = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "237670199859";

/**
 * Generates a pre-filled WhatsApp URL for food ordering
 * Format: "Hello Diamond C! I would like to order: *[Dish Name]* (Price: [Price])."
 * 
 * @param {Object|string} dish - Dish object or dish name
 * @param {string} lang - 'en' or 'fr'
 * @param {string} phone - WhatsApp phone number with country code (defaults to 237670199859)
 * @returns {string} Encoded WhatsApp URL
 */
export function getFoodOrderUrl(dish, lang = 'en', phone = DEFAULT_PHONE) {
  const cleanPhone = String(phone).replace(/[^0-9]/g, '');
  const dishName = typeof dish === 'string' 
    ? dish 
    : (lang === 'fr' ? (dish.nameFr || dish.name) : dish.name);
  const dishPrice = typeof dish === 'object' && dish.price ? dish.price : '';

  let message = '';
  if (lang === 'fr') {
    message = `Bonjour Diamond C ! Je souhaite commander : *${dishName}* (Prix: ${dishPrice}).`;
  } else {
    message = `Hello Diamond C! I would like to order: *${dishName}* (Price: ${dishPrice}).`;
  }

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * Generates a pre-filled WhatsApp URL for table reservation
 * Format:
 * "Hello Diamond C! I would like to make a table reservation:
 *  - *Name:* [Name]
 *  - *Phone:* [Phone]
 *  - *Guests:* [Number of persons]
 *  - *Date & Time:* [Date & Time]"
 * 
 * @param {Object} reservation - Reservation details
 * @param {string} lang - 'en' or 'fr'
 * @param {string} phone - WhatsApp phone number with country code (defaults to 237670199859)
 * @returns {string} Encoded WhatsApp URL
 */
export function getReservationUrl(reservation, lang = 'en', phone = DEFAULT_PHONE) {
  const cleanPhone = String(phone).replace(/[^0-9]/g, '');
  const { name, phone: guestPhone, guests, dateTime, notes } = reservation || {};

  let message = '';
  if (lang === 'fr') {
    message = `Bonjour Diamond C ! Je souhaite réserver une table :
- *Nom :* ${name || 'N/A'}
- *Téléphone :* ${guestPhone || 'N/A'}
- *Invités :* ${guests || '1 personne'}
- *Date & Heure :* ${dateTime || 'N/A'}${notes ? `\n- *Notes particulières :* ${notes}` : ''}`;
  } else {
    message = `Hello Diamond C! I would like to make a table reservation:
- *Name:* ${name || 'N/A'}
- *Phone:* ${guestPhone || 'N/A'}
- *Guests:* ${guests || '1 person'}
- *Date & Time:* ${dateTime || 'N/A'}${notes ? `\n- *Special Notes:* ${notes}` : ''}`;
  }

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * Generates a pre-filled WhatsApp URL for a multi-item cart order.
 * Each cartItem = { dish: Object, quantity: number }
 *
 * @param {Array} cartItems - Array of { dish, quantity }
 * @param {string} lang - 'en' or 'fr'
 * @param {string} phone - WhatsApp phone number (defaults to DEFAULT_PHONE)
 * @returns {string} Encoded WhatsApp URL
 */
export function getCartOrderUrl(cartItems, lang = 'en', phone = DEFAULT_PHONE) {
  const cleanPhone = String(phone).replace(/[^0-9]/g, '');

  const lines = cartItems.map(({ dish, quantity }) => {
    const name = lang === 'fr' ? (dish.nameFr || dish.name) : dish.name;
    const price = dish.price || '';
    return `  • *${name}* x${quantity} — ${price}`;
  });

  let message = '';
  if (lang === 'fr') {
    message = `Bonjour Diamond C ! Je souhaite passer la commande suivante :\n${lines.join('\n')}\n\nMerci de confirmer ma commande.`;
  } else {
    message = `Hello Diamond C! I would like to place the following order:\n${lines.join('\n')}\n\nPlease confirm my order. Thank you!`;
  }

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
