import React from 'react';

type Props = { children: React.ReactNode };
const ErrorMessage = ({ children }: Props) => {
  return (
    <div className="font-medium text-red-500 text-[14px] font-sans">
      {children}
    </div>
  );
};

export default ErrorMessage;
