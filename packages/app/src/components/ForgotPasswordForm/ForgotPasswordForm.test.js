import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, cleanup, fireEvent, waitForElement } from '@testing-library/react';
import ForgotPasswordForm from './ForgotPasswordForm';
import * as UserDataService from '../../services/users';

jest.mock('../../services/users');

describe('Forgotpassword Form', () => {
    afterEach(cleanup);

    it('renders an input for email', () => {
        const { getByLabelText } = render(
            <MemoryRouter>
                <ForgotPasswordForm />
            </MemoryRouter>
        );
        expect(getByLabelText('Your Email')).toBeTruthy();
    });

    it('displays message to user if the API call is successful', async () => {
        const json = Promise.resolve({
            success: true,
            message: 'password details sent to user',
            payload: { user: 'some@email.com' }
        });

        UserDataService.forgotPassword = jest.fn(() => json);

        const { getByLabelText, getByTestId, container } = render(
            <MemoryRouter>
                <ForgotPasswordForm />
            </MemoryRouter>
        );
        const emailInput = getByLabelText('Your Email');
        fireEvent.change(emailInput, { target: { value: 'some@email.com' } });
        fireEvent.click(getByTestId('submit-btn'));

        const message = await waitForElement(() => getByTestId('success-message'), { container });
        expect(message.textContent).toContain('Thank you.');
        expect(UserDataService.forgotPassword).toHaveBeenCalledWith('some@email.com');
    });

    it('displays error message if the API call is unsuccessful', async () => {
        const json = Promise.resolve({
            success: false,
            message: 'user not found',
            payload: { user: null }
        });

        UserDataService.forgotPassword = jest.fn(() => json);

        const { getByLabelText, getByTestId, container } = render(
            <MemoryRouter>
                <ForgotPasswordForm />
            </MemoryRouter>
        );
        const emailInput = getByLabelText('Your Email');
        fireEvent.change(emailInput, { target: { value: 'unknown-user@email.com' } });
        fireEvent.click(getByTestId('submit-btn'));

        const message = await waitForElement(() => getByTestId('error-message'), { container });
        expect(message.textContent).toContain('Something went wrong.');
        expect(UserDataService.forgotPassword).toHaveBeenCalledWith('unknown-user@email.com');
    });
});
