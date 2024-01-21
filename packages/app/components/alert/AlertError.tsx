import React from "react";

export function AlertError({ errors = [] }: { errors?: string[] }) {
  return (
    <>
      {errors.length > 0 && (
        <div className='p-4 mb-5 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 text-center' role='alert'>
          {errors?.map((msg, idx) => {
            return <div key={msg}>{msg}</div>;
          })}
        </div>
      )}
    </>
  );
}
