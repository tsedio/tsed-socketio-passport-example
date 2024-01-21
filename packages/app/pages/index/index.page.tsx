import React, { useEffect } from "react";
import { useSocketEvent } from "socket.io-react-hook";

import { AlertError } from "../../components/alert/AlertError.js";
import { SubmitButton } from "../../components/button/SubmitButton.js";
import { FormBuilder } from "../../components/form-builder/FormBuilder.js";
import { FormHeader } from "../../components/header/FormHeader.js";
import { useUsersSocket } from "../../components/ws/socket.js";
import { PageContext } from "../../renderer/types";

export interface HomePageProps {
  form: any;
  errors?: string[];
}

export function Page({ form, errors }: PageContext & HomePageProps) {
  const { socket, connected, error } = useUsersSocket();
  const { lastMessage, sendMessage } = useSocketEvent(socket, "whoami");
  console.log(connected, error, lastMessage, sendMessage);

  useEffect(() => {
    sendMessage("whoami").then((response) => {
      console.log("==>response", response);
    });
  }, []);

  return (
    <div className='flex min-h-full flex-col justify-center px-6 py-12 lg:px-8'>
      <FormHeader>Sign in to your account</FormHeader>

      <div className='mt-10 sm:mx-auto sm:w-full sm:max-w-sm'>
        <AlertError errors={errors} />

        <FormBuilder form={form} action='/login' method='POST' className='space-y-6'>
          <SubmitButton>Sign in</SubmitButton>
        </FormBuilder>
        <p className='mt-10 text-center text-sm text-gray-500'>
          Not a member?&nbsp;
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a href='/signup' className='font-semibold leading-6 text-indigo-600 hover:text-indigo-500'>
            Create an account
          </a>
        </p>
      </div>
    </div>
  );
}
