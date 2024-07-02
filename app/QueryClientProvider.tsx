"use client";

import { QueryClient, QueryClientProvider as QCP } from "@tanstack/react-query";
import { PropsWithChildren } from "react";

const queryClient = new QueryClient();

function QueryClientProvider({ children }: PropsWithChildren) {
  return <QCP client={queryClient}>{children}</QCP>;
}

export default QueryClientProvider;
