import React from 'react';
import ErrorMessage from './ErrorMessage';

type Props = {
  errorMsg?: string;
  label: string;
} & React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;
const Input = ({ errorMsg, className, label, ...props }: Props) => {
  return (
    <label className="flex flex-col gap-1 w-full">
      <span className="text-[15px] text-stone-500 font-sans">{label}</span>
      <input
        className={`
            p-2 border-[1px] border-stone-400 rounded-md text-[16px] font-sans
            ${className || ''}
         `}
        {...props}
      />
      {errorMsg && <ErrorMessage>{errorMsg}</ErrorMessage>}
    </label>
  );
};

export default Input;
