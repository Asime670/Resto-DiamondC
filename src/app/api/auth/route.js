import { NextResponse } from 'next/server';

const ADMIN_USER = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASSWORD || 'diamond2026';

export async function POST(request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (username === ADMIN_USER && password === ADMIN_PASS) {
      return NextResponse.json({
        success: true,
        user: { username: ADMIN_USER, role: 'admin' },
        message: 'Authentication successful',
      });
    }

    return NextResponse.json(
      { success: false, message: 'Invalid username or password' },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Server authentication error' },
      { status: 500 }
    );
  }
}
