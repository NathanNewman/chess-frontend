import React from 'react';
import { render } from '@testing-library/react';
import LeaderBoard from '../LeaderBoard';

test('renders LeaderBoard component without errors', () => {
  render(<LeaderBoard />);
});