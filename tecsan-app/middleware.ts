import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isAccessTokenExpired } from '@/utils/auth'; 

export default async function middleware(request: NextRequest) {
  const refreshToken = request.cookies.get("refreshToken")?.value;

  const checkTokenValidity = (token: string | undefined) => {
    if (!token) return false;
    return !isAccessTokenExpired(token);
  };

  if (request.nextUrl.pathname === '/' && refreshToken && checkTokenValidity(refreshToken)) {
    return NextResponse.redirect(new URL('/pages/home', request.url));
  }

  if (request.nextUrl.pathname !== '/' && (!refreshToken || !checkTokenValidity(refreshToken))) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/pages/:path*', '/'],
};
