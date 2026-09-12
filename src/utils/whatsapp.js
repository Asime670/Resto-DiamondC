// Diamond C WhatsApp Integration Utility

export const DEFAULT_PHONE = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "237600000000";

/**
 * Generates a pre-filled WhatsApp URL for food ordering
 * @param {Object} dish - Dish object containing name, price, etc.
 * @param {string} lang - 'en' or 'fr'
 * @param {string} phone - WhatsApp phone number with country code
 * @returns {string} WhatsApp URL
 */
export function getFoodOrderUrl(dish, lang = 'en', phone = DEFAULT_PHONE) {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const dishName = typeof dish === 'string' ? dish : (lang === 'fr' ? (dish.nameFr || dish.name) : dish.name);
  const dishPrice = typeof dish === 'object' && dish.price ? dish.price : '';

  let message = '';
  if (lang === 'fr') {
    message = `Bonjour Diamond C ! Je souhaite commander : *${dishName}*${dishPrice ? ` (Prix: ${dishPrice})` : ''}.`;
  } else {
    message = `Hello Diamond C! I would like to order: *${dishName}*${dishPrice ? ` (Price: ${dishPrice})` : ''}.`;
  }

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * Generates a pre-filled WhatsApp URL for table reservation
 * @param {Object} reservation - Reservation details object
 * @param {string} lang - 'en' or 'fr'
 * @param {string} phone - WhatsApp phone number with country code
 * @returns {string} WhatsApp URL
 */
export function getReservationUrl(reservation, lang = 'en', phone = DEFAULT_PHONE) {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const { name, phone: guestPhone, guests, preference, dateTime, notes } = reservation;

  let message = '';
  if (lang === 'fr') {
    message = `Bonjour Diamond C ! Je souhaite réserver une table :
- *Nom :* ${name || 'N/A'}
- *Téléphone :* ${guestPhone || 'N/A'}
- *Invités :* ${guests || '1 personne'}
- *Préférence de table :* ${preference || 'Standard'}
- *Date & Heure :* ${dateTime || 'N/A'}${notes ? `\n- *Notes particulières :* ${notes}` : ''}`;
  } else {
    message = `Hello Diamond C! I would like to make a table reservation:
- *Name:* ${name || 'N/A'}
- *Phone:* ${guestPhone || 'N/A'}
- *Guests:* ${guests || '1 person'}
- *Table Preference:* ${preference || 'Standard'}
- *Date & Time:* ${dateTime || 'N/A'}${notes ? `\n- *Special Notes:* ${notes}` : ''}`;
  }

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
