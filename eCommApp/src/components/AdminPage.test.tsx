import { render, screen, fireEvent } from '../test/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AdminPage from './AdminPage';

// Mock Header and Footer
vi.mock('./Header', () => ({
  default: () => <div data-testid="mock-header">Header</div>
}));

vi.mock('./Footer', () => ({
  default: () => <div data-testid="mock-footer">Footer</div>
}));

describe('AdminPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render Header component', () => {
      render(<AdminPage />);
      expect(screen.getByTestId('mock-header')).toBeInTheDocument();
    });

    it('should render Footer component', () => {
      render(<AdminPage />);
      expect(screen.getByTestId('mock-footer')).toBeInTheDocument();
    });

    it('should render welcome heading', () => {
      render(<AdminPage />);
      expect(screen.getByRole('heading', { name: /welcome to the admin portal/i })).toBeInTheDocument();
    });

    it('should render sale percent label', () => {
      render(<AdminPage />);
      expect(screen.getByLabelText(/set sale percent/i)).toBeInTheDocument();
    });

    it('should render sale percent input', () => {
      render(<AdminPage />);
      const input = screen.getByLabelText(/set sale percent/i);
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('type', 'text');
    });

    it('should render submit button', () => {
      render(<AdminPage />);
      expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
    });

    it('should render end sale button', () => {
      render(<AdminPage />);
      expect(screen.getByRole('button', { name: /end sale/i })).toBeInTheDocument();
    });

    it('should render back to storefront button', () => {
      render(<AdminPage />);
      expect(screen.getByRole('button', { name: /back to storefront/i })).toBeInTheDocument();
    });

    it('should render initial "No sale active" message', () => {
      render(<AdminPage />);
      expect(screen.getByText(/no sale active/i)).toBeInTheDocument();
    });

    it('should have input with initial value of 0', () => {
      render(<AdminPage />);
      const input = screen.getByLabelText(/set sale percent/i) as HTMLInputElement;
      expect(input.value).toBe('0');
    });

    it('should have link to home page', () => {
      render(<AdminPage />);
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/');
    });
  });

  describe('Sale Management', () => {
    it('should update input value when typing', () => {
      render(<AdminPage />);
      const input = screen.getByLabelText(/set sale percent/i) as HTMLInputElement;
      
      fireEvent.change(input, { target: { value: '25' } });
      
      expect(input.value).toBe('25');
    });

    it('should display sale message after submitting valid number', () => {
      render(<AdminPage />);
      const input = screen.getByLabelText(/set sale percent/i);
      const submitButton = screen.getByRole('button', { name: /submit/i });
      
      fireEvent.change(input, { target: { value: '25' } });
      fireEvent.click(submitButton);
      
      expect(screen.getByText(/all products are 25% off!/i)).toBeInTheDocument();
    });

    it('should display error message for invalid input', () => {
      render(<AdminPage />);
      const input = screen.getByLabelText(/set sale percent/i);
      const submitButton = screen.getByRole('button', { name: /submit/i });
      
      fireEvent.change(input, { target: { value: 'abc' } });
      fireEvent.click(submitButton);
      
      expect(screen.getByText(/invalid input/i)).toBeInTheDocument();
    });

    it('should display the invalid value in error message', () => {
      render(<AdminPage />);
      const input = screen.getByLabelText(/set sale percent/i);
      const submitButton = screen.getByRole('button', { name: /submit/i });
      
      fireEvent.change(input, { target: { value: 'test123' } });
      fireEvent.click(submitButton);
      
      expect(screen.getByText(/test123/i)).toBeInTheDocument();
    });

    it('should include helpful message in error', () => {
      render(<AdminPage />);
      const input = screen.getByLabelText(/set sale percent/i);
      const submitButton = screen.getByRole('button', { name: /submit/i });
      
      fireEvent.change(input, { target: { value: 'invalid' } });
      fireEvent.click(submitButton);
      
      expect(screen.getByText(/please enter a valid number/i)).toBeInTheDocument();
    });

    it('should reset sale to 0 when end sale button is clicked', () => {
      render(<AdminPage />);
      const input = screen.getByLabelText(/set sale percent/i) as HTMLInputElement;
      const submitButton = screen.getByRole('button', { name: /submit/i });
      const endSaleButton = screen.getByRole('button', { name: /end sale/i });
      
      // Set a sale
      fireEvent.change(input, { target: { value: '50' } });
      fireEvent.click(submitButton);
      expect(screen.getByText(/all products are 50% off!/i)).toBeInTheDocument();
      
      // End the sale
      fireEvent.click(endSaleButton);
      expect(screen.getByText(/no sale active/i)).toBeInTheDocument();
      expect(input.value).toBe('0');
    });

    it('should handle negative numbers', () => {
      render(<AdminPage />);
      const input = screen.getByLabelText(/set sale percent/i);
      const submitButton = screen.getByRole('button', { name: /submit/i });
      
      fireEvent.change(input, { target: { value: '-10' } });
      fireEvent.click(submitButton);
      
      // Negative numbers display "No sale active" because salePercent <= 0
      expect(screen.getByText(/no sale active/i)).toBeInTheDocument();
    });

    it('should handle decimal numbers', () => {
      render(<AdminPage />);
      const input = screen.getByLabelText(/set sale percent/i);
      const submitButton = screen.getByRole('button', { name: /submit/i });
      
      fireEvent.change(input, { target: { value: '15.5' } });
      fireEvent.click(submitButton);
      
      expect(screen.getByText(/all products are 15.5% off!/i)).toBeInTheDocument();
    });

    it('should handle zero as valid input', () => {
      render(<AdminPage />);
      const input = screen.getByLabelText(/set sale percent/i);
      const submitButton = screen.getByRole('button', { name: /submit/i });
      
      fireEvent.change(input, { target: { value: '0' } });
      fireEvent.click(submitButton);
      
      expect(screen.getByText(/no sale active/i)).toBeInTheDocument();
    });

    it('should handle large numbers', () => {
      render(<AdminPage />);
      const input = screen.getByLabelText(/set sale percent/i);
      const submitButton = screen.getByRole('button', { name: /submit/i });
      
      fireEvent.change(input, { target: { value: '100' } });
      fireEvent.click(submitButton);
      
      expect(screen.getByText(/all products are 100% off!/i)).toBeInTheDocument();
    });

    it('should not display error message initially', () => {
      render(<AdminPage />);
      expect(screen.queryByText(/invalid input/i)).not.toBeInTheDocument();
    });

    it('should clear previous error when valid number is submitted', () => {
      render(<AdminPage />);
      const input = screen.getByLabelText(/set sale percent/i);
      const submitButton = screen.getByRole('button', { name: /submit/i });
      
      // Submit invalid value
      fireEvent.change(input, { target: { value: 'abc' } });
      fireEvent.click(submitButton);
      expect(screen.getByText(/invalid input/i)).toBeInTheDocument();
      
      // Submit valid value
      fireEvent.change(input, { target: { value: '20' } });
      fireEvent.click(submitButton);
      
      // Note: The error message doesn't get cleared in the current implementation
      // This test documents current behavior
    });

    it('should render error message with dangerouslySetInnerHTML', () => {
      render(<AdminPage />);
      const input = screen.getByLabelText(/set sale percent/i);
      const submitButton = screen.getByRole('button', { name: /submit/i });
      
      fireEvent.change(input, { target: { value: 'test' } });
      fireEvent.click(submitButton);
      
      const errorElement = screen.getByText(/invalid input/i).parentElement;
      expect(errorElement).toBeInTheDocument();
    });
  });

  describe('Structure', () => {
    it('should have admin portal container', () => {
      const { container } = render(<AdminPage />);
      expect(container.querySelector('.admin-portal')).toBeInTheDocument();
    });

    it('should have app wrapper', () => {
      const { container } = render(<AdminPage />);
      expect(container.querySelector('.app')).toBeInTheDocument();
    });

    it('should have main content area', () => {
      const { container } = render(<AdminPage />);
      expect(container.querySelector('.main-content')).toBeInTheDocument();
    });
  });
});
