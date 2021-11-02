import { CheckIcon } from '@heroicons/react/outline';
import clsx from 'clsx';
import React from 'react';

export interface Step {
  /**
   * If defined will be used as the React key for the step elements
   * Otherwise the step index will be used
   */
  id?: string;
  label: string;
  description?: string;
}

export interface StepperProps<T extends Step> {
  steps: Array<T>;
  current: number;
  /**
   * Called when the user clicks on a previous step
   */
  onSelectStep?: (index: number, step: T) => void;
}

function getLabelSteps(index: number): string {
  return String(index + 1).padStart(2, '0');
}

export function Stepper<T extends Step>(props: StepperProps<T>) {
  const { steps, current, onSelectStep } = props;

  return (
    <nav>
      <ol className="border divide-y rounded-md border-neutral-300 divide-neutral-300 md:flex md:divide-y-0">
        {steps.map((step, index) => (
          <li
            key={step.id || index}
            className={clsx('relative md:flex-1 md:flex', {
              'cursor-pointer': onSelectStep && index < current,
            })}
            onClick={() => {
              // We only allow to navigate back in the steps
              if (onSelectStep && index < current) {
                onSelectStep(index, step);
              }
            }}
          >
            {index < current && <StepDone step={step} />}
            {index === current && <StepCurrent step={step} index={index} />}
            {index > current && <StepToDoComponent step={step} index={index} />}
            {index + 1 !== steps.length && <Separator />}
          </li>
        ))}
      </ol>
    </nav>
  );
}

function StepCurrent(props: { step: Step; index: number }): JSX.Element | null {
  if (props.step === undefined) return null;

  return (
    <span
      className={clsx(
        'flex px-6 py-5 text-sm font-semibold lg:pl-9',
        !props.step.description ? 'items-center' : 'items-start',
      )}
      aria-current="step"
    >
      <span className="flex-shrink-0">
        <span className="flex items-center justify-center w-10 h-10 border-2 rounded-full border-primary-600">
          <span className="text-primary-600">{getLabelSteps(props.index)}</span>
        </span>
      </span>
      <span className="mt-0.5 ml-4 min-w-0 flex flex-col">
        <span className="text-xs font-semibold tracking-wide uppercase text-primary-600">
          {props.step.label}
        </span>
        {props.step.description && (
          <span className="text-sm font-semibold text-neutral-500">
            {props.step.description}
          </span>
        )}
      </span>
    </span>
  );
}

function StepToDoComponent(props: { step: Step; index: number }): JSX.Element {
  return (
    <span
      className={clsx(
        'flex px-6 py-5 text-sm font-semibold lg:pl-9',
        !props.step.description ? 'items-center' : 'items-start',
      )}
    >
      <span className="flex-shrink-0">
        <span className="flex items-center justify-center w-10 h-10 border-2 rounded-full border-neutral-300">
          <span className="text-neutral-500">{getLabelSteps(props.index)}</span>
        </span>
      </span>
      <span className="mt-0.5 ml-4 min-w-0 flex flex-col">
        <span className="text-xs font-semibold tracking-wide uppercase text-neutral-500">
          {props.step.label}
        </span>
        <span className="text-sm font-semibold text-neutral-500">
          {props.step.description}
        </span>
      </span>
    </span>
  );
}

function StepDone(props: { step: Step }): JSX.Element {
  return (
    <span
      className={clsx(
        'flex px-6 py-5 text-sm font-semibold lg:pl-9',
        !props.step.description ? 'items-center' : 'items-start',
      )}
    >
      <span className="flex-shrink-0">
        <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-600">
          <CheckIcon className="w-6 h-6 text-white" />
        </span>
      </span>
      <span className="mt-0.5 ml-4 min-w-0 flex flex-col">
        <span className="text-xs font-semibold tracking-wide uppercase">
          {props.step.label}
        </span>
        <span className="text-sm font-semibold text-neutral-500">
          {props.step.description}
        </span>
      </span>
    </span>
  );
}

function Separator(): JSX.Element {
  return (
    <div className="absolute top-0 right-0 hidden w-5 h-full md:block">
      <svg
        className="w-full h-full text-neutral-300"
        viewBox="0 0 22 80"
        fill="none"
        preserveAspectRatio="none"
      >
        <path
          d="M0 -2L20 40L0 82"
          vectorEffect="non-scaling-stroke"
          stroke="currentcolor"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
