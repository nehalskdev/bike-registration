"use client";

import React, { ReactNode } from "react";

interface ProvidersProps {
  children: ReactNode;
}

/**
 * Application providers wrapper
 * Note: Redux has been removed and replaced with native fetch for type-safe API calls
 */
export function Providers({ children }: ProvidersProps): React.JSX.Element {
  return <>{children}</>;
}
