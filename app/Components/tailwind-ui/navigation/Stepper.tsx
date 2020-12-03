import React from 'react';

import { SvgOutlineCheck } from '../svg/heroicon/outline';

export interface Step {
  label: string;
  description?: string;
}

export interface StepperProps {
  steps: Array<Step>;
  current: number;
}

type StepWithId = Step & { id: number };

interface Utils {
  done: Array<StepWithId>;
  actual: StepWithId | undefined;
  going: Array<StepWithId>;
  all: Array<StepWithId>;
}

function getSteps(steps: Array<Step>, current: number): Utils {
  const array = steps.map((step, index) => ({ ...step, id: index }));

  return {
    done: array.slice(0, current),
    actual: array[current],
    going: array.slice(current + 1, array.length),
    all: array,
  };
}

function getStepComponent(step: StepWithId, utils: Utils): JSX.Element {
  if (utils.actual === step) return <StepCurrent step={step} />;
  if (utils.done.includes(step)) return <StepDone step={step} />;
  return <StepToDoComponent step={step} />;
}

export function Stepper(props: StepperProps) {
  const steps = getSteps(props.steps, props.current);

  return (
    <nav>
      <ol className="border divide-y rounded-md border-neutral-300 divide-neutral-300 md:flex md:divide-y-0">
        {steps.all.map((step, index) => (
          <li key={step.id} className="relative md:flex-1 md:flex">
            {getStepComponent(step, steps)}
            {index + 1 !== steps.all.length && <Separator />}
          </li>
        ))}
      </ol>
    </nav>
  );
}

function StepCurrent(props: {
  step: StepWithId | undefined;
}): JSX.Element | null {
  if (props.step === undefined) return null;

  return (
    <span
      className="flex items-start px-6 py-5 text-sm font-medium lg:pl-9"
      aria-current="step"
    >
      <span className="flex-shrink-0">
        <span className="flex items-center justify-center w-10 h-10 border-2 rounded-full border-primary-600">
          <span className="text-primary-600">
            {`0${props.step.id}`.slice(-2)}
          </span>
        </span>
      </span>
      <span className="mt-0.5 ml-4 min-w-0 flex flex-col">
        <span className="text-xs font-semibold tracking-wide uppercase text-primary-600">
          {props.step.label}
        </span>
        <span className="text-sm font-medium text-neutral-500">
          {props.step.description}
        </span>
      </span>
    </span>
  );
}

function StepToDoComponent(props: { step: StepWithId }): JSX.Element {
  return (
    <span className="flex items-start px-6 py-5 text-sm font-medium lg:pl-9">
      <span className="flex-shrink-0">
        <span className="flex items-center justify-center w-10 h-10 border-2 rounded-full border-neutral-300">
          <span className="text-neutral-500">
            {`0${props.step.id}`.slice(-2)}
          </span>
        </span>
      </span>
      <span className="mt-0.5 ml-4 min-w-0 flex flex-col">
        <span className="text-xs font-semibold tracking-wide uppercase text-neutral-500">
          {props.step.label}
        </span>
        <span className="text-sm font-medium text-neutral-500">
          {props.step.description}
        </span>
      </span>
    </span>
  );
}

function StepDone(props: { step: StepWithId }): JSX.Element {
  return (
    <span className="flex items-start px-6 py-5 text-sm font-medium lg:pl-9">
      <span className="flex-shrink-0">
        <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-600">
          <SvgOutlineCheck className="w-6 h-6 text-white" />
        </span>
      </span>
      <span className="mt-0.5 ml-4 min-w-0 flex flex-col">
        <span className="text-xs font-semibold tracking-wide uppercase">
          {props.step.label}
        </span>
        <span className="text-sm font-medium text-neutral-500">
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
