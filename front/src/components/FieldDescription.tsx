import React, { CSSProperties, ReactNode } from 'react';

interface FieldDescriptionProps {
  title: string;
  titleStyle?: CSSProperties;
  children: ReactNode;
}

export default function FieldDescription({
  title,
  titleStyle,
  children,
}: FieldDescriptionProps) {
  return (
    <div>
      <div className="font-medium" style={titleStyle}>
        {title}
      </div>
      <div className="text-neutral-500">{children}</div>
    </div>
  );
}
