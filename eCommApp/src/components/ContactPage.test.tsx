import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import ContactPage from './ContactPage';

// Mock components
vi.mock('./Header', () => ({
    default: () => <div data-testid="header">Header</div>
}));

vi.mock('./Footer', () => ({
    default: () => <div data-testid="footer">Footer</div>
}));

const renderContactPage = () => {
    return render(
        <BrowserRouter>
            <ContactPage />
        </BrowserRouter>
    );
};

describe('ContactPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders the contact form with all fields', () => {
        renderContactPage();
        
        expect(screen.getByText('Contact Us')).toBeInTheDocument();
        expect(screen.getByLabelText('Name')).toBeInTheDocument();
        expect(screen.getByLabelText('Email')).toBeInTheDocument();
        expect(screen.getByLabelText('Request')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
    });

    it('allows user to fill in the form', () => {
        renderContactPage();
        
        const nameInput = screen.getByLabelText('Name') as HTMLInputElement;
        const emailInput = screen.getByLabelText('Email') as HTMLInputElement;
        const requestInput = screen.getByLabelText('Request') as HTMLTextAreaElement;
        
        fireEvent.change(nameInput, { target: { value: 'John Doe' } });
        fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
        fireEvent.change(requestInput, { target: { value: 'I need help with my order' } });
        
        expect(nameInput.value).toBe('John Doe');
        expect(emailInput.value).toBe('john@example.com');
        expect(requestInput.value).toBe('I need help with my order');
    });

    it('shows thank you modal when form is submitted', async () => {
        renderContactPage();
        
        const nameInput = screen.getByLabelText('Name');
        const emailInput = screen.getByLabelText('Email');
        const requestInput = screen.getByLabelText('Request');
        const submitButton = screen.getByRole('button', { name: 'Submit' });
        
        fireEvent.change(nameInput, { target: { value: 'John Doe' } });
        fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
        fireEvent.change(requestInput, { target: { value: 'I need help' } });
        fireEvent.click(submitButton);
        
        await waitFor(() => {
            expect(screen.getByText('Thank you for your message.')).toBeInTheDocument();
        });
        
        expect(screen.getByRole('button', { name: 'Continue' })).toBeInTheDocument();
    });

    it('clears form and closes modal when Continue is clicked', async () => {
        renderContactPage();
        
        const nameInput = screen.getByLabelText('Name') as HTMLInputElement;
        const emailInput = screen.getByLabelText('Email') as HTMLInputElement;
        const requestInput = screen.getByLabelText('Request') as HTMLTextAreaElement;
        const submitButton = screen.getByRole('button', { name: 'Submit' });
        
        fireEvent.change(nameInput, { target: { value: 'John Doe' } });
        fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
        fireEvent.change(requestInput, { target: { value: 'I need help' } });
        fireEvent.click(submitButton);
        
        await waitFor(() => {
            expect(screen.getByText('Thank you for your message.')).toBeInTheDocument();
        });
        
        const continueButton = screen.getByRole('button', { name: 'Continue' });
        fireEvent.click(continueButton);
        
        await waitFor(() => {
            expect(screen.queryByText('Thank you for your message.')).not.toBeInTheDocument();
        });
        
        expect(nameInput.value).toBe('');
        expect(emailInput.value).toBe('');
        expect(requestInput.value).toBe('');
    });
});
