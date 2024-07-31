'use client';

import React from 'react';

type Props = {} & React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;
const Button = React.forwardRef(
  ({ children, className, ...props }: Props, ref: any) => {
    return (
      <button
        ref={ref}
        {...props}
        className={`
            py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none
            rounded-lg
            focus:z-10 focus:ring-4 focus:ring-gray-100
            ${className || ''}
      `}
      >
        {children}
      </button>
    );
  },
);

export default Button;
