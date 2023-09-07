import React from 'react';
import { render } from '@testing-library/react';
import Delete from '../Delete';

test('renders Delete component without errors', () => {
  const username = 'testUser';
  const handleDelete = jest.fn();

  render(<Delete username={username} handleDelete={handleDelete} />);
});