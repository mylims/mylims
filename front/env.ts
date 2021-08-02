if (!import.meta.env.VITE_PUBLIC_API_URL) {
  throw new Error('Missing environment variable: VITE_PUBLIC_API_URL');
}

export const API_URL = import.meta.env.VITE_PUBLIC_API_URL as string;
