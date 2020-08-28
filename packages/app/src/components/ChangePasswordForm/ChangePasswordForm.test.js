import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, cleanup, waitFor } from '@testing-library/react';
import user from '@testing-library/user-event';
import ChangePasswordForm from './ChangePasswordForm';
import * as UserDataService from '../../services/users';

jest.mock('../../services/users');

const token = '40a2be43-8628-4c4e-a31c-af755e105330';

describe('ChangePassword Form', () => {
    afterEach(cleanup);

    it('renders an input for the new password', () => {
        const { getByLabelText } = render(
            <MemoryRouter>
                <ChangePasswordForm />
            </MemoryRouter>
        );
        expect(getByLabelText('Password')).toBeTruthy();
    });

    it('renders an input to confirm new password', () => {
        const { getByLabelText } = render(
            <MemoryRouter>
                <ChangePasswordForm />
            </MemoryRouter>
        );
        expect(getByLabelText('Confirm Password')).toBeTruthy();
    });

    it('does not display message if password fields match', async () => {
        const { getByLabelText, queryByText } = render(
            <MemoryRouter>
                <ChangePasswordForm />
            </MemoryRouter>
        );

        const passwordInput = getByLabelText('Password');
        const confirmPasswordInput = getByLabelText('Confirm Password');
        await user.type(passwordInput, 'correctpassword');
        await user.type(confirmPasswordInput, 'correctpassword');

        expect(queryByText('Passwords do NOT match')).toBe(null);
    });

    it('displays a message when the password fields do not match', async () => {
        const { getByLabelText, getByText } = render(
            <MemoryRouter>
                <ChangePasswordForm />
            </MemoryRouter>
        );

        const passwordInput = getByLabelText('Password');
        const confirmPasswordInput = getByLabelText('Confirm Password');
        await user.type(passwordInput, 'correctpassword');
        await user.type(confirmPasswordInput, 'incorrectpassword');

        expect(getByText('Passwords do NOT match')).toBeTruthy();
    });

    it('displays a toast message if the password is changed', async () => {
        const json = Promise.resolve({
            success: true,
            message: 'password changed',
            payload: { user: {} }
        });

        UserDataService.changePassword = jest.fn(() => json);

        const { container, getByLabelText, getByText, getByTestId } = render(
            <MemoryRouter initialEntries={[`/changepassword/${token}`]}>
                <Route path="/changepassword/:token">
                    <ChangePasswordForm />
                </Route>
            </MemoryRouter>
        );

        const passwordInput = getByLabelText('Password');
        const confirmPasswordInput = getByLabelText('Confirm Password');
        await user.type(passwordInput, 'correctpassword');
        await user.type(confirmPasswordInput, 'correctpassword');
        user.click(getByTestId('submit-btn'));

        await waitFor(() => expect(getByText('Your password has been changed')).toBeTruthy(), {
            container
        });

        expect(UserDataService.changePassword).toHaveBeenCalledTimes(1);
        expect(UserDataService.changePassword).toHaveBeenCalledWith(token, 'correctpassword');
    });

    it('displays a message if the password is not changed', async () => {
        const json = Promise.resolve({
            success: false,
            message: 'password not changed',
            payload: { user: null }
        });

        UserDataService.changePassword = jest.fn(() => json);

        const { container, getByLabelText, getByText, getByTestId } = render(
            <MemoryRouter initialEntries={[`/changepassword/${token}`]}>
                <Route path="/changepassword/:token">
                    <ChangePasswordForm />
                </Route>
            </MemoryRouter>
        );

        const passwordInput = getByLabelText('Password');
        const confirmPasswordInput = getByLabelText('Confirm Password');
        await user.type(passwordInput, 'correctpassword');
        await user.type(confirmPasswordInput, 'correctpassword');
        user.click(getByTestId('submit-btn'));

        await waitFor(() => expect(getByText(/Something went wrong/i)).toBeTruthy(), {
            container
        });

        expect(UserDataService.changePassword).toHaveBeenCalledTimes(1);
        expect(UserDataService.changePassword).toHaveBeenCalledWith(token, 'correctpassword');
    });
});
