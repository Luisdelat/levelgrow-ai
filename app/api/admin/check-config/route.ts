import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const dbUrl = process.env.DATABASE_URL;
  const hasDbUrl = !!dbUrl;
  const dbUrlPreview = dbUrl ? dbUrl.substring(0, 50) + '...' : 'NOT SET';

  return NextResponse.json({
    env_check: {
      DATABASE_URL: {
        is_set: hasDbUrl,
        preview: dbUrlPreview,
        length: dbUrl?.length || 0
      },
      NODE_ENV: process.env.NODE_ENV,
      ADMIN_INIT_TOKEN: {
        is_set: !!process.env.ADMIN_INIT_TOKEN,
        value: process.env.ADMIN_INIT_TOKEN || 'using default'
      }
    },
    timestamp: new Date().toISOString()
  });
}
