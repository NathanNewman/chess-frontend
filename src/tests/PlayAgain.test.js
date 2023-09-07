import React from 'react';
import { render } from '@testing-library/react';
import PlayAgain from '../game/PlayAgain';

test('renders PlayAgain component without errors', () => {
  render(<PlayAgain endingMessage="Game Over" handlePlayAgain={() => {}} />);
});