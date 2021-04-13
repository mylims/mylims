import React from 'react';

import { SvgSickRobot } from '../svg/shutterstock';

interface ErrorPageProps {
  title: string;
  subtitle: string;
  hideImage?: boolean;
}

export const ErrorPage: React.FC<ErrorPageProps> = (props) => {
  return (
    <div className="max-w-2xl m-auto md:max-w-4xl">
      <div className="flex justify-between px-2 pt-4">
        <div className="min-w-0">
          <h1 className="text-5xl font-bold sm:mt-16 text-primary-900">
            {props.title}
          </h1>
          <h2 className="mt-16 text-lg sm:mt-8">{props.subtitle}</h2>
          <div className="mt-4">{props.children}</div>
        </div>
        <div className="hidden md:block">
          {props.hideImage ? null : (
            <SvgSickRobot className="mt-16 ml-8" width="300" height="300" />
          )}
        </div>
      </div>
    </div>
  );
};
