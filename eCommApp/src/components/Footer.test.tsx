import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Footer from './Footer';

describe('Footer', () => {
  it('should render footer with copyright text', () => {
    render(<Footer />);
    
    expect(screen.getByText(/2025 The Daily Harvest. All rights reserved./i)).toBeInTheDocument();
  });

  it('should have footer element', () => {
    const { container } = render(<Footer />);
    const footer = container.querySelector('footer');
    
    expect(footer).toBeInTheDocument();
    expect(footer).toHaveClass('app-footer');
  });

  it('should render copyright symbol', () => {
    render(<Footer />);
    
    expect(screen.getByText(/©/)).toBeInTheDocument();
  });
});
