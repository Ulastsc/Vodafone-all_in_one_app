import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { useEffect, useRef } from "react";

/**
 * Hook: useRealtimeDoc
 * Yjs ile gerçek zamanlı senkronizasyonu yönetir.
 */
export function useRealtimeDoc(docName: string) {
  const docRef = useRef<Y.Doc | null>(null);
  const providerRef = useRef<WebsocketProvider | null>(null);

  useEffect(() => {
    const ydoc = new Y.Doc();
    const wsUrl = process.env.NEXT_PUBLIC_REALTIME_URL || "ws://localhost:1234";
    const provider = new WebsocketProvider(wsUrl, docName, ydoc);

    provider.awareness.setLocalStateField("user", {
      name: "Vodafone User",
      color: "#" + Math.floor(Math.random() * 16777215).toString(16),
    });

    docRef.current = ydoc;
    providerRef.current = provider;

    return () => {
      provider.disconnect();
      ydoc.destroy();
    };
  }, [docName]);

  return { ydoc: docRef.current, provider: providerRef.current };
}