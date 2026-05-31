import React from 'react';

const logoSrc = 'https://i.ibb.co/ycR5pts9/Vetorizada.png';

interface DecolarLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function DecolarLogo({ className = '', size = 'md' }: DecolarLogoProps) {
  // Map size to larger, responsive dimension classes - extra big and prominent
  const sizeClasses = {
    sm: 'h-14 sm:h-16 w-auto max-w-full',
    md: 'h-22 sm:h-24 w-auto max-w-full scale-110 origin-center',  // Scaled up for custom prominence
    lg: 'h-32 sm:h-38 w-auto max-w-full scale-115',  // Even bigger display in the footer
    xl: 'h-44 sm:h-52 w-auto max-w-full scale-120',
  };

  const hasHeight = className.includes('h-') || className.includes('h[');
  const selectedSize = hasHeight ? '' : sizeClasses[size];

  return (
    <>
      {/* Hidden SVG with an aggressive color matrix filter to remove white background instantly */}
      <svg width="0" height="0" style={{ position: 'absolute', pointerEvents: 'none', width: 0, height: 0 }} aria-hidden="true">
        <defs>
          <filter id="decolar-remove-white" colorInterpolationFilters="sRGB">
            <feColorMatrix
              type="matrix"
              values="
                1  0  0  0  0
                0  1  0  0  0
                0  0  1  0  0
                -3.5 -3.5 -3.5 10.5 0
              "
            />
          </filter>
        </defs>
      </svg>
      <img
        src={logoSrc}
        alt="Decolar Assessoria"
        className={`${selectedSize} ${className} object-contain transition-luxury`}
        style={{ 
          filter: 'url(#decolar-remove-white)',
          display: 'block' 
        }}
      />
    </>
  );
}


