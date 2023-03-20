import { ChangeEvent, useState } from 'react';

export function useInput<T>(initialValue: T) {
  const [value, setValue] = useState(initialValue);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value as T);
  }

  return {
    props: {
      value,
      onChange: handleChange,
    },
    setValue,
  };
}
