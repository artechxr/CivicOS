import { render } from '@testing-library/react';
import ElectionReadiness from '../src/components/Dashboard/ElectionReadiness';

test('renders readiness component', () => {
const { getByText } = render(<ElectionReadiness />);
expect(getByText(/registered/i)).toBeTruthy();
});
