import "../styles/index.css";

import React from "react";

import type { PageContext } from "./types";
import { PageContextProvider } from "./usePageContext";

export function PageShell({ children, pageContext }: { children: React.ReactNode; pageContext: PageContext }) {
  return (
    <React.StrictMode>
      <PageContextProvider pageContext={pageContext}>
        <Content>{children}</Content>
      </PageContextProvider>
    </React.StrictMode>
  );
}

function Content({ children }: { children: React.ReactNode }) {
  return <main>{children}</main>;
}
