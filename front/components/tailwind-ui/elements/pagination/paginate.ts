export const ELLIPSIS = '…';

export function paginate(
  currentPage: number,
  totalPages: number,
  maxVisiblePages: number,
  pagesPerSide: number,
) {
  const maxPagesWithoutEllipsis = pagesPerSide * 2 + 2 + maxVisiblePages;
  if (totalPages <= maxPagesWithoutEllipsis) {
    return range(1, totalPages);
  }

  const half = Math.ceil(maxPagesWithoutEllipsis / 2);
  const aroundMiddle = Math.floor(maxVisiblePages / 2);

  const pagination: Array<number | typeof ELLIPSIS> = [];

  if (currentPage <= half) {
    pagination.push(...range(1, half));
  } else {
    pagination.push(...range(1, pagesPerSide));
    pagination.push(ELLIPSIS);
    if (currentPage > totalPages - half) {
      pagination.push(
        ...range(totalPages - half - aroundMiddle + 1, totalPages),
      );
      return pagination;
    } else {
      pagination.push(...range(currentPage - aroundMiddle, currentPage));
    }
  }

  if (currentPage > totalPages - half) {
    pagination.push(...range(currentPage + 1, totalPages));
  } else {
    const middle = Math.max(currentPage, half);
    pagination.push(...range(middle + 1, middle + aroundMiddle));
    pagination.push(ELLIPSIS);
    pagination.push(...range(totalPages - pagesPerSide + 1, totalPages));
  }
  return pagination;
}

function range(from: number, to: number) {
  const result: number[] = [];
  for (let i = from; i <= to; i++) {
    result.push(i);
  }
  return result;
}
