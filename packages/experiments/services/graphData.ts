import { uniq } from 'ramda';

const graphData: GraphData = {
  nodes: [
    {
      id: '1',
      name: 'Mauricio Melo',
    },
    {
      id: '2',
      name: 'Ana',
    },
    {
      id: '3',
      name: 'Mayke',
    },
  ],
  links: [
    {
      source: '1',
      target: '2',
    },
  ],
};

export interface GraphNode {
  id: string;
  name: string;
  icon?: string;
}
export interface Link {
  source: string;
  target: string;
}

export interface GraphData {
  links: Link[];
  nodes: GraphNode[];
}

export default async (): Promise<GraphData> => {
  const path = window.require('path');
  const { readdir } = window.require('fs').promises;

  async function getFiles(dir): Promise<Link[]> {
    const dirents = await readdir(dir, { withFileTypes: true });
    const files = await Promise.all(
      dirents.map(dirent => {
        const res = path.resolve(dir, dirent.name);
        return dirent.isDirectory()
          ? getFiles(res).then(files => [
              { source: res, target: dir },
              ...files,
            ])
          : { source: res, target: dir };
      })
    );
    return Array.prototype.concat(...files);
  }

  const links = await getFiles(
    '/Users/mauricio/projects/sweetgreen/location-search-service/src'
  );

  const nodes = uniq(
    links.flatMap(({ source, target }) => [source, target])
  ).map(name => ({ id: name, name, icon: path.extname(name) }));

  const dirGraph = { links, nodes };
  // console.log(dirGraph);

  return dirGraph;
};
