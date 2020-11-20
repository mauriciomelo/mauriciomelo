import React from 'react';
import { TextareaAutosize } from '@material-ui/core';
import { parseSpec } from '../services/specNetwork';
import { adaptSpecs } from '../services/specToGraphLinkAdapter';
import { ForceGraph } from '../components/ForceGraph';

const SPEC_EXAMPLE = `
A links to B
B links to C
C links to A
`;

export default function SpecGraph() {
  const [spec, setSpec] = React.useState(SPEC_EXAMPLE);

  const handleSpecChange = React.useCallback(e => {
    const spec = e.target.value;
    setSpec(spec);
  }, []);

  const forceGraphData = React.useMemo(() => adaptSpecs(parseSpec(spec)), [
    spec,
  ]);

  return (
    <div>
      <TextareaAutosize
        onChange={handleSpecChange}
        aria-label="empty textarea"
        placeholder="Empty"
        value={spec}
      />
      <ForceGraph {...forceGraphData} />
    </div>
  );
}
