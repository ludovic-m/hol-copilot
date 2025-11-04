import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CartPage from './CartPage';
import { CartContext, CartItem } from '../context/CartContext';

// Mock components
vi.mock('./Header', () => ({
    default: () => <div data-testid="header">Header</div>
}));

vi.mock('./Footer', () => ({
    default: () => <div data-testid="footer">Footer</div>
}));

vi.mock('./CheckoutModal', () => ({
    default: ({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) => (
        <div data-testid="checkout-modal">
            <button onClick={onConfirm} data-testid="confirm-btn">Confirm</button>
            <button onClick={onCancel} data-testid="cancel-btn">Cancel</button>
        </div>
    )
}));

describe('CartPage', () => {
    const mockClearCart = vi.fn();
    const mockCartItems: CartItem[] = [
        {
            id: 1,
            name: 'Product 1',
            price: 29.99,
            image: 'product1.jpg',
            quantity: 2
        },
        {
            id: 2,
            name: 'Product 2',
            price: 49.99,
            image: 'product2.jpg',
            quantity: 1
        }
    ];

    const renderWithContext = (cartItems: CartItem[] = []) => {
        const contextValue = {
            cartItems,
            addToCart: vi.fn(),
            removeFromCart: vi.fn(),
            clearCart: mockClearCart,
            updateQuantity: vi.fn()
        };

        return render(
            <CartContext.Provider value={contextValue}>
                <CartPage />
            </CartContext.Provider>
        );
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('Component Rendering', () => {
        it('should render header and footer', () => {
            renderWithContext();
            expect(screen.getByTestId('header')).toBeInTheDocument();
            expect(screen.getByTestId('footer')).toBeInTheDocument();
        });

        it('should render "Your Cart" heading', () => {
            renderWithContext();
            expect(screen.getByRole('heading', { name: /your cart/i })).toBeInTheDocument();
        });

        it('should have proper app structure', () => {
            const { container } = renderWithContext();
            expect(container.querySelector('.app')).toBeInTheDocument();
            expect(container.querySelector('.main-content')).toBeInTheDocument();
        });
    });

    describe('Empty Cart Scenarios', () => {
        it('should display empty cart message when cart is empty', () => {
            renderWithContext([]);
            expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
        });

        it('should not display checkout button when cart is empty', () => {
            renderWithContext([]);
            expect(screen.queryByRole('button', { name: /checkout/i })).not.toBeInTheDocument();
        });

        it('should not display cart items grid when cart is empty', () => {
            const { container } = renderWithContext([]);
            expect(container.querySelector('.cart-items-grid')).not.toBeInTheDocument();
        });
    });

    describe('Cart with Items', () => {
        it('should display all cart items', () => {
            renderWithContext(mockCartItems);
            expect(screen.getByText('Product 1')).toBeInTheDocument();
            expect(screen.getByText('Product 2')).toBeInTheDocument();
        });

        it('should display correct prices', () => {
            renderWithContext(mockCartItems);
            expect(screen.getByText('Price: $29.99')).toBeInTheDocument();
            expect(screen.getByText('Price: $49.99')).toBeInTheDocument();
        });

        it('should display correct quantities', () => {
            renderWithContext(mockCartItems);
            expect(screen.getByText('Quantity: 2')).toBeInTheDocument();
            expect(screen.getByText('Quantity: 1')).toBeInTheDocument();
        });

        it('should display product images with correct src and alt attributes', () => {
            renderWithContext(mockCartItems);
            const images = screen.getAllByRole('img');
            expect(images[0]).toHaveAttribute('src', 'products/productImages/product1.jpg');
            expect(images[0]).toHaveAttribute('alt', 'Product 1');
            expect(images[1]).toHaveAttribute('src', 'products/productImages/product2.jpg');
            expect(images[1]).toHaveAttribute('alt', 'Product 2');
        });

        it('should display checkout button when cart has items', () => {
            renderWithContext(mockCartItems);
            expect(screen.getByRole('button', { name: /checkout/i })).toBeInTheDocument();
        });

        it('should render cart items with unique keys', () => {
            const { container } = renderWithContext(mockCartItems);
            const cartItemCards = container.querySelectorAll('.cart-item-card');
            expect(cartItemCards).toHaveLength(2);
        });
    });

    describe('Checkout Flow - Happy Path', () => {
        it('should open checkout modal when checkout button is clicked', () => {
            renderWithContext(mockCartItems);
            const checkoutBtn = screen.getByRole('button', { name: /checkout/i });
            
            fireEvent.click(checkoutBtn);
            
            expect(screen.getByTestId('checkout-modal')).toBeInTheDocument();
        });

        it('should not display checkout modal initially', () => {
            renderWithContext(mockCartItems);
            expect(screen.queryByTestId('checkout-modal')).not.toBeInTheDocument();
        });

        it('should process order and clear cart when confirmed', async () => {
            renderWithContext(mockCartItems);
            
            fireEvent.click(screen.getByRole('button', { name: /checkout/i }));
            fireEvent.click(screen.getByTestId('confirm-btn'));
            
            await waitFor(() => {
                expect(mockClearCart).toHaveBeenCalledTimes(1);
            });
        });

        it('should show order processed page after confirmation', async () => {
            renderWithContext(mockCartItems);
            
            fireEvent.click(screen.getByRole('button', { name: /checkout/i }));
            fireEvent.click(screen.getByTestId('confirm-btn'));
            
            await waitFor(() => {
                expect(screen.getByText(/your order has been processed/i)).toBeInTheDocument();
            });
        });

        it('should display processed items after order confirmation', async () => {
            renderWithContext(mockCartItems);
            
            fireEvent.click(screen.getByRole('button', { name: /checkout/i }));
            fireEvent.click(screen.getByTestId('confirm-btn'));
            
            await waitFor(() => {
                expect(screen.getByText('Product 1')).toBeInTheDocument();
                expect(screen.getByText('Product 2')).toBeInTheDocument();
            });
        });
    });

    describe('Checkout Flow - Negative Scenarios', () => {
        it('should close modal and not clear cart when cancelled', () => {
            renderWithContext(mockCartItems);
            
            fireEvent.click(screen.getByRole('button', { name: /checkout/i }));
            fireEvent.click(screen.getByTestId('cancel-btn'));
            
            expect(screen.queryByTestId('checkout-modal')).not.toBeInTheDocument();
            expect(mockClearCart).not.toHaveBeenCalled();
        });

        it('should keep cart items visible after cancelling checkout', () => {
            renderWithContext(mockCartItems);
            
            fireEvent.click(screen.getByRole('button', { name: /checkout/i }));
            fireEvent.click(screen.getByTestId('cancel-btn'));
            
            expect(screen.getByText('Product 1')).toBeInTheDocument();
            expect(screen.getByText('Product 2')).toBeInTheDocument();
        });

        it('should allow multiple checkout attempts after cancellation', () => {
            renderWithContext(mockCartItems);
            
            // First attempt
            fireEvent.click(screen.getByRole('button', { name: /checkout/i }));
            fireEvent.click(screen.getByTestId('cancel-btn'));
            
            // Second attempt
            fireEvent.click(screen.getByRole('button', { name: /checkout/i }));
            expect(screen.getByTestId('checkout-modal')).toBeInTheDocument();
        });
    });

    describe('Edge Cases', () => {
        it('should throw error when CartContext is not provided', () => {
            // Suppress console.error for this test
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
            
            expect(() => render(<CartPage />)).toThrow('CartContext must be used within a CartProvider');
            
            consoleSpy.mockRestore();
        });

        it('should handle single item in cart', () => {
            const singleItem = [mockCartItems[0]];
            renderWithContext(singleItem);
            
            expect(screen.getByText('Product 1')).toBeInTheDocument();
            expect(screen.queryByText('Product 2')).not.toBeInTheDocument();
        });

        it('should handle items with zero price', () => {
            const freeItem: CartItem[] = [{
                id: 99,
                name: 'Free Item',
                price: 0,
                image: 'free.jpg',
                quantity: 1
            }];
            
            renderWithContext(freeItem);
            expect(screen.getByText('Price: $0.00')).toBeInTheDocument();
        });

        it('should handle items with large quantities', () => {
            const largeQuantityItem: CartItem[] = [{
                id: 100,
                name: 'Bulk Item',
                price: 5.99,
                image: 'bulk.jpg',
                quantity: 999
            }];
            
            renderWithContext(largeQuantityItem);
            expect(screen.getByText('Quantity: 999')).toBeInTheDocument();
        });

        it('should handle items with very long names', () => {
            const longNameItem: CartItem[] = [{
                id: 101,
                name: 'A'.repeat(200),
                price: 10.00,
                image: 'long.jpg',
                quantity: 1
            }];
            
            renderWithContext(longNameItem);
            expect(screen.getByText('A'.repeat(200))).toBeInTheDocument();
        });

        it('should handle items with decimal prices correctly', () => {
            const decimalPriceItem: CartItem[] = [{
                id: 102,
                name: 'Decimal Price Item',
                price: 19.999,
                image: 'decimal.jpg',
                quantity: 1
            }];
            
            renderWithContext(decimalPriceItem);
            expect(screen.getByText('Price: $20.00')).toBeInTheDocument();
        });

        it('should handle special characters in product names', () => {
            const specialCharItem: CartItem[] = [{
                id: 103,
                name: 'Product & "Special" <Characters>',
                price: 15.99,
                image: 'special.jpg',
                quantity: 1
            }];
            
            renderWithContext(specialCharItem);
            expect(screen.getByText('Product & "Special" <Characters>')).toBeInTheDocument();
        });

        it('should preserve processed items after order is placed', async () => {
            renderWithContext(mockCartItems);
            
            fireEvent.click(screen.getByRole('button', { name: /checkout/i }));
            fireEvent.click(screen.getByTestId('confirm-btn'));
            
            await waitFor(() => {
                const images = screen.getAllByRole('img');
                expect(images).toHaveLength(2);
                expect(images[0]).toHaveAttribute('src', 'products/productImages/product1.jpg');
            });
        });

        it('should handle empty image path', () => {
            const emptyImageItem: CartItem[] = [{
                id: 104,
                name: 'No Image Product',
                price: 25.00,
                image: '',
                quantity: 1
            }];
            
            renderWithContext(emptyImageItem);
            const image = screen.getByRole('img');
            expect(image).toHaveAttribute('src', 'products/productImages/');
        });
    });

    describe('State Management', () => {
        it('should maintain cart state between renders', () => {
            const { rerender } = renderWithContext(mockCartItems);
            
            expect(screen.getByText('Product 1')).toBeInTheDocument();
            
            rerender(
                <CartContext.Provider value={{
                    cartItems: mockCartItems,
                    addToCart: vi.fn(),
                    removeFromCart: vi.fn(),
                    clearCart: mockClearCart,
                    updateQuantity: vi.fn()
                }}>
                    <CartPage />
                </CartContext.Provider>
            );
            
            expect(screen.getByText('Product 1')).toBeInTheDocument();
        });

        it('should not show modal after order is processed', async () => {
            renderWithContext(mockCartItems);
            
            fireEvent.click(screen.getByRole('button', { name: /checkout/i }));
            fireEvent.click(screen.getByTestId('confirm-btn'));
            
            await waitFor(() => {
                expect(screen.queryByTestId('checkout-modal')).not.toBeInTheDocument();
            });
        });
    });

    describe('Accessibility', () => {
        it('should have accessible images with alt text', () => {
            renderWithContext(mockCartItems);
            const images = screen.getAllByRole('img');
            
            images.forEach(img => {
                expect(img).toHaveAttribute('alt');
            });
        });

        it('should have accessible button for checkout', () => {
            renderWithContext(mockCartItems);
            const button = screen.getByRole('button', { name: /checkout/i });
            expect(button).toBeInTheDocument();
        });
    });
});

