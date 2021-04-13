import clsx from 'clsx';
import React, { useMemo } from 'react';

import { Variant } from '../../types';
import { Button } from '../buttons/Button';
import { ButtonGroup } from '../buttons/ButtonGroup';

import { paginate, ELLIPSIS } from './paginate';

export interface PaginationProps {
  totalCount: number;
  page: number;
  itemsPerPage: number;
  onPageChange: (newPage: number, previousPage: number) => void;
  maxVisiblePages?: number;
  pagesPerSide?: number;
  withText?: boolean;
}

export function Pagination(props: PaginationProps) {
  const {
    totalCount,
    page,
    itemsPerPage,
    onPageChange,
    maxVisiblePages = 3,
    pagesPerSide = 1,
    withText = false,
  } = props;

  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const { goPrevious, goNext, pages, goTo } = useMemo(() => {
    const goPrevious = () => onPageChange(page - 1, page);
    const goNext = () => onPageChange(page + 1, page);
    const goTo = (num: number) => onPageChange(num, page);

    const pagination = paginate(
      page,
      totalPages,
      maxVisiblePages,
      pagesPerSide,
    );

    const pages = pagination;

    return {
      goPrevious,
      goNext,
      goTo,
      pages,
    };
  }, [page, totalPages, onPageChange, maxVisiblePages, pagesPerSide]);

  const prevDisabled = page === 1;
  const nextDisabled = page === totalPages;

  if (pages.length < 2) {
    return null;
  }

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-neutral-200 sm:px-6">
      <div
        className={clsx('flex items-center flex-1', {
          'justify-between': withText === true,
          'justify-center': withText === false,
        })}
      >
        {withText && <Text page={page} total={totalPages} />}
        <div>
          <nav className="relative z-0 inline-flex shadow-sm">
            <ButtonGroup variant={Variant.white} size={pages.length + 2}>
              <Button disabled={prevDisabled} onClick={goPrevious}>
                Previous
              </Button>

              {pages.map((element, index) => {
                return (
                  <Button
                    className={clsx({
                      'border border-neutral-300': page === element,
                    })}
                    style={{ minWidth: '3rem' }}
                    variant={
                      element === page ? Variant.secondary : Variant.white
                    }
                    key={element === ELLIPSIS ? `${ELLIPSIS}${index}` : element}
                    disabled={element === ELLIPSIS}
                    onClick={
                      element === ELLIPSIS ? undefined : () => goTo(element)
                    }
                  >
                    {element}
                  </Button>
                );
              })}

              <Button disabled={nextDisabled} onClick={goNext}>
                Next
              </Button>
            </ButtonGroup>
          </nav>
        </div>
      </div>
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
