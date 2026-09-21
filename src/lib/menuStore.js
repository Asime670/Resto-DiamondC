import { initialMenuData } from '@/data/initialMenuData';
import { DAYS_OF_WEEK } from '@/utils/days';

const STORAGE_KEY = 'diamond_c_menu_items_v2';

export function getMenuItems() {
  if (typeof window === 'undefined') {
    return initialMenuData;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialMenuData));
      return initialMenuData;
    }
    const parsed = JSON.parse(stored);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialMenuData));
    return initialMenuData;
  } catch (e) {
    console.error('Error loading menu items:', e);
    return initialMenuData;
  }
}

export function saveMenuItems(items) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event('menu_updated'));
  } catch (e) {
    console.error('Error saving menu items:', e);
  }
}

export function getMenuItemById(id) {
  const items = getMenuItems();
  return items.find((item) => item.id === id) || null;
}

export function createMenuItem(newItem) {
  const items = getMenuItems();
  const itemWithId = {
    ...newItem,
    id: newItem.id || `dish-${Date.now()}`,
    inStock: newItem.inStock !== false,
    days: Array.isArray(newItem.days) && newItem.days.length > 0 ? newItem.days : DAYS_OF_WEEK,
  };
  const updated = [itemWithId, ...items];
  saveMenuItems(updated);
  return itemWithId;
}

export function updateMenuItem(id, updates) {
  const items = getMenuItems();
  const updated = items.map((item) => {
    if (item.id === id) {
      return { ...item, ...updates };
    }
    return item;
  });
  saveMenuItems(updated);
  return updated.find((i) => i.id === id);
}

export function deleteMenuItem(id) {
  const items = getMenuItems();
  const updated = items.filter((item) => item.id !== id);
  saveMenuItems(updated);
  return true;
}

export function toggleItemStock(id) {
  const items = getMenuItems();
  const updated = items.map((item) => {
    if (item.id === id) {
      return { ...item, inStock: !item.inStock };
    }
    return item;
  });
  saveMenuItems(updated);
  return updated.find((i) => i.id === id);
}

export function resetMenuToDefaults() {
  saveMenuItems(initialMenuData);
  return initialMenuData;
}
