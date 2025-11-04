import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ReviewModal from './ReviewModal';
import { Product } from '../types';

describe('ReviewModal', () => {
  const mockOnClose = vi.fn();
  const mockOnSubmit = vi.fn();

  const mockProduct: Product = {
    id: '1',
    name: 'Test Product',
    price: 29.99,
    description: 'A great product',
    image: 'test.jpg',
    reviews: [
      { author: 'John Doe', comment: 'Great product!', date: '2025-01-01T00:00:00.000Z' },
      { author: 'Jane Smith', comment: 'Love it!', date: '2025-01-02T00:00:00.000Z' }
    ],
    inStock: true
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render modal with product name', () => {
      render(<ReviewModal product={mockProduct} onClose={mockOnClose} onSubmit={mockOnSubmit} />);
      
      expect(screen.getByRole('heading', { name: /reviews for test product/i })).toBeInTheDocument();
    });

    it('should return null when product is null', () => {
      const { container } = render(<ReviewModal product={null} onClose={mockOnClose} onSubmit={mockOnSubmit} />);
      
      expect(container.firstChild).toBeNull();
    });

    it('should render existing reviews', () => {
      render(<ReviewModal product={mockProduct} onClose={mockOnClose} onSubmit={mockOnSubmit} />);
      
      expect(screen.getByText(/john doe/i)).toBeInTheDocument();
      expect(screen.getByText(/great product!/i)).toBeInTheDocument();
      expect(screen.getByText(/jane smith/i)).toBeInTheDocument();
      expect(screen.getByText(/love it!/i)).toBeInTheDocument();
    });

    it('should display "No reviews yet" when product has no reviews', () => {
      const productWithoutReviews: Product = {
        ...mockProduct,
        reviews: []
      };
      
      render(<ReviewModal product={productWithoutReviews} onClose={mockOnClose} onSubmit={mockOnSubmit} />);
      
      expect(screen.getByText(/no reviews yet/i)).toBeInTheDocument();
    });

    it('should render review form', () => {
      render(<ReviewModal product={mockProduct} onClose={mockOnClose} onSubmit={mockOnSubmit} />);
      
      expect(screen.getByRole('heading', { name: /leave a review/i })).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/your name/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/your review/i)).toBeInTheDocument();
    });

    it('should render submit button', () => {
      render(<ReviewModal product={mockProduct} onClose={mockOnClose} onSubmit={mockOnSubmit} />);
      
      expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
    });

    it('should render close button', () => {
      render(<ReviewModal product={mockProduct} onClose={mockOnClose} onSubmit={mockOnSubmit} />);
      
      expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
    });

    it('should have modal backdrop', () => {
      const { container } = render(<ReviewModal product={mockProduct} onClose={mockOnClose} onSubmit={mockOnSubmit} />);
      
      expect(container.querySelector('.modal-backdrop')).toBeInTheDocument();
    });

    it('should have modal content', () => {
      const { container } = render(<ReviewModal product={mockProduct} onClose={mockOnClose} onSubmit={mockOnSubmit} />);
      
      expect(container.querySelector('.modal-content')).toBeInTheDocument();
    });

    it('should display review dates in localized format', () => {
      render(<ReviewModal product={mockProduct} onClose={mockOnClose} onSubmit={mockOnSubmit} />);
      
      const date = new Date('2025-01-01T00:00:00.000Z').toLocaleDateString();
      expect(screen.getByText(new RegExp(date))).toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('should call onClose when close button is clicked', () => {
      render(<ReviewModal product={mockProduct} onClose={mockOnClose} onSubmit={mockOnSubmit} />);
      
      const closeButton = screen.getByRole('button', { name: /close/i });
      fireEvent.click(closeButton);
      
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should call onClose when backdrop is clicked', () => {
      const { container } = render(<ReviewModal product={mockProduct} onClose={mockOnClose} onSubmit={mockOnSubmit} />);
      
      const backdrop = container.querySelector('.modal-backdrop');
      fireEvent.click(backdrop!);
      
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should not call onClose when modal content is clicked', () => {
      const { container } = render(<ReviewModal product={mockProduct} onClose={mockOnClose} onSubmit={mockOnSubmit} />);
      
      const modalContent = container.querySelector('.modal-content');
      fireEvent.click(modalContent!);
      
      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('should submit review with form data', () => {
      render(<ReviewModal product={mockProduct} onClose={mockOnClose} onSubmit={mockOnSubmit} />);
      
      const nameInput = screen.getByPlaceholderText(/your name/i);
      const commentInput = screen.getByPlaceholderText(/your review/i);
      const submitButton = screen.getByRole('button', { name: /submit/i });
      
      fireEvent.change(nameInput, { target: { value: 'Test User' } });
      fireEvent.change(commentInput, { target: { value: 'This is a test review' } });
      fireEvent.click(submitButton);
      
      expect(mockOnSubmit).toHaveBeenCalledTimes(1);
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          author: 'Test User',
          comment: 'This is a test review',
          date: expect.any(String)
        })
      );
    });

    it('should include ISO date string in submitted review', () => {
      render(<ReviewModal product={mockProduct} onClose={mockOnClose} onSubmit={mockOnSubmit} />);
      
      const nameInput = screen.getByPlaceholderText(/your name/i);
      const commentInput = screen.getByPlaceholderText(/your review/i);
      const submitButton = screen.getByRole('button', { name: /submit/i });
      
      fireEvent.change(nameInput, { target: { value: 'Test User' } });
      fireEvent.change(commentInput, { target: { value: 'Test comment' } });
      fireEvent.click(submitButton);
      
      const submittedReview = mockOnSubmit.mock.calls[0][0];
      expect(submittedReview.date).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    });

    it('should require name input', () => {
      render(<ReviewModal product={mockProduct} onClose={mockOnClose} onSubmit={mockOnSubmit} />);
      
      const nameInput = screen.getByPlaceholderText(/your name/i);
      expect(nameInput).toBeRequired();
    });

    it('should require comment input', () => {
      render(<ReviewModal product={mockProduct} onClose={mockOnClose} onSubmit={mockOnSubmit} />);
      
      const commentInput = screen.getByPlaceholderText(/your review/i);
      expect(commentInput).toBeRequired();
    });
  });

  describe('Review Display', () => {
    it('should render reviews list container', () => {
      const { container } = render(<ReviewModal product={mockProduct} onClose={mockOnClose} onSubmit={mockOnSubmit} />);
      
      expect(container.querySelector('.reviews-list')).toBeInTheDocument();
    });

    it('should render review form container', () => {
      const { container } = render(<ReviewModal product={mockProduct} onClose={mockOnClose} onSubmit={mockOnSubmit} />);
      
      expect(container.querySelector('.review-form')).toBeInTheDocument();
    });

    it('should render individual review containers', () => {
      const { container } = render(<ReviewModal product={mockProduct} onClose={mockOnClose} onSubmit={mockOnSubmit} />);
      
      const reviews = container.querySelectorAll('.review');
      expect(reviews).toHaveLength(2);
    });

    it('should render review comments with dangerouslySetInnerHTML', () => {
      const productWithHtmlReview: Product = {
        ...mockProduct,
        reviews: [
          { author: 'Test', comment: '<b>Bold text</b>', date: '2025-01-01T00:00:00.000Z' }
        ]
      };
      
      render(<ReviewModal product={productWithHtmlReview} onClose={mockOnClose} onSubmit={mockOnSubmit} />);
      
      const boldText = screen.getByText('Bold text');
      expect(boldText.tagName).toBe('B');
    });

    it('should have close button with correct class', () => {
      render(<ReviewModal product={mockProduct} onClose={mockOnClose} onSubmit={mockOnSubmit} />);
      
      const closeButton = screen.getByRole('button', { name: /close/i });
      expect(closeButton).toHaveClass('close-button');
    });
  });
});
