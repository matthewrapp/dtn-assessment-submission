'use client';

import React from 'react';
import Button from './Button';

type Props = {
  modalOpen: boolean;
  children: React.ReactNode;
};
const Modal = ({ modalOpen, children }: Props) => {
  return (
    <div
      tabIndex={-1}
      className={`
         bg-stone-950 bg-opacity-70 h-[100dvh] w-full absolute top-0 left-0 right-0 bottom-0 justify-center items-center
         ${modalOpen ? 'flex' : 'hidden'}
      `}
    >
      <div
        className={`
            overflow-y-auto overflow-x-hidden h-fit
            relative p-4 w-full max-w-2xl
             bg-white rounded-lg shadow
            
         `}
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;

export const ModalHeader = ({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) => {
  return (
    <div className="flex items-center justify-between p-4 rounded-t">
      <h3 className="text-xl font-semibold text-stone-900">{children}</h3>
      <button
        type="button"
        className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 transition-all duration-200 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
        onClick={() => {
          onClose && onClose();
        }}
      >
        <svg
          className="w-3 h-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 14 14"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
          />
        </svg>
      </button>
    </div>
  );
};

export const ModalFooter = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex items-center justify-end p-4rounded-b">{children}</div>
  );
};

export const ModalBody = ({ children }: { children: React.ReactNode }) => {
  return <div className="p-4">{children}</div>;
};
