import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CartProvider, CartContext } from './CartContext';
import { useContext } from 'react';
import { Product } from '../types';

// Test component to consume context
const TestConsumer = () => {
  const context = useContext(CartContext);
  
  if (!context) {
    return <div>No context</div>;
  }

  const { cartItems, addToCart, clearCart } = context;

  return (
    <div>
      <div data-testid="cart-count">{cartItems.length}</div>
      <ul>
        {cartItems.map((item, index) => (
          <li key={index} data-testid={`item-${index}`}>
            {item.name} - {item.quantity}
          </li>
        ))}
      </ul>
      <button onClick={() => addToCart({
        id: '1',
        name: 'Test Product',
        price: 10,
        image: 'test.jpg',
        reviews: [],
        inStock: true
      })}>Add Item</button>
      <button onClick={clearCart}>Clear Cart</button>
    </div>
  );
};

describe('CartContext', () => {
  describe('CartProvider', () => {
    it('should provide cart context to children', () => {
      render(
        <CartProvider>
          <TestConsumer />
        </CartProvider>
      );

      expect(screen.getByTestId('cart-count')).toHaveTextContent('0');
    });

    it('should initialize with empty cart', () => {
      render(
        <CartProvider>
          <TestConsumer />
        </CartProvider>
      );

      expect(screen.getByTestId('cart-count')).toHaveTextContent('0');
    });
  });

  describe('addToCart', () => {
    it('should add new item to cart', async () => {
      render(
        <CartProvider>
          <TestConsumer />
        </CartProvider>
      );

      const addButton = screen.getByRole('button', { name: /add item/i });
      addButton.click();

      await waitFor(() => {
        expect(screen.getByTestId('cart-count')).toHaveTextContent('1');
      });

      expect(screen.getByTestId('item-0')).toHaveTextContent('Test Product - 1');
    });

    it('should increment quantity if item already in cart', async () => {
      render(
        <CartProvider>
          <TestConsumer />
        </CartProvider>
      );

      const addButton = screen.getByRole('button', { name: /add item/i });
      
      addButton.click();
      await waitFor(() => {
        expect(screen.getByTestId('cart-count')).toHaveTextContent('1');
      });

      addButton.click();
      await waitFor(() => {
        expect(screen.getByTestId('item-0')).toHaveTextContent('Test Product - 2');
      });
    });

    it('should handle adding multiple different items', async () => {
      const TestMultipleItems = () => {
        const context = useContext(CartContext);
        if (!context) return null;

        const { cartItems, addToCart } = context;

        const product1: Product = {
          id: '1',
          name: 'Product 1',
          price: 10,
          reviews: [],
          inStock: true
        };

        const product2: Product = {
          id: '2',
          name: 'Product 2',
          price: 20,
          reviews: [],
          inStock: true
        };

        return (
          <div>
            <div data-testid="cart-count">{cartItems.length}</div>
            {cartItems.map((item, index) => (
              <div key={index} data-testid={`item-${index}`}>
                {item.name}
              </div>
            ))}
            <button onClick={() => addToCart(product1)}>Add Product 1</button>
            <button onClick={() => addToCart(product2)}>Add Product 2</button>
          </div>
        );
      };

      render(
        <CartProvider>
          <TestMultipleItems />
        </CartProvider>
      );

      screen.getByRole('button', { name: /add product 1/i }).click();
      await waitFor(() => {
        expect(screen.getByTestId('cart-count')).toHaveTextContent('1');
      });

      screen.getByRole('button', { name: /add product 2/i }).click();
      await waitFor(() => {
        expect(screen.getByTestId('cart-count')).toHaveTextContent('2');
      });

      expect(screen.getByTestId('item-0')).toHaveTextContent('Product 1');
      expect(screen.getByTestId('item-1')).toHaveTextContent('Product 2');
    });
  });

  describe('clearCart', () => {
    it('should clear all items from cart', async () => {
      render(
        <CartProvider>
          <TestConsumer />
        </CartProvider>
      );

      const addButton = screen.getByRole('button', { name: /add item/i });
      const clearButton = screen.getByRole('button', { name: /clear cart/i });

      addButton.click();
      await waitFor(() => {
        expect(screen.getByTestId('cart-count')).toHaveTextContent('1');
      });

      clearButton.click();
      await waitFor(() => {
        expect(screen.getByTestId('cart-count')).toHaveTextContent('0');
      });
    });

    it('should handle clearing already empty cart', async () => {
      render(
        <CartProvider>
          <TestConsumer />
        </CartProvider>
      );

      const clearButton = screen.getByRole('button', { name: /clear cart/i });
      
      expect(screen.getByTestId('cart-count')).toHaveTextContent('0');
      
      clearButton.click();
      await waitFor(() => {
        expect(screen.getByTestId('cart-count')).toHaveTextContent('0');
      });
    });
  });

  describe('CartContext without provider', () => {
    it('should return undefined when used outside provider', () => {
      const TestWithoutProvider = () => {
        const context = useContext(CartContext);
        return <div>{context ? 'Has context' : 'No context'}</div>;
      };

      render(<TestWithoutProvider />);
      expect(screen.getByText('No context')).toBeInTheDocument();
    });
  });
});
