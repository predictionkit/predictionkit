import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import type { PredictionClient } from '@prediction-kit/core';

const ClientContext = createContext<PredictionClient | null>(null);

export interface PredictionKitProviderProps {
  /** A client created with `createClient` from `@prediction-kit/core`. */
  client: PredictionClient;
  children: ReactNode;
}

/**
 * Makes a PredictionKit client available to the hooks and components below it
 * in the tree.
 */
export function PredictionKitProvider({ client, children }: PredictionKitProviderProps) {
  return <ClientContext.Provider value={client}>{children}</ClientContext.Provider>;
}

/** Read the client from context. Throws if used outside a provider. */
export function usePredictionClient(): PredictionClient {
  const client = useContext(ClientContext);
  if (!client) {
    throw new Error(
      'usePredictionClient must be used within a <PredictionKitProvider>. ' +
        'Wrap your app with <PredictionKitProvider client={...}>.',
    );
  }
  return client;
}
