import { render, fireEvent } from '@testing-library/react';
import Commit from './commit';

window.require = jest.fn();

const shellMock = { execSync: jest.fn() };
window.require.mockReturnValue(shellMock);

it.skip('fails', () => {
  const wrapper = render(<Commit></Commit>);
  const input = wrapper.getByLabelText('shell commands');

  // console.log(input)
  fireEvent.change(input, { target: { value: '23' } });

  expect(input.value).toBe('23');
  expect(shellMock.execSync).toBeCalled();

  // expect(1).toEqual(2)
});
