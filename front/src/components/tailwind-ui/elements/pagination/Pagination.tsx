import clsx from 'clsx';
import React, { useMemo } from 'react';

import { Size, Variant } from '../../types';
import { ButtonGroup } from '../buttons/ButtonGroup';

import { paginate, ELLIPSIS } from './paginate';

export type PaginationPosition = 'center' | 'start' | 'end';

export interface PaginationProps {
  totalCount: number;
  page: number;
  itemsPerPage: number;
  onPageChange: (newPage: number, previousPage: number) => void;
  centerPagesPerSide?: number;
  boundaryPagesPerSide?: number;
  withText?: boolean;
  position?: PaginationPosition;
  className?: string;
  buttonSize?: Size;
}

export function Pagination(props: PaginationProps) {
  const {
    totalCount,
    page,
    itemsPerPage,
    onPageChange,
    centerPagesPerSide = 1,
    boundaryPagesPerSide = 1,
    withText = false,
    position = 'center',
    buttonSize = Size.medium,
    className,
  } = props;

  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const { goPrevious, goNext, pages, goTo, canNavigate } = useMemo(() => {
    const goPrevious = () => onPageChange(page - 1, page);
    const goNext = () => onPageChange(page + 1, page);
    const goTo = (num: number) => onPageChange(num, page);

    const { pages, canNavigate } = paginate(
      page,
      totalPages,
      centerPagesPerSide,
      boundaryPagesPerSide,
    );

    return {
      goPrevious,
      goNext,
      goTo,
      pages,
      canNavigate,
    };
  }, [
    page,
    totalPages,
    onPageChange,
    centerPagesPerSide,
    boundaryPagesPerSide,
  ]);

  const prevDisabled = page === 1;
  const nextDisabled = page === totalPages;

  if (!canNavigate && !withText) {
    return null;
  }

  return (
    <div
      className={clsx(
        'flex items-center',
        {
          'justify-between': withText === true,
          'justify-center': withText === false && position === 'center',
          'justify-start': withText === false && position === 'start',
          'justify-end': withText === false && position === 'end',
        },
        className,
      )}
    >
      {withText && <Text page={page} total={totalPages} />}
      {canNavigate && (
        <nav className="inline-flex shadow-sm">
          <ButtonGroup size={buttonSize} variant={Variant.white}>
            <ButtonGroup.Button disabled={prevDisabled} onClick={goPrevious}>
              Previous
            </ButtonGroup.Button>

            {pages.map((element, index) => {
              return (
                <ButtonGroup.Button
                  noBorder
                  className="border border-neutral-300"
                  style={{ minWidth: '3rem' }}
                  variant={element === page ? Variant.secondary : Variant.white}
                  key={element === ELLIPSIS ? `${ELLIPSIS}${index}` : element}
                  disabled={element === ELLIPSIS}
                  onClick={
                    element === ELLIPSIS ? undefined : () => goTo(element)
                  }
                >
                  {element}
                </ButtonGroup.Button>
              );
            })}

            <ButtonGroup.Button disabled={nextDisabled} onClick={goNext}>
              Next
            </ButtonGroup.Button>
          </ButtonGroup>
        </nav>
      )}
    </div>
  );
}

function Text(props: { page: number; total: number }): JSX.Element {
  return (
    <div>
      <p className="text-sm text-neutral-700">
        Showing page
        <span className="font-semibold"> {props.page} </span>
        of
        <span className="font-semibold"> {props.total} </span>
        pages.
      </p>
    </div>
  );
}
