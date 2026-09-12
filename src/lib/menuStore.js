import { initialMenuData } from '@/data/initialMenuData';

const STORAGE_KEY = 'diamond_c_menu_items_v1';

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
    return JSON.parse(stored);
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
