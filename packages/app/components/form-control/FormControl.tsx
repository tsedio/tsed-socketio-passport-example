import React, { PropsWithChildren, ReactNode } from "react";

export interface FormControlProps {
  id: string;
  label: string | ReactNode;
}

export function FormControl({ label, id, children }: PropsWithChildren<FormControlProps>) {
  return (
    <div>
      <label htmlFor={id} className='block text-sm font-medium leading-6 text-gray-900'>
        {label}
      </label>
      <div className='mt-2'>{children}</div>
    </div>
  );
}
