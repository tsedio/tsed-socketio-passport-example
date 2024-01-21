import React from "react";

import { AlertError } from "../../components/alert/AlertError.js";
import { SubmitButton } from "../../components/button/SubmitButton.js";
import { FormBuilder } from "../../components/form-builder/FormBuilder.js";
import { FormHeader } from "../../components/header/FormHeader.js";
import { PageContext } from "../../renderer/types";

export interface SignupPageProps {
  form: any;
  errors?: string[];
}

export function Page({ form, errors }: PageContext & SignupPageProps) {
  return (
    <div className='flex min-h-full flex-col justify-center px-6 py-12 lg:px-8'>
      <FormHeader>Create your account</FormHeader>

      <div className='mt-10 sm:mx-auto sm:w-full sm:max-w-sm'>
        <AlertError errors={errors} />

        <FormBuilder form={form} action='/login' method='POST' className='space-y-6'>
          <SubmitButton>Create my account</SubmitButton>
        </FormBuilder>

        <p className='mt-10 text-center text-sm text-gray-500'>
          Already a member?&nbsp;
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a href='/' className='font-semibold leading-6 text-indigo-600 hover:text-indigo-500'>
            Sign in to your account
          </a>
        </p>
      </div>
    </div>
  );
}
