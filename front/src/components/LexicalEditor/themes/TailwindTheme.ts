const exampleTheme = {
  ltr: 'text-left',
  rtl: 'text-right',
  placeholder:
    'pointer-events-none absolute top-4 left-4 inline-block select-none overflow-hidden text-ellipsis text-neutral-400',
  paragraph: 'm-0 mb-2 relative last:mb-0',
  quote:
    'm-0 ml-4 font-normal text-neutral-500 border-neutral-200 border-l-4 pl-4',
  heading: {
    h1: 'text-2xl font-bold leading-tight text-neutral-900',
    h2: 'text-xl font-bold leading-tight text-neutral-800',
    h3: 'text-lg font-bold leading-tight text-neutral-700',
  },
  list: {
    nested: {
      listitem: 'my-2',
    },
    ol: 'list-inside list-decimal',
    ul: 'list-inside list-disc',
    listitem: 'my-2',
  },
  link: 'text-primary-500',
  table:
    'border-collapse border-spacing-0 max-w-full overflow-y-scroll table-fixed w-full',
  tableCell:
    'border border-solid border-black py-1.5 px-2 min-w-[75px] align-top text-start',
  tableCellHeader: 'text-start bg-neutral-200',
  text: {
    bold: 'font-bold',
    italic: 'italic',
    underline: 'underline',
    strikethrough: 'line-through',
    underlineStrikethrough: 'underline line-through',
  },
  image: 'inline-block relative',
};

export default exampleTheme;
