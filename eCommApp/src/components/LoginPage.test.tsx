import { render, screen, fireEvent, waitFor } from '../test/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import LoginPage from './LoginPage';

// Mock the useNavigate hook
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock Header and Footer
vi.mock('./Header', () => ({
  default: () => <div data-testid="mock-header">Header</div>
}));

vi.mock('./Footer', () => ({
  default: () => <div data-testid="mock-footer">Footer</div>
}));

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render Header component', () => {
      render(<LoginPage />);
      expect(screen.getByTestId('mock-header')).toBeInTheDocument();
    });

    it('should render Footer component', () => {
      render(<LoginPage />);
      expect(screen.getByTestId('mock-footer')).toBeInTheDocument();
    });

    it('should render admin login heading', () => {
      render(<LoginPage />);
      expect(screen.getByRole('heading', { name: /admin login/i })).toBeInTheDocument();
    });

    it('should render username input', () => {
      render(<LoginPage />);
      expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
    });

    it('should render password input', () => {
      render(<LoginPage />);
      expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    });

    it('should render login button', () => {
      render(<LoginPage />);
      expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    });

    it('should have password input type', () => {
      render(<LoginPage />);
      const passwordInput = screen.getByPlaceholderText(/password/i);
      expect(passwordInput).toHaveAttribute('type', 'password');
    });

    it('should have text input type for username', () => {
      render(<LoginPage />);
      const usernameInput = screen.getByPlaceholderText(/username/i);
      expect(usernameInput).toHaveAttribute('type', 'text');
    });

    it('should have autofocus on username input', () => {
      render(<LoginPage />);
      const usernameInput = screen.getByPlaceholderText(/username/i);
      expect(usernameInput).toHaveProperty('autofocus');
    });

    it('should have login container', () => {
      const { container } = render(<LoginPage />);
      expect(container.querySelector('.login-container')).toBeInTheDocument();
    });
  });

  describe('Form Interactions', () => {
    it('should update username input value', () => {
      render(<LoginPage />);
      const usernameInput = screen.getByPlaceholderText(/username/i) as HTMLInputElement;
      
      fireEvent.change(usernameInput, { target: { value: 'testuser' } });
      
      expect(usernameInput.value).toBe('testuser');
    });

    it('should update password input value', () => {
      render(<LoginPage />);
      const passwordInput = screen.getByPlaceholderText(/password/i) as HTMLInputElement;
      
      fireEvent.change(passwordInput, { target: { value: 'testpass' } });
      
      expect(passwordInput.value).toBe('testpass');
    });

    it('should navigate to admin page on successful login', async () => {
      render(<LoginPage />);
      
      const usernameInput = screen.getByPlaceholderText(/username/i);
      const passwordInput = screen.getByPlaceholderText(/password/i);
      const loginButton = screen.getByRole('button', { name: /login/i });
      
      fireEvent.change(usernameInput, { target: { value: 'admin' } });
      fireEvent.change(passwordInput, { target: { value: 'admin' } });
      fireEvent.click(loginButton);
      
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/admin');
      });
    });

    it('should display error message on invalid credentials', async () => {
      render(<LoginPage />);
      
      const usernameInput = screen.getByPlaceholderText(/username/i);
      const passwordInput = screen.getByPlaceholderText(/password/i);
      const loginButton = screen.getByRole('button', { name: /login/i });
      
      fireEvent.change(usernameInput, { target: { value: 'wrong' } });
      fireEvent.change(passwordInput, { target: { value: 'wrong' } });
      fireEvent.click(loginButton);
      
      await waitFor(() => {
        expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
      });
    });

    it('should not navigate on invalid credentials', async () => {
      render(<LoginPage />);
      
      const usernameInput = screen.getByPlaceholderText(/username/i);
      const passwordInput = screen.getByPlaceholderText(/password/i);
      const loginButton = screen.getByRole('button', { name: /login/i });
      
      fireEvent.change(usernameInput, { target: { value: 'wrong' } });
      fireEvent.change(passwordInput, { target: { value: 'wrong' } });
      fireEvent.click(loginButton);
      
      await waitFor(() => {
        expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
      });
      
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('should clear form on successful login', async () => {
      render(<LoginPage />);
      
      const usernameInput = screen.getByPlaceholderText(/username/i) as HTMLInputElement;
      const passwordInput = screen.getByPlaceholderText(/password/i) as HTMLInputElement;
      const loginButton = screen.getByRole('button', { name: /login/i });
      
      fireEvent.change(usernameInput, { target: { value: 'admin' } });
      fireEvent.change(passwordInput, { target: { value: 'admin' } });
      fireEvent.click(loginButton);
      
      await waitFor(() => {
        expect(usernameInput.value).toBe('');
        expect(passwordInput.value).toBe('');
      });
    });

    it('should clear error message on successful login', async () => {
      render(<LoginPage />);
      
      const usernameInput = screen.getByPlaceholderText(/username/i);
      const passwordInput = screen.getByPlaceholderText(/password/i);
      const loginButton = screen.getByRole('button', { name: /login/i });
      
      // First try with wrong credentials
      fireEvent.change(usernameInput, { target: { value: 'wrong' } });
      fireEvent.change(passwordInput, { target: { value: 'wrong' } });
      fireEvent.click(loginButton);
      
      await waitFor(() => {
        expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
      });
      
      // Then try with correct credentials
      fireEvent.change(usernameInput, { target: { value: 'admin' } });
      fireEvent.change(passwordInput, { target: { value: 'admin' } });
      fireEvent.click(loginButton);
      
      await waitFor(() => {
        expect(screen.queryByText(/invalid credentials/i)).not.toBeInTheDocument();
      });
    });

    it('should require correct username', async () => {
      render(<LoginPage />);
      
      const usernameInput = screen.getByPlaceholderText(/username/i);
      const passwordInput = screen.getByPlaceholderText(/password/i);
      const loginButton = screen.getByRole('button', { name: /login/i });
      
      fireEvent.change(usernameInput, { target: { value: 'wronguser' } });
      fireEvent.change(passwordInput, { target: { value: 'admin' } });
      fireEvent.click(loginButton);
      
      await waitFor(() => {
        expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
      });
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('should require correct password', async () => {
      render(<LoginPage />);
      
      const usernameInput = screen.getByPlaceholderText(/username/i);
      const passwordInput = screen.getByPlaceholderText(/password/i);
      const loginButton = screen.getByRole('button', { name: /login/i });
      
      fireEvent.change(usernameInput, { target: { value: 'admin' } });
      fireEvent.change(passwordInput, { target: { value: 'wrongpass' } });
      fireEvent.click(loginButton);
      
      await waitFor(() => {
        expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
      });
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('should handle form submission with enter key', async () => {
      render(<LoginPage />);
      
      const usernameInput = screen.getByPlaceholderText(/username/i);
      const passwordInput = screen.getByPlaceholderText(/password/i);
      
      fireEvent.change(usernameInput, { target: { value: 'admin' } });
      fireEvent.change(passwordInput, { target: { value: 'admin' } });
      
      const form = usernameInput.closest('form');
      fireEvent.submit(form!);
      
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/admin');
      });
    });

    it('should not display error message initially', () => {
      render(<LoginPage />);
      expect(screen.queryByText(/invalid credentials/i)).not.toBeInTheDocument();
    });
  });
});
