import { render, screen } from '@testing-library/react';
import LoginPage from '@/app/login/page';

test('renders login page title', () => {
  render(<LoginPage />);
  expect(screen.getByText(/CivicOS/i)).toBeInTheDocument();
});
