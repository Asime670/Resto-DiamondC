import { NextResponse } from 'next/server';
import { initialMenuData } from '@/data/initialMenuData';

let memoryMenu = [...initialMenuData];

export async function GET(request, { params }) {
  const { id } = await params;
  const item = memoryMenu.find((d) => d.id === id);

  if (!item) {
    return NextResponse.json({ success: false, message: 'Item not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: item });
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();

    const index = memoryMenu.findIndex((d) => d.id === id);
    if (index === -1) {
      return NextResponse.json({ success: false, message: 'Item not found' }, { status: 404 });
    }

    memoryMenu[index] = {
      ...memoryMenu[index],
      ...body,
      id, // ensure ID cannot be corrupted
    };

    return NextResponse.json({ success: true, data: memoryMenu[index] });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to update item' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const initialLength = memoryMenu.length;
    memoryMenu = memoryMenu.filter((d) => d.id !== id);

    if (memoryMenu.length === initialLength) {
      return NextResponse.json({ success: false, message: 'Item not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Item deleted successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to delete item' }, { status: 500 });
  }
}
