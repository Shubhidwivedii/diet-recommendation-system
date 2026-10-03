import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the DietSmart application shell', () => {
  render(<App />);
  expect(screen.getByText('DietSmart')).toBeInTheDocument();
});
