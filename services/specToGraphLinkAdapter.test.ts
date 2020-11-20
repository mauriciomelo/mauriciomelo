import { Spec } from './specNetwork';
import { adaptSpecs } from './specToGraphLinkAdapter';

it('maps a specs to links', () => {
  const specs: Spec[] = [{ subject: 'Mauricio', object: 'Backend' }];

  expect(adaptSpecs(specs).links).toEqual([
    { source: 'Mauricio', target: 'Backend' },
  ]);
});

it('maps a specs to nodes', () => {
  const specs: Spec[] = [{ subject: 'Mauricio', object: 'Backend' }];

  expect(adaptSpecs(specs).nodes).toEqual(
    expect.arrayContaining([
      { name: 'Mauricio', id: 'Mauricio' },
      { name: 'Backend', id: 'Backend' },
    ])
  );
});
