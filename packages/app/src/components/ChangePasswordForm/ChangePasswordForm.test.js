import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, cleanup, fireEvent, waitForElement } from '@testing-library/react';
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

    it('does not display message if password fields match', () => {
        const { getByLabelText, queryByText } = render(
            <MemoryRouter>
                <ChangePasswordForm />
            </MemoryRouter>
        );

        const passwordInput = getByLabelText('Password');
        const confirmPasswordInput = getByLabelText('Confirm Password');
        fireEvent.change(passwordInput, { target: { value: 'correctpassword' } });
        fireEvent.change(confirmPasswordInput, { target: { value: 'correctpassword' } });

        expect(queryByText('Passwords do NOT match')).toBe(null);
    });

    it('displays a message when the password fields do not match', () => {
        const { getByLabelText, getByText } = render(
            <MemoryRouter>
                <ChangePasswordForm />
            </MemoryRouter>
        );

        const passwordInput = getByLabelText('Password');
        const confirmPasswordInput = getByLabelText('Confirm Password');
        fireEvent.change(passwordInput, { target: { value: 'correctpassword' } });
        fireEvent.change(confirmPasswordInput, { target: { value: 'incorrectpassword' } });

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
        fireEvent.change(passwordInput, { target: { value: 'correctpassword' } });
        fireEvent.change(confirmPasswordInput, { target: { value: 'correctpassword' } });
        fireEvent.click(getByTestId('submit-btn'));

        const toast = await waitForElement(() => getByText('Your password has been changed'), {
            container
        });
        expect(toast).toBeTruthy();
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
        fireEvent.change(passwordInput, { target: { value: 'correctpassword' } });
        fireEvent.change(confirmPasswordInput, { target: { value: 'correctpassword' } });
        fireEvent.click(getByTestId('submit-btn'));

        const message = await waitForElement(() => getByText(/Something went wrong/i), {
            container
        });
        expect(message).toBeTruthy();
        expect(UserDataService.changePassword).toHaveBeenCalledTimes(1);
        expect(UserDataService.changePassword).toHaveBeenCalledWith(token, 'correctpassword');
    });
});
