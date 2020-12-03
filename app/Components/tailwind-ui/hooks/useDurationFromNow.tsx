import { subSeconds, formatDistance, differenceInSeconds } from 'date-fns';
import { useEffect, useState } from 'react';

function getFromNow(date: Date | number | string): string {
  if (typeof date === 'number' || typeof date === 'string') {
    date = new Date(date);
  }

  const now = new Date();
  return formatDistance(subSeconds(now, differenceInSeconds(now, date)), now);
}

export function useDurationFromNow(date: Date | number | string): string {
  const [fromNow, setFromNow] = useState(() => getFromNow(date));

  useEffect(() => {
    const intervalId = setInterval(() => {
      setFromNow(getFromNow(date));
    }, 10000);

    setFromNow(getFromNow(date));
    return () => clearInterval(intervalId);
  }, [date]);

  return fromNow;
}
