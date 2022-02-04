import { ChevronDownIcon } from '@heroicons/react/outline';
import clsx from 'clsx';
import React, { ReactNode } from 'react';

export interface QuestionType {
  id: string;
  question: ReactNode;
  answer: ReactNode;
}

export interface FaqProps {
  title: ReactNode;
  questions: Array<QuestionType>;
  selectedQuestionId: string;
  onSelect: (id: string) => void;
}

export interface QuestionProps {
  selectedQuestionId: string;
  onSelect: (id: string) => void;
  question: QuestionType;
}

const Question = (props: QuestionProps) => {
  const {
    question: { id, question, answer },
    selectedQuestionId,
    onSelect,
  } = props;

  const onToggle = () => {
    if (id === selectedQuestionId) onSelect('');
    else onSelect(id);
  };

  return (
    <div id={id} className="pt-6">
      <dt className="text-lg">
        <button
          onClick={onToggle}
          type="button"
          className="flex w-full items-start justify-between text-left text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2"
        >
          <span className="font-semibold text-neutral-900">{question}</span>
          <span className="ml-6 flex h-7 items-center">
            <ChevronDownIcon
              className={clsx('h-6 w-6', {
                '-rotate-180': selectedQuestionId === id,
              })}
            />
          </span>
        </button>
      </dt>
      <dd
        className={clsx('mt-2 pr-12', {
          hidden: selectedQuestionId !== id,
        })}
      >
        <div className="text-justify text-base text-neutral-500">{answer}</div>
      </dd>
    </div>
  );
};

export function Faq(props: FaqProps) {
  const { title, questions, selectedQuestionId, onSelect } = props;

  return (
    <div className="max-w-3xl divide-y-2 divide-neutral-200">
      <h2 className="text-center text-3xl font-extrabold text-neutral-900 sm:text-4xl">
        {title}
      </h2>
      <dl className="mt-6 space-y-6 divide-y divide-neutral-200">
        {questions.map((question) => (
          <Question
            key={question.id}
            selectedQuestionId={selectedQuestionId}
            question={question}
            onSelect={onSelect}
          />
        ))}
      </dl>
    </div>
  );
}
