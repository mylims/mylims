import clsx from 'clsx';
import React from 'react';

export interface ErrorPageProps {
  title: string;
  subtitle?: string;
  code?: string | number;
}

export const ErrorPage: React.FC<ErrorPageProps> = (props) => {
  const { title, subtitle, code, children } = props;

  return (
    <div className="h-full px-4 py-16 bg-white sm:px-6 sm:py-24 md:grid md:place-items-center lg:px-8">
      <div className="mx-auto max-w-max">
        <main className="sm:flex">
          {code && (
            <p className="text-4xl font-extrabold text-primary-600 sm:text-5xl">
              {code}
            </p>
          )}
          <div className="sm:ml-6">
            <div
              className={clsx({
                'sm:border-l sm:border-neutral-200 sm:pl-6': code,
              })}
            >
              <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900 sm:text-5xl">
                {title}
              </h1>
              {subtitle && (
                <p className="mt-1 text-base text-neutral-500">{subtitle}</p>
              )}
            </div>
            <div className="flex mt-10 space-x-3 sm:border-l sm:border-transparent sm:pl-6">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
