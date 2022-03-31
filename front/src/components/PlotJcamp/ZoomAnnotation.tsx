import React from 'react';
import { useRectangularZoom } from 'react-plot';

export function ZoomAnnotation() {
  const rectangularZoom = useRectangularZoom();
  return <>{rectangularZoom.annotations}</>;
}
