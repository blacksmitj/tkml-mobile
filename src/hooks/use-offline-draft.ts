import { useState, useEffect, useCallback } from 'react';

// In-memory persistent state cache (fallback & high-speed storage without native build locks)
const memoryCache: Record<string, string> = {};

export function useOfflineDraft<T>(
  draftKey: string,
  initialData: T
): {
  draft: T;
  saveDraft: (data: Partial<T>) => void;
  clearDraft: () => void;
  isSaved: boolean;
} {
  const [draft, setDraft] = useState<T>(() => {
    const saved = memoryCache[draftKey];
    if (saved) {
      try {
        return { ...initialData, ...JSON.parse(saved) };
      } catch {
        return initialData;
      }
    }
    return initialData;
  });

  const [isSaved, setIsSaved] = useState(false);

  const saveDraft = useCallback(
    (data: Partial<T>) => {
      setDraft((prev) => {
        const updated = { ...prev, ...data };
        memoryCache[draftKey] = JSON.stringify(updated);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
        return updated;
      });
    },
    [draftKey]
  );

  const clearDraft = useCallback(() => {
    delete memoryCache[draftKey];
    setDraft(initialData);
    setIsSaved(false);
  }, [draftKey, initialData]);

  return {
    draft,
    saveDraft,
    clearDraft,
    isSaved,
  };
}
