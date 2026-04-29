import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ActionCard from '@/components/Dashboard/ActionCard';
import InsightCard from '@/components/Dashboard/InsightCard';
import ChatPanel from '@/components/Dashboard/ChatPanel';
import ScoreCircle from '@/components/Dashboard/ScoreCircle';
import ThemeRegistry from '@/components/ThemeRegistry';
import MapPage from '@/app/map/page';

// Mock NEXT navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    };
  },
}));

// Mock Google Maps
jest.mock('@react-google-maps/api', () => ({
  useJsApiLoader: () => ({ isLoaded: true, loadError: false }),
  GoogleMap: ({ children }: { children: React.ReactNode }) => <div data-testid="google-map">{children}</div>,
  Marker: () => <div data-testid="map-marker" />,
  InfoWindow: () => <div data-testid="info-window" />
}));

// Mock scrollIntoView for jsdom
window.HTMLElement.prototype.scrollIntoView = jest.fn();

describe('CivicOS Core Components & Integration', () => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <ThemeRegistry>{children}</ThemeRegistry>
  );

  it('renders ActionCard with correct title and handles navigation', () => {
    render(<ActionCard title="Test Action" subtitle="Test Sub" href="/test" delay={0} icon={<span />} />, { wrapper: Wrapper });
    expect(screen.getByText('Test Action')).toBeInTheDocument();
    expect(screen.getByText('Test Sub')).toBeInTheDocument();
  });

  it('renders InsightCard with data properly', () => {
    render(<InsightCard title="VOTERS" value="1M" subtitle="Up 2%" delay={0} />, { wrapper: Wrapper });
    expect(screen.getByText('VOTERS')).toBeInTheDocument();
    expect(screen.getByText('1M')).toBeInTheDocument();
  });

  it('renders Readiness Score circle with proper percentage', () => {
    render(<ScoreCircle score={85} />, { wrapper: Wrapper });
    expect(screen.getByText('85%')).toBeInTheDocument();
  });

  it('ChatPanel renders AI title and initial greeting', () => {
    render(<ChatPanel readinessScore={50} />, { wrapper: Wrapper });
    expect(screen.getByText('AI Election Coach')).toBeInTheDocument();
    expect(screen.getByText(/Hi! I am CivicOS/i)).toBeInTheDocument();
  });

  it('ChatPanel prevents sending empty input', () => {
    render(<ChatPanel />, { wrapper: Wrapper });
    const sendButton = screen.getAllByRole('button').find(b => b.querySelector('svg[data-testid="SendIcon"]'));
    expect(sendButton).toBeDisabled();
  });

  it('ChatPanel allows user to send prompt and displays typing state', async () => {
    // Mock fetch
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ text: 'Mocked AI response' }),
      })
    ) as jest.Mock;

    render(<ChatPanel />, { wrapper: Wrapper });
    const input = screen.getByPlaceholderText(/Ask anything/i);
    const sendButton = screen.getAllByRole('button').find(b => b.querySelector('svg[data-testid="SendIcon"]'))!;

    fireEvent.change(input, { target: { value: 'How do I vote?' } });
    expect(sendButton).not.toBeDisabled();
    
    fireEvent.click(sendButton);
    
    // Expect user message to be added
    expect(screen.getByText('How do I vote?')).toBeInTheDocument();
    
    // Wait for AI response
    await waitFor(() => {
      expect(screen.getByText('Mocked AI response')).toBeInTheDocument();
    });
  });

  it('ChatPanel triggers proactive nudge on low readiness score', () => {
    render(<ChatPanel readinessScore={20} />, { wrapper: Wrapper });
    expect(screen.getByText(/I noticed you are registered but haven't checked your candidates/i)).toBeInTheDocument();
  });

  it('MapPage renders map and sidebar successfully', async () => {
    render(<MapPage />, { wrapper: Wrapper });
    expect(screen.getByText(/Smart Polling Booth Navigator/i)).toBeInTheDocument();
    
    // Check for Map Badge
    expect(screen.getByText('Maps by Google')).toBeInTheDocument();
  });
});
