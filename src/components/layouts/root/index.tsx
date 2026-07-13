import React, { Fragment, ReactNode } from "react";
import Header from "../header/header";
import axios from "axios";

// Set global API endpoint destination for client-side fetches
if (typeof window !== "undefined") {
  axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
}

interface LayoutProps {
  children: ReactNode;
}

export function Layout(props: LayoutProps): React.ReactElement {
  const { children } = props;
  return (
    <Fragment>
      <Header/>
      {children}
    </Fragment>
  );
}
