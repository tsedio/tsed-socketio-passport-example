import React from "react";

import { usePageContext } from "./usePageContext";

export function Link(props: { href?: string; className?: string; children: React.ReactNode }) {
  const pageContext = usePageContext();
  const className = [props.className, pageContext.urlPathname === props.href && "is-active"].filter(Boolean).join(" ");
  // eslint-disable-next-line jsx-a11y/anchor-has-content
  return <a {...props} className={className} />;
}
