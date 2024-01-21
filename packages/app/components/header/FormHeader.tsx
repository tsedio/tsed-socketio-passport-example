import React, { PropsWithChildren } from "react";

export function FormHeader({ children }: PropsWithChildren) {
  return (
    <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
      <img className='mx-auto h-20 w-auto' src='https://tsed.io/tsed-og.png' alt='Ts.ED' />
      <h2 className='mt-5 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900'>{children}</h2>
    </div>
  );
}
