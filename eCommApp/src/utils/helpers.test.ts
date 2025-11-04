import { describe, it, expect } from 'vitest';
import { formatPrice, calculateTotal, validateEmail } from './helpers';

describe('helpers', () => {
  describe('formatPrice', () => {
    it('should format price as USD currency', () => {
      expect(formatPrice(10)).toBe('$10.00');
      expect(formatPrice(99.99)).toBe('$99.99');
      expect(formatPrice(1234.56)).toBe('$1,234.56');
    });

    it('should handle zero price', () => {
      expect(formatPrice(0)).toBe('$0.00');
    });

    it('should handle decimal prices correctly', () => {
      expect(formatPrice(9.5)).toBe('$9.50');
      expect(formatPrice(0.99)).toBe('$0.99');
    });

    it('should handle large numbers', () => {
      expect(formatPrice(999999.99)).toBe('$999,999.99');
      expect(formatPrice(1000000)).toBe('$1,000,000.00');
    });

    it('should handle negative prices', () => {
      expect(formatPrice(-10)).toBe('-$10.00');
      expect(formatPrice(-99.99)).toBe('-$99.99');
    });
  });

  describe('calculateTotal', () => {
    it('should calculate total for single item', () => {
      const items = [{ price: 10, quantity: 2 }];
      expect(calculateTotal(items)).toBe(20);
    });

    it('should calculate total for multiple items', () => {
      const items = [
        { price: 10, quantity: 2 },
        { price: 15, quantity: 3 },
        { price: 20, quantity: 1 }
      ];
      expect(calculateTotal(items)).toBe(85);
    });

    it('should return 0 for empty cart', () => {
      expect(calculateTotal([])).toBe(0);
    });

    it('should handle zero quantity items', () => {
      const items = [{ price: 10, quantity: 0 }];
      expect(calculateTotal(items)).toBe(0);
    });

    it('should handle decimal prices and quantities', () => {
      const items = [
        { price: 9.99, quantity: 2 },
        { price: 5.50, quantity: 3 }
      ];
      expect(calculateTotal(items)).toBeCloseTo(36.48, 2);
    });

    it('should handle items with zero price', () => {
      const items = [
        { price: 0, quantity: 5 },
        { price: 10, quantity: 1 }
      ];
      expect(calculateTotal(items)).toBe(10);
    });

    it('should handle large quantities', () => {
      const items = [{ price: 1, quantity: 1000 }];
      expect(calculateTotal(items)).toBe(1000);
    });
  });

  describe('validateEmail', () => {
    it('should validate correct email addresses', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@example.com')).toBe(true);
      expect(validateEmail('user+tag@example.co.uk')).toBe(true);
      expect(validateEmail('user123@test-domain.com')).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      expect(validateEmail('invalid')).toBe(false);
      expect(validateEmail('invalid@')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('invalid@.com')).toBe(false);
      expect(validateEmail('invalid@domain')).toBe(false);
    });

    it('should reject emails with spaces', () => {
      expect(validateEmail('invalid @example.com')).toBe(false);
      expect(validateEmail('invalid@ example.com')).toBe(false);
      expect(validateEmail(' invalid@example.com')).toBe(false);
    });

    it('should reject empty string', () => {
      expect(validateEmail('')).toBe(false);
    });

    it('should reject email without @ symbol', () => {
      expect(validateEmail('userexample.com')).toBe(false);
    });

    it('should reject email without domain extension', () => {
      expect(validateEmail('user@example')).toBe(false);
    });

    it('should handle emails with multiple dots', () => {
      expect(validateEmail('user.name.test@example.co.uk')).toBe(true);
    });
  });
});
