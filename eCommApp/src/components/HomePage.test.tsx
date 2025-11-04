import { render, screen } from '../test/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import HomePage from './HomePage';

// Mock the Header and Footer components
vi.mock('./Header', () => ({
  default: () => <div data-testid="mock-header">Header</div>
}));

vi.mock('./Footer', () => ({
  default: () => <div data-testid="mock-footer">Footer</div>
}));

describe('HomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render Header component', () => {
    render(<HomePage />);
    
    expect(screen.getByTestId('mock-header')).toBeInTheDocument();
  });

  it('should render Footer component', () => {
    render(<HomePage />);
    
    expect(screen.getByTestId('mock-footer')).toBeInTheDocument();
  });

  it('should render welcome heading', () => {
    render(<HomePage />);
    
    expect(screen.getByRole('heading', { name: /welcome to the the daily harvest!/i })).toBeInTheDocument();
  });

  it('should render description text', () => {
    render(<HomePage />);
    
    expect(screen.getByText(/check out our products page for some great deals/i)).toBeInTheDocument();
  });

  it('should have main content area', () => {
    const { container } = render(<HomePage />);
    
    expect(container.querySelector('.main-content')).toBeInTheDocument();
  });

  it('should have app wrapper', () => {
    const { container } = render(<HomePage />);
    
    expect(container.querySelector('.app')).toBeInTheDocument();
  });

  it('should render main element', () => {
    const { container } = render(<HomePage />);
    
    const main = container.querySelector('main');
    expect(main).toBeInTheDocument();
    expect(main).toHaveClass('main-content');
  });

  it('should have correct structure', () => {
    const { container } = render(<HomePage />);
    
    const app = container.querySelector('.app');
    const main = container.querySelector('.main-content');
    
    expect(app).toBeInTheDocument();
    expect(main).toBeInTheDocument();
  });
});
