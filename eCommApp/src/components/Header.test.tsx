import { render, screen } from '../test/test-utils';
import { describe, it, expect } from 'vitest';
import Header from './Header';

describe('Header', () => {
  it('should render header with title', () => {
    render(<Header />);
    
    expect(screen.getByRole('heading', { name: /the daily harvest/i })).toBeInTheDocument();
  });

  it('should have navigation links', () => {
    render(<Header />);
    
    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /products/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /cart/i })).toBeInTheDocument();
  });

  it('should have correct navigation link paths', () => {
    render(<Header />);
    
    const homeLink = screen.getByRole('link', { name: /home/i });
    const productsLink = screen.getByRole('link', { name: /products/i });
    const cartLink = screen.getByRole('link', { name: /cart/i });
    
    expect(homeLink).toHaveAttribute('href', '/');
    expect(productsLink).toHaveAttribute('href', '/products');
    expect(cartLink).toHaveAttribute('href', '/cart');
  });

  it('should render admin login button', () => {
    render(<Header />);
    
    expect(screen.getByRole('button', { name: /admin login/i })).toBeInTheDocument();
  });

  it('should have admin login link with correct path', () => {
    render(<Header />);
    
    const loginLink = screen.getByRole('link', { name: /admin login/i });
    expect(loginLink).toHaveAttribute('href', '/login');
  });

  it('should have header element with correct class', () => {
    const { container } = render(<Header />);
    const header = container.querySelector('header');
    
    expect(header).toBeInTheDocument();
    expect(header).toHaveClass('app-header');
  });

  it('should have navigation element', () => {
    const { container } = render(<Header />);
    
    expect(container.querySelector('nav')).toBeInTheDocument();
  });

  it('should render all navigation elements in correct order', () => {
    render(<Header />);
    
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(4);
    expect(links[0]).toHaveTextContent(/home/i);
    expect(links[1]).toHaveTextContent(/products/i);
    expect(links[2]).toHaveTextContent(/cart/i);
    expect(links[3]).toHaveTextContent(/admin login/i);
  });
});
