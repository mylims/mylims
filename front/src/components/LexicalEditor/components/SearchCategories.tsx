import { Listbox } from '@headlessui/react';
import { CheckIcon, SearchIcon, SelectorIcon } from '@heroicons/react/outline';
import { clsx } from 'clsx';
import React, { useEffect, useState } from 'react';
import { usePopper } from 'react-popper';

import {
  Badge,
  BadgeVariant,
  Color,
  Spinner,
  useDebounce,
} from '@/components/tailwind-ui';

const ICON_CLASS = 'h-4 w-4 text-neutral-500';

export interface SearchCategoryItem {
  id: string;
  title: string;
  kind: string;
}
interface SearchCategoriesProps {
  loading: boolean;
  onSelect(id: string): void;
  results: SearchCategoryItem[];
  options: string[];
  defaultOption?: string;
  filterResults(query: string, kind: string | null): Promise<unknown>;
}
export function SearchCategories({
  loading: queryLoading,
  onSelect,
  results,
  options,
  defaultOption,
  filterResults,
}: SearchCategoriesProps) {
  const [value, setValue] = useState('');
  const [focus, setFocus] = useState(false);
  const [loading, setLoading] = useState(queryLoading);
  const [kind, setKind] = useState<string | null>(null);
  const query = useDebounce(value, 500);

  // Listbox popper hooks
  const [refListButton, setRefListButton] = useState<HTMLButtonElement | null>(
    null,
  );
  const [refListOptions, setRefListOptions] = useState<HTMLDivElement | null>(
    null,
  );
  const listPopper = usePopper(refListButton, refListOptions, {
    placement: 'bottom-start',
  });

  // Combobox popper hooks
  const [refComboInput, setRefComboInput] = useState<HTMLInputElement | null>(
    null,
  );
  const [refComboOptions, setRefComboOptions] = useState<HTMLDivElement | null>(
    null,
  );
  const comboPopper = usePopper(refComboInput, refComboOptions, {
    placement: 'bottom-end',
  });

  useEffect(() => {
    setLoading(false);
    if (query) {
      // eslint-disable-next-line no-console
      filterResults(query, kind).catch(console.error);
    }
  }, [query, kind, filterResults]);
  const defaultKind = kind ?? defaultOption ?? options[0];

  return (
    <Listbox value={defaultKind} onChange={setKind}>
      <div className="inline-flex">
        <Listbox.Button
          ref={setRefListButton}
          className="inline-flex w-20 items-center justify-between rounded-l-md rounded-r-none border border-r-0 border-neutral-300 bg-neutral-50 px-2 text-neutral-500 sm:text-sm"
        >
          {defaultKind}
          <span className="pointer-events-none pr-2">
            <SelectorIcon
              className="h-5 w-5 text-neutral-400"
              aria-hidden="true"
            />
          </span>
        </Listbox.Button>

        <div className="relative flex flex-1 flex-row items-center rounded-r-md border border-neutral-300 bg-white py-1 px-2 text-base placeholder-neutral-400 shadow-sm focus-within:border-primary-500 focus-within:ring-1 focus-within:ring-primary-500 disabled:bg-neutral-50 disabled:text-neutral-500 sm:text-sm">
          <label className="hidden" htmlFor="sample-search">
            Search samples
          </label>
          <input
            type="text"
            id="sample-search"
            className="flex-1 border-none p-0 focus:outline-none focus:ring-0 sm:text-sm"
            ref={setRefComboInput}
            value={value}
            onChange={(e) => {
              setLoading(true);
              setValue(e.target.value);
            }}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
          />
          {loading ? (
            <Spinner className={ICON_CLASS} />
          ) : (
            <SearchIcon className={ICON_CLASS} />
          )}
        </div>
      </div>
      <div
        ref={setRefListOptions}
        style={listPopper.styles.popper}
        {...listPopper.attributes.popper}
      >
        <Listbox.Options className="mt-1 max-h-56 rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
          {defaultOption ? (
            <ListboxOption value={null} label={defaultKind} />
          ) : null}

          {options.map((kind) => (
            <ListboxOption key={kind} value={kind} label={kind} />
          ))}
        </Listbox.Options>
      </div>
      {focus && !loading && query && (
        <div
          ref={setRefComboOptions}
          style={comboPopper.styles.popper}
          {...comboPopper.attributes.popper}
        >
          <ul className="mt-1 max-h-56 rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {results.length > 0 ? (
              results.map((result) => (
                <li
                  key={result.id}
                  value={result.id}
                  className="relative cursor-pointer select-none py-2 pl-3 pr-9 text-neutral-900"
                  onMouseDown={() => {
                    onSelect(result.id);
                    refComboInput?.blur();
                  }}
                  title={result.title}
                >
                  <span className="inline-block max-w-xs truncate">
                    {result.title}
                  </span>
                  <Badge
                    className="ml-2"
                    variant={BadgeVariant.COLORED_BACKGROUND}
                    label={result.kind}
                    color={Color.primary}
                  />
                </li>
              ))
            ) : (
              <li className="select-none py-2 pl-3 pr-9 text-center text-neutral-900">
                No elements found
              </li>
            )}
          </ul>
        </div>
      )}
    </Listbox>
  );
}

function ListboxOption({
  value,
  label,
}: {
  value: string | null;
  label: string;
}) {
  return (
    <Listbox.Option
      value={value}
      title={label}
      className={({ active }) =>
        clsx(
          active ? 'bg-primary-600 text-white' : 'text-neutral-900',
          'relative cursor-default select-none py-2 pl-3 pr-9',
        )
      }
    >
      {({ selected, active }) => (
        <>
          <span
            className={clsx(
              selected ? 'font-semibold' : 'font-normal',
              'ml-3 block max-w-xs truncate',
            )}
          >
            {label}
          </span>

          {selected ? (
            <span
              className={clsx(
                active ? 'text-white' : 'text-primary-600',
                'absolute inset-y-0 right-0 flex items-center pr-4',
              )}
            >
              <CheckIcon className="h-5 w-5" aria-hidden="true" />
            </span>
          ) : null}
        </>
      )}
    </Listbox.Option>
  );
}
