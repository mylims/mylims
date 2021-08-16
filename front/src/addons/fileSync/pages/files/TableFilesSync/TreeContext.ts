import { produce } from 'immer';
import { createContext } from 'react';

import { DirSync, TreeContextType, TreeSync } from './types';

export const TreeContext = createContext<TreeContextType>({
  state: [],
  setState(): void {
    // do nothing
  },
  id: '',
});

export function changeNodeValue(
  tree: TreeSync[],
  path: string[],
  name: string,
  callback: (node: TreeSync) => TreeSync,
) {
  return produce(tree, (draft) => {
    let edges: TreeSync[] = draft;
    for (const step of path) {
      edges =
        (edges.find(({ id }) => id === step) as DirSync | undefined)
          ?.children ?? [];
    }
    let node = edges.find(({ id }) => id === name);

    if (node) {
      node = callback(node);
    }
  });
}
