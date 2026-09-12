import { NextResponse } from 'next/server';
import { initialMenuData } from '@/data/initialMenuData';

// In-memory cache for API requests during runtime
let memoryMenu = [...initialMenuData];

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const day = searchParams.get('day');
  const category = searchParams.get('category');

  let filtered = [...memoryMenu];

  if (day && day !== 'All') {
    filtered = filtered.filter((item) => item.days && item.days.includes(day));
  }

  if (category && category !== 'all') {
    filtered = filtered.filter((item) => item.category === category);
  }

  return NextResponse.json({ success: true, count: filtered.length, data: filtered });
}

export async function POST(request) {
  try {
    const body = await request.json();

    if (!body.name || !body.price) {
      return NextResponse.json(
        { success: false, message: 'Name and price are required' },
        { status: 400 }
      );
    }

    const newItem = {
      id: body.id || `dish-${Date.now()}`,
      name: body.name,
      nameFr: body.nameFr || body.name,
      category: body.category || 'cameroonian',
      price: body.price,
      description: body.description || '',
      descriptionFr: body.descriptionFr || body.description || '',
      image: body.image || '/images/placeholder-food.jpg',
      days: Array.isArray(body.days) && body.days.length > 0 ? body.days : ['Monday'],
      inStock: body.inStock !== false,
      isSignature: Boolean(body.isSignature),
      badge: body.badge || '',
      badgeFr: body.badgeFr || body.badge || '',
    };

    memoryMenu.unshift(newItem);

    return NextResponse.json({ success: true, data: newItem }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to create menu item' },
      { status: 500 }
    );
  }
}
