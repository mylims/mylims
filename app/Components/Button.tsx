import React from 'react';

export default function Button(props: {
  type: 'button' | 'submit';
  label: string;
}) {
  return (
    <span className="inline-flex mt-2 rounded-md shadow-sm">
      <button
        type={props.type}
        className="inline-flex items-center px-3 py-2 text-sm font-medium leading-4 text-white transition duration-150 ease-in-out border border-transparent rounded-md bg-alternative-600 hover:bg-alternative-500 focus:outline-none focus:border-alternative-700 focus:shadow-outline-indigo active:bg-alternative-700"
      >
        {props.label}
      </button>
    </span>
  );
}
