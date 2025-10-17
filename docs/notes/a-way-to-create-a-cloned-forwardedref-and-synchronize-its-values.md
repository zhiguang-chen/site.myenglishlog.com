---
title: A way to create a cloned `ForwardedRef` and synchronize its values.
tags: Frontend | React
created: 2025-10-17
updated: 2025-10-17
---

```ts
import { useCallback, useEffect, useRef, type ForwardedRef } from 'react';

export const useLocalRef = <
  E extends HTMLInputElement | HTMLTextAreaElement,
  T = E['value']
>(
  ref: ForwardedRef<E>,
  {
    onChange,
  }: {
    onChange?: (value: T) => void;
  } = {}
) => {
  const localRef = useRef<E>(null);

  const combinedRef = useCallback(
    (instance: E | null) => {
      localRef.current = instance;

      if (typeof ref === 'function') {
        ref(instance);
      } else if (ref) {
        ref.current = instance;
      }
    },
    [ref]
  );

  useEffect(() => {
    const element = localRef.current;
    if (!element || !onChange) return;

    const handleChange = (e: Event) => {
      const target = e.currentTarget;
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement
      ) {
        onChange(target.value as T);
      }
    };

    element.addEventListener('input', handleChange);
    return () => element.removeEventListener('input', handleChange);
  }, [onChange]);

  return combinedRef;
};
```
