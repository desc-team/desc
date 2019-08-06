import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import SignupForm from './SignupForm';

describe('SignupForm', () => {
    afterEach(cleanup);

    it('renders an input for first name', () => {
        const { getByLabelText } = render(<SignupForm />);
        expect(getByLabelText('First Name')).toBeTruthy();
    });

    it('renders an input for last name', () => {
        const { getByLabelText } = render(<SignupForm />);
        expect(getByLabelText('Last Name')).toBeTruthy();
    });

    it('renders an input for email', () => {
        const { getByLabelText } = render(<SignupForm />);
        expect(getByLabelText('Your Email')).toBeTruthy();
    });

    it('renders an input for password', () => {
        const { getByLabelText } = render(<SignupForm />);
        expect(getByLabelText('Password')).toBeTruthy();
    });

    it('renders an input to confirm password', () => {
        const { getByLabelText } = render(<SignupForm />);
        expect(getByLabelText('Confirm Password')).toBeTruthy();
    });

    it('does not display message if password fields match', () => {
        const { getByLabelText, queryByText } = render(<SignupForm />);
        const passwordInput = getByLabelText('Password');
        const confirmPasswordInput = getByLabelText('Confirm Password');
        fireEvent.change(passwordInput, { target: { value: 'correctpassword' } });
        fireEvent.change(confirmPasswordInput, { target: { value: 'correctpassword' } });
        expect(queryByText('Passwords do NOT match')).toBe(null);
    });

    it('displays a message when the password fields do not match', () => {
        const { getByLabelText, getByText } = render(<SignupForm />);
        const passwordInput = getByLabelText('Password');
        const confirmPasswordInput = getByLabelText('Confirm Password');
        fireEvent.change(passwordInput, { target: { value: 'correctpassword' } });
        fireEvent.change(confirmPasswordInput, { target: { value: 'incorrectpassword' } });
        expect(getByText('Passwords do NOT match')).toBeTruthy();
    });
});
