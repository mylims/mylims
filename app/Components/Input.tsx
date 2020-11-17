import React from 'react';

interface InputProps {
  label: string;
  id: string;
  type: string;
  name: string;
  value?: string;
  error?: string;
  placeholder?: string;
}

export default function Input(props: InputProps) {
  return (
    <div className="mb-4">
      <label
        htmlFor={props.id}
        className="block text-sm font-medium leading-5 text-neutral-700"
      >
        {props.label}
      </label>
      <div className="relative mt-1 rounded-md shadow-sm">
        <input
          id={props.id}
          type={props.type}
          name={props.name}
          className="block w-full form-input sm:text-sm sm:leading-5"
          placeholder={props.placeholder}
          value={props.value}
        />
      </div>
      {props.error && (
        <p className="mt-2 text-sm text-danger-600" id="email-error">
          {props.error}
        </p>
      )}
    </div>
  );
}
