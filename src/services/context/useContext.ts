import { useEffect, useState } from 'react';
import type { ContextSnapshot, ContextEngineInput } from './contextTypes';
import { ContextEngine } from './contextEngine';

export function useContext(input: ContextEngineInput) {
  const [context, setContext] = useState<ContextSnapshot | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    void (async () => {
      const engine = new ContextEngine();
      const nextContext = await engine.build(input);
      if (!cancelled) {
        setContext(nextContext);
      }
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [input]);

  return { context, loading };
}
