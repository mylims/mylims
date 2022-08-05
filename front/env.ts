if (!import.meta.env.VITE_PUBLIC_API_URL) {
  throw new Error('Missing environment variable: VITE_PUBLIC_API_URL');
}
if (!import.meta.env.VITE_PUBLIC_LOGO) {
  throw new Error('Missing environment variable: VITE_PUBLIC_LOGO');
}

export const API_URL = import.meta.env.VITE_PUBLIC_API_URL as string;
export const LOGO = import.meta.env.VITE_PUBLIC_LOGO as string;
export const IMAGE_URL = import.meta.env.VITE_PUBLIC_IMAGE as string;
