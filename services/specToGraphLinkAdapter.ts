import { uniq } from 'ramda';
import { GraphData, GraphNode, Link } from '../pages/graphData';
import { Spec } from './specNetwork';

export function adaptSpecs(specs: Spec[]): GraphData {
  const links = specs.map(spec => ({
    source: spec.subject,
    target: spec.object,
  }));
  return {
    nodes: deriveNodesFromLinks(links),
    links: links,
  };
}

function deriveNodesFromLinks(links: Link[]): GraphNode[] {
  return uniq(links.flatMap(({ source, target }) => [source, target])).map(
    name => ({
      id: name,
      name,
    })
  );
}
