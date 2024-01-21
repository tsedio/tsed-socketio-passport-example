import React from "react";

import { FormControl, FormControlProps } from "../form-control/FormControl.js";

export function Input(props: React.JSX.IntrinsicElements["input"] & FormControlProps) {
  return (
    <FormControl {...props}>
      <input
        {...props}
        required={props.required ?? true}
        className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
      />
    </FormControl>
  );
}
