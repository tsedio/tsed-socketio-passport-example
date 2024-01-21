import "../styles/index.css";

import React from "react";
import { IoProvider } from "socket.io-react-hook";

import type { PageContext } from "./types";
import { PageContextProvider } from "./usePageContext";

export function PageShell({ children, pageContext }: { children: React.ReactNode; pageContext: PageContext }) {
  return (
    <React.StrictMode>
      <IoProvider>
        <PageContextProvider pageContext={pageContext}>
          <Content>{children}</Content>
        </PageContextProvider>
      </IoProvider>
    </React.StrictMode>
  );
}

function Content({ children }: { children: React.ReactNode }) {
  return <main>{children}</main>;
}
