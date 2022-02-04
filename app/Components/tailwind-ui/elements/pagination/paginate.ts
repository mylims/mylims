export const ELLIPSIS = '…';

type PaginationArray = Array<number | typeof ELLIPSIS>;

interface PaginateResult {
  pages: PaginationArray;
  canNavigate: boolean;
}

export function paginate(
  currentPage: number,
  totalPages: number,
  centerPagesPerSide: number,
  boundaryPagesPerSide: number,
): PaginateResult {
  const maxPagesWithoutEllipsis =
    boundaryPagesPerSide * 2 +
    centerPagesPerSide * 2 +
    // current page
    1 +
    // account for ellipses
    (boundaryPagesPerSide ? 2 : 0);

  if (totalPages <= maxPagesWithoutEllipsis) {
    return createPagination(range(1, totalPages));
  }

  const half = Math.ceil(maxPagesWithoutEllipsis / 2);
  const aroundMiddle = centerPagesPerSide;

  const pages: PaginationArray = [];

  if (currentPage <= half) {
    pages.push(...range(1, half));
  } else {
    pages.push(...range(1, boundaryPagesPerSide));
    if (boundaryPagesPerSide) {
      pages.push(ELLIPSIS);
    }
    if (currentPage > totalPages - half) {
      pages.push(...range(totalPages - half - aroundMiddle + 1, totalPages));
      return createPagination(pages);
    } else {
      pages.push(...range(currentPage - aroundMiddle, currentPage));
    }
  }

  if (currentPage > totalPages - half) {
    pages.push(...range(currentPage + 1, totalPages));
  } else {
    const middle = Math.max(currentPage, half);
    pages.push(...range(middle + 1, middle + aroundMiddle));
    if (boundaryPagesPerSide) {
      pages.push(ELLIPSIS);
    }
    pages.push(...range(totalPages - boundaryPagesPerSide + 1, totalPages));
  }

  return createPagination(pages);
}

function createPagination(pages: PaginationArray): PaginateResult {
  const realPages = pages.filter((page) => typeof page === 'number');
  return {
    pages,
    canNavigate: realPages.length > 0,
  };
}

function range(from: number, to: number) {
  const result: number[] = [];
  for (let i = from; i <= to; i++) {
    result.push(i);
  }
  return result;
}
