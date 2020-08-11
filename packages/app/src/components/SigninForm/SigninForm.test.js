import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SigninForm from './SigninForm';
import { AuthProvider } from '../../context/AuthContext';
import * as Auth from '../../services/auth';

jest.mock('../../services/auth');

const history = {
    push: jest.fn()
};

describe('SigninForm', () => {
    afterEach(cleanup);

    it('renders an input for email', () => {
        const { getByLabelText } = render(
            <MemoryRouter>
                <SigninForm />{' '}
            </MemoryRouter>
        );
        expect(getByLabelText('Your Email')).toBeTruthy();
    });

    it('renders an input for password', () => {
        const { getByLabelText } = render(
            <MemoryRouter>
                <SigninForm />{' '}
            </MemoryRouter>
        );
        expect(getByLabelText('Password')).toBeTruthy();
    });

    it('calls the login method from the auth service when Signin is clicked', () => {
        Auth.login = jest
            .fn()
            .mockResolvedValue({ success: true, message: 'User authenticated', payload: {} });

        const { getByLabelText, getByText } = render(
            <MemoryRouter>
                <AuthProvider value={{ login: () => {} }}>
                    <SigninForm history={history} />
                </AuthProvider>
            </MemoryRouter>
        );
        const emailInput = getByLabelText('Your Email');
        const passwordInput = getByLabelText('Password');
        fireEvent.change(emailInput, { target: { value: 'oliver@desc.org' } });
        fireEvent.change(passwordInput, { target: { value: 'mySecret' } });
        fireEvent.click(getByText('Sign In'));

        expect(Auth.login).toHaveBeenCalled();
    });
});
