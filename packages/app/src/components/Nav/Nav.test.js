import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MemoryRouter as Router } from 'react-router-dom';
import { render, cleanup, waitFor } from '@testing-library/react';
import user from '@testing-library/user-event';
import Nav from './Nav';
import AuthContext from '../../context/AuthContext';
import * as Auth from '../../services/auth';

jest.mock('../../services/auth');

const contextUser = {
    name: {
        first: 'Oliver',
        last: 'Queen'
    },
    email: 'ollie@qc.com'
};

const token = 'eythisisthetokenoftheauthuser1234';
const queryClient = new QueryClient();

const renderWithRouterAndContext = () => {
    return render(
        <QueryClientProvider client={queryClient}>
            <AuthContext.Provider value={{ contextUser, token, logout: () => {} }}>
                <Router>
                    <Nav />
                </Router>
            </AuthContext.Provider>
        </QueryClientProvider>
    );
};

const renderWithRouter = () => {
    return render(
        <QueryClientProvider client={queryClient}>
            <Router>
                <Nav />
            </Router>
        </QueryClientProvider>
    );
};

describe('NavBar', () => {
    afterEach(cleanup);

    it('renders the brand logo', () => {
        const { getByText } = renderWithRouter();
        expect(getByText(/DESC/)).toBeTruthy();
    });

    it('renders a Sign Up link', () => {
        const { getByText } = renderWithRouter();
        expect(getByText('Sign Up')).toBeTruthy();
    });

    it('renders a Sign In link', () => {
        const { getByText } = renderWithRouter();
        expect(getByText('Sign In')).toBeTruthy();
    });

    it('sign in link is not present if user is authenticated', () => {
        const { queryByText } = renderWithRouterAndContext();
        expect(queryByText('Sign In')).toBeNull();
    });

    it('sign up link is not present if user is authenticated', () => {
        const { queryByText } = renderWithRouterAndContext();
        expect(queryByText('Sign Up')).toBeNull();
    });

    it('renders the users first and last name when logged in', () => {
        const { getByText } = renderWithRouterAndContext();
        expect(getByText(`${contextUser.name.first} ${contextUser.name.last}`)).toBeTruthy();
    });

    it('renders a link to create requests  when logged in', () => {
        const { getByText } = renderWithRouterAndContext();
        expect(getByText('Create Request')).toBeTruthy();
    });

    it('renders a link to view requests  when logged in', () => {
        const { getByText } = renderWithRouterAndContext();
        expect(getByText('View Requests')).toBeTruthy();
    });

    it('renders a dropdown with a logout option when logged in', () => {
        const { getByText } = renderWithRouterAndContext();
        expect(getByText('Logout')).toBeTruthy();
    });

    it('calls the logout method from the auth service when Logout is clicked', async () => {
        Auth.logout = jest.fn().mockResolvedValue({ success: true, message: 'User logged out' });
        const { getByText } = renderWithRouterAndContext();
        user.click(getByText('Logout'));

        await waitFor(() => {
            expect(Auth.logout).toHaveBeenCalledTimes(1);
        });
    });
});
