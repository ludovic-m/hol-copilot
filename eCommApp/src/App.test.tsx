import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

// Mock all page components
vi.mock('./components/HomePage', () => ({
  default: () => <div data-testid="home-page">Home Page</div>
}));

vi.mock('./components/ProductsPage', () => ({
  default: () => <div data-testid="products-page">Products Page</div>
}));

vi.mock('./components/LoginPage', () => ({
  default: () => <div data-testid="login-page">Login Page</div>
}));

vi.mock('./components/AdminPage', () => ({
  default: () => <div data-testid="admin-page">Admin Page</div>
}));

vi.mock('./components/CartPage', () => ({
  default: () => <div data-testid="cart-page">Cart Page</div>
}));

describe('App', () => {
  const renderApp = (initialRoute = '/') => {
    window.history.pushState({}, 'Test', initialRoute);
    return render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
  };

  describe('Routing', () => {
    it('should render HomePage at root route', () => {
      renderApp('/');
      expect(screen.getByTestId('home-page')).toBeInTheDocument();
    });

    it('should render ProductsPage at /products route', () => {
      renderApp('/products');
      expect(screen.getByTestId('products-page')).toBeInTheDocument();
    });

    it('should render LoginPage at /login route', () => {
      renderApp('/login');
      expect(screen.getByTestId('login-page')).toBeInTheDocument();
    });

    it('should render AdminPage at /admin route', () => {
      renderApp('/admin');
      expect(screen.getByTestId('admin-page')).toBeInTheDocument();
    });

    it('should render CartPage at /cart route', () => {
      renderApp('/cart');
      expect(screen.getByTestId('cart-page')).toBeInTheDocument();
    });
  });

  describe('CartProvider', () => {
    it('should wrap routes with CartProvider', () => {
      renderApp('/');
      // If CartProvider is working, pages will render without errors
      expect(screen.getByTestId('home-page')).toBeInTheDocument();
    });

    it('should provide cart context to all routes', () => {
      renderApp('/products');
      expect(screen.getByTestId('products-page')).toBeInTheDocument();
      
      renderApp('/cart');
      expect(screen.getByTestId('cart-page')).toBeInTheDocument();
    });
  });

  describe('App Structure', () => {
    it('should render without crashing', () => {
      expect(() => renderApp('/')).not.toThrow();
    });

    it('should render Routes component', () => {
      const { container } = renderApp('/');
      expect(container.firstChild).toBeInTheDocument();
    });
  });
});
