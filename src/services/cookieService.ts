// Cookie service for managing browser cookies
export interface CookieOptions {
  expires?: Date | number; // Date object or days from now
  path?: string;
  domain?: string;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
  httpOnly?: boolean;
}

class CookieService {
  // Set a cookie
  set(name: string, value: string, options: CookieOptions = {}): void {
    let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

    if (options.expires) {
      let expires: Date;
      if (typeof options.expires === 'number') {
        expires = new Date();
        expires.setTime(expires.getTime() + options.expires * 24 * 60 * 60 * 1000);
      } else {
        expires = options.expires;
      }
      cookieString += `; expires=${expires.toUTCString()}`;
    }

    if (options.path) {
      cookieString += `; path=${options.path}`;
    }

    if (options.domain) {
      cookieString += `; domain=${options.domain}`;
    }

    if (options.secure) {
      cookieString += '; secure';
    }

    if (options.sameSite) {
      cookieString += `; samesite=${options.sameSite}`;
    }

    if (options.httpOnly) {
      cookieString += '; httponly';
    }

    document.cookie = cookieString;
  }

  // Get a cookie value
  get(name: string): string | null {
    const nameEQ = encodeURIComponent(name) + '=';
    const cookies = document.cookie.split(';');

    for (let cookie of cookies) {
      let c = cookie.trim();
      if (c.indexOf(nameEQ) === 0) {
        return decodeURIComponent(c.substring(nameEQ.length));
      }
    }
    return null;
  }

  // Get all cookies as an object
  getAll(): Record<string, string> {
    const cookies: Record<string, string> = {};
    const cookieArray = document.cookie.split(';');

    for (let cookie of cookieArray) {
      const [name, value] = cookie.trim().split('=');
      if (name && value) {
        cookies[decodeURIComponent(name)] = decodeURIComponent(value);
      }
    }

    return cookies;
  }

  // Remove a cookie
  remove(name: string, options: Pick<CookieOptions, 'path' | 'domain'> = {}): void {
    this.set(name, '', {
      ...options,
      expires: new Date(0)
    });
  }

  // Check if a cookie exists
  exists(name: string): boolean {
    return this.get(name) !== null;
  }

  // Set a JSON cookie
  setJSON<T>(name: string, value: T, options: CookieOptions = {}): void {
    try {
      this.set(name, JSON.stringify(value), options);
    } catch (error) {
      console.warn('Failed to set JSON cookie:', error);
    }
  }

  // Get a JSON cookie
  getJSON<T>(name: string): T | null {
    try {
      const value = this.get(name);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.warn('Failed to parse JSON cookie:', error);
      return null;
    }
  }

  // Clear all cookies (for current domain and path)
  clearAll(): void {
    const cookies = this.getAll();
    Object.keys(cookies).forEach(name => {
      this.remove(name);
    });
  }

  // Get cookie size in bytes
  getSize(): number {
    return new Blob([document.cookie]).size;
  }

  // Check if cookies are enabled
  isEnabled(): boolean {
    try {
      this.set('test_cookie', 'test');
      const enabled = this.get('test_cookie') === 'test';
      this.remove('test_cookie');
      return enabled;
    } catch (error) {
      return false;
    }
  }
}

// Create singleton instance
export const cookieService = new CookieService();

// Cookie key constants
export const COOKIE_KEYS = {
  CART: 'adams_cart',
  USER_PREFERENCES: 'adams_user_prefs',
  SESSION_ID: 'adams_session_id',
  THEME: 'adams_theme',
  LANGUAGE: 'adams_language',
  RECENT_VIEWS: 'adams_recent_views',
  WISHLIST: 'adams_wishlist'
} as const;

// Default cookie options
export const COOKIE_OPTIONS = {
  CART: { expires: 30, path: '/', secure: true, sameSite: 'lax' as const },
  USER_PREFERENCES: { expires: 365, path: '/', secure: true, sameSite: 'lax' as const },
  SESSION_ID: { expires: 1, path: '/', secure: true, sameSite: 'strict' as const },
  THEME: { expires: 365, path: '/', secure: true, sameSite: 'lax' as const },
  LANGUAGE: { expires: 365, path: '/', secure: true, sameSite: 'lax' as const },
  RECENT_VIEWS: { expires: 7, path: '/', secure: true, sameSite: 'lax' as const },
  WISHLIST: { expires: 30, path: '/', secure: true, sameSite: 'lax' as const }
} as const;
