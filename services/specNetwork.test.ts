import { parseSpec } from './specNetwork';

it('gets Subject and Object from the edges', () => {
  const spec = `Mauricio works on the Frontend`;

  expect(parseSpec(spec)[0]).toEqual({
    subject: 'Mauricio',
    object: 'Frontend',
  });
});

it('parses new each line as a new spec', () => {
  const spec = `
  Mauricio works on the Frontend
  Anna works on the Backend
  `;

  expect(parseSpec(spec)).toEqual(
    expect.arrayContaining([
      {
        subject: 'Mauricio',
        object: 'Frontend',
      },
      {
        subject: 'Anna',
        object: 'Backend',
      },
    ])
  );
});
