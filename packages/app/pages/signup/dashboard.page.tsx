import React, { useEffect, useState } from "react";
import { useSocketEvent } from "socket.io-react-hook";

import { FormHeader } from "../../components/header/FormHeader.js";
import { Logout } from "../../components/logout/Logout.js";
import { useUsersSocket } from "../../components/ws/socket.js";
import { PageContext } from "../../renderer/types";

export interface DashboardPageProps {
  email: string;
}

export function Page({ email }: PageContext & DashboardPageProps) {
  const { socket, connected, error } = useUsersSocket();
  const socketEvent = useSocketEvent(socket, "whoami");
  const [user, setUser] = useState<{ email: string }>();

  useEffect(() => {
    socketEvent.sendMessage().then((res) => {
      setUser(res);
    });
  }, [connected]);

  return (
    <div className='flex min-h-full flex-col justify-center px-6 py-12 lg:px-8'>
      <FormHeader>Dashboard</FormHeader>

      <div className='mt-5 sm:mx-auto sm:w-full sm:max-w-sm'>
        <h3 className='mb-10 text-center text-xl font-bold leading-8 tracking-tight text-gray-900'>Welcome {email}</h3>

        <div className='mb-5 p-4 bg-gray-200 rounded-md shadow'>
          <div>Connected: {connected ? "yes" : "no"}</div>
          <div>Error: {error}</div>
          <div>Socket whoimy: {user?.email}</div>
        </div>

        <Logout />
      </div>
    </div>
  );
}
