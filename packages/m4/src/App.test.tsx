import React from 'react';
import { render, screen } from '@testing-library/react';
import { SubFireApp } from '@subfire/components';

test('renders learn react link', () => {
  render(<SubFireApp clientName='test' Contents={React.Fragment} />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
