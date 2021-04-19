if (!process.env.NEXT_PUBLIC_API_URL) {
  throw new Error('Missing environment variable: NEXT_PUBLIC_API_URL');
}

export const API_URL: string = process.env.NEXT_PUBLIC_API_URL;
