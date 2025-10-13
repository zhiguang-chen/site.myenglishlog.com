---
title: How to listen to dispatchEvent in React
tags: Frontend | React
created: 2025-10-13
updated: 2025-10-13
---

See: https://github.com/facebook/react/issues/27283#issuecomment-1762460422

Here I created a hook helper:

```ts
import { useEffect, useRef, type ForwardedRef } from 'react';

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

  useEffect(() => {
    if (!ref) {
      return;
    }

    if (typeof ref === 'function') {
      ref(localRef.current);
    } else {
      ref.current = localRef.current;
    }
  }, [ref]);

  useEffect(() => {
    if (!localRef.current || !onChange) {
      return;
    }

    const element = localRef.current;

    const handler = (e: Event) => {
      const target = e.currentTarget;
      let value: T;

      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement
      ) {
        value = target.value as T;
      } else {
        throw new Error('TODO: implement');
      }

      onChange(value);
    };

    element.addEventListener('change', handler);
    return () => element.removeEventListener('change', handler);
  }, [onChange]);

  return localRef;
};
```
