import React, { PropsWithChildren } from "react";

export function SubmitButton({ children, ...props }: PropsWithChildren<React.JSX.IntrinsicElements["button"]>) {
  return (
    <button
      type='submit'
      {...props}
      className='flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
    >
      {children}
    </button>
  );
}
