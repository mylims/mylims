import React, { createContext, useContext, useMemo } from 'react';

interface ImageContextType {
  fetchImage?: (uuid: string) => string;
}
export const ImageContext = createContext<ImageContextType>({});

interface ImageProps {
  uuid: string;
  alt?: string;
}
export function Image({ uuid, alt }: ImageProps) {
  const { fetchImage } = useContext(ImageContext);
  const imageUrl = useMemo(() => fetchImage?.(uuid), [fetchImage, uuid]);

  if (!imageUrl) return <div>Error: image url not provided</div>;
  return <img src={imageUrl} alt={alt} />;
}
