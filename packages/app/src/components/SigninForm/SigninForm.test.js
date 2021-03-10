import React from 'react';
import { render, cleanup } from '@testing-library/react';
import user from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import SigninForm from './SigninForm';
import AuthContext from '../../context/AuthContext';
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

    it('calls the login method from the auth service when Signin is clicked', async () => {
        Auth.login = jest
            .fn()
            .mockResolvedValue({ success: true, message: 'User authenticated', payload: {} });

        const { getByLabelText, getByText } = render(
            <MemoryRouter>
                <AuthContext.Provider value={{ login: () => {} }}>
                    <SigninForm history={history} />
                </AuthContext.Provider>
            </MemoryRouter>
        );
        const emailInput = getByLabelText('Your Email');
        const passwordInput = getByLabelText('Password');
        await user.type(emailInput, 'oliver@desc.org');
        await user.type(passwordInput, 'mySecret');
        user.click(getByText('Sign In'));

        expect(Auth.login).toHaveBeenCalled();
    });
});
