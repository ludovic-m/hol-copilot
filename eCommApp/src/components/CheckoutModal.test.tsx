import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CheckoutModal from './CheckoutModal';

describe('CheckoutModal', () => {
  const mockOnConfirm = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render modal with heading', () => {
    render(<CheckoutModal onConfirm={mockOnConfirm} onCancel={mockOnCancel} />);
    
    expect(screen.getByRole('heading', { name: /are you sure\?/i })).toBeInTheDocument();
  });

  it('should render confirmation message', () => {
    render(<CheckoutModal onConfirm={mockOnConfirm} onCancel={mockOnCancel} />);
    
    expect(screen.getByText(/do you want to proceed with the checkout\?/i)).toBeInTheDocument();
  });

  it('should render confirm button', () => {
    render(<CheckoutModal onConfirm={mockOnConfirm} onCancel={mockOnCancel} />);
    
    expect(screen.getByRole('button', { name: /continue checkout/i })).toBeInTheDocument();
  });

  it('should render cancel button', () => {
    render(<CheckoutModal onConfirm={mockOnConfirm} onCancel={mockOnCancel} />);
    
    expect(screen.getByRole('button', { name: /return to cart/i })).toBeInTheDocument();
  });

  it('should call onConfirm when confirm button is clicked', () => {
    render(<CheckoutModal onConfirm={mockOnConfirm} onCancel={mockOnCancel} />);
    
    const confirmButton = screen.getByRole('button', { name: /continue checkout/i });
    fireEvent.click(confirmButton);
    
    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
    expect(mockOnCancel).not.toHaveBeenCalled();
  });

  it('should call onCancel when cancel button is clicked', () => {
    render(<CheckoutModal onConfirm={mockOnConfirm} onCancel={mockOnCancel} />);
    
    const cancelButton = screen.getByRole('button', { name: /return to cart/i });
    fireEvent.click(cancelButton);
    
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
    expect(mockOnConfirm).not.toHaveBeenCalled();
  });

  it('should have modal backdrop', () => {
    const { container } = render(<CheckoutModal onConfirm={mockOnConfirm} onCancel={mockOnCancel} />);
    
    expect(container.querySelector('.modal-backdrop')).toBeInTheDocument();
  });

  it('should have modal content', () => {
    const { container } = render(<CheckoutModal onConfirm={mockOnConfirm} onCancel={mockOnCancel} />);
    
    expect(container.querySelector('.modal-content')).toBeInTheDocument();
  });

  it('should have checkout modal actions container', () => {
    const { container } = render(<CheckoutModal onConfirm={mockOnConfirm} onCancel={mockOnCancel} />);
    
    expect(container.querySelector('.checkout-modal-actions')).toBeInTheDocument();
  });

  it('should have cancel button with correct class', () => {
    render(<CheckoutModal onConfirm={mockOnConfirm} onCancel={mockOnCancel} />);
    
    const cancelButton = screen.getByRole('button', { name: /return to cart/i });
    expect(cancelButton).toHaveClass('cancel-btn');
  });

  it('should call handlers only once per click', () => {
    render(<CheckoutModal onConfirm={mockOnConfirm} onCancel={mockOnCancel} />);
    
    const confirmButton = screen.getByRole('button', { name: /continue checkout/i });
    fireEvent.click(confirmButton);
    fireEvent.click(confirmButton);
    
    expect(mockOnConfirm).toHaveBeenCalledTimes(2);
  });

  it('should render both buttons in actions container', () => {
    const { container } = render(<CheckoutModal onConfirm={mockOnConfirm} onCancel={mockOnCancel} />);
    
    const actionsContainer = container.querySelector('.checkout-modal-actions');
    const buttons = actionsContainer?.querySelectorAll('button');
    
    expect(buttons).toHaveLength(2);
  });
});
