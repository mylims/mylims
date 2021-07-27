import React, { useEffect, useState } from 'react';

import { Input, useDebounce } from './tailwind-ui';

interface InputDebounceProps {
  name: string;
  label: string;
  value: string;
  type?: string;
  className?: string;
  onChange: (value: string) => void;
}
interface State {
  value: string;
  trigger: 'event' | 'parent';
}

export default function InputDebounce({
  name,
  label,
  value,
  type,
  className,
  onChange,
}: InputDebounceProps) {
  const [state, setState] = useState<State>({ value, trigger: 'parent' });

  // Update parent state after 100ms
  const debounced = useDebounce(state, 1000);
  useEffect(() => {
    if (debounced.trigger === 'event') onChange(debounced.value);
  }, [onChange, debounced]);

  // The value of the input is the same for the one in the parent
  useEffect(() => {
    setState({ value, trigger: 'parent' });
  }, [value]);

  return (
    <Input
      className={className || 'm-2 w-44'}
      name={name}
      label={label}
      placeholder={label}
      type={type}
      value={state.value}
      onChange={({ currentTarget: { value } }) => {
        setState({ value, trigger: 'event' });
      }}
    />
  );
}
