function validAmount(n: string | undefined) {
  return n && !isNaN(parseFloat(n));
}

function parsableUnit(u: string | undefined) {
  return u?.match(/\D*/)?.pop() === u;
}

let incrementBase: [string[], number][] = [
  [['b', 'bit', 'bits'], 1 / 8],
  [['B', 'Byte', 'Bytes', 'bytes'], 1],
  [['Kb'], 125],
  [['k', 'K', 'kb', 'kB', 'KB', 'KiB', 'Ki', 'ki'], 1000],
  [['Mb'], 125000],
  [['m', 'M', 'mb', 'mB', 'MB', 'MiB', 'Mi', 'mi'], 1.0e6],
  [['Gb'], 1.25e8],
  [['g', 'G', 'gb', 'gB', 'GB', 'GiB', 'Gi', 'gi'], 1.0e9],
  [['Tb'], 1.25e11],
  [['t', 'T', 'tb', 'tB', 'TB', 'TiB', 'Ti', 'ti'], 1.0e12],
  [['Pb'], 1.25e14],
  [['p', 'P', 'pb', 'pB', 'PB', 'PiB', 'Pi', 'pi'], 1.0e15],
  [['Eb'], 1.25e17],
  [['e', 'E', 'eb', 'eB', 'EB', 'EiB', 'Ei', 'ei'], 1.0e18],
];

export default function filesizeParser(input: number | string) {
  // eslint-disable-next-line no-useless-escape
  const parsed = /^(?<amount>[0-9\.,]*)(?:\s*)?(?<unit>.*)$/.exec(
    input.toString(),
  );
  const amount = parsed?.groups?.amount.replace(',', '.');
  const unit = parsed?.groups?.unit;

  if (!validAmount(amount) || !parsableUnit(unit)) {
    throw new Error(`Can't interpret ${input || 'a blank string'}`);
  }
  if (unit === '') return Math.round(Number(amount));

  for (const increment of incrementBase) {
    if (increment[0].some((value) => value === unit)) {
      return Math.round((amount ? parseFloat(amount) : 0) * increment[1]);
    }
  }

  throw new Error(`${unit as string} doesn't appear to be a valid unit`);
}
