import * as React from 'react';
interface SVGRProps {
  title?: string;
  titleId?: string;
}

function SvgOutlineMenuAlt1({
  title,
  titleId,
  ...props
}: React.SVGProps<SVGSVGElement> & SVGRProps) {
  return (
    <svg
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-labelledby={titleId}
      {...props}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 6h16M4 12h8m-8 6h16"
      />
    </svg>
  );
}

export default SvgOutlineMenuAlt1;
