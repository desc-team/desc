import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { applyMiddleware, createStore } from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import Layout from './containers/Layout';
import Signup from './containers/Signup';
import Signin from './containers/Signin';
import UserProfile from './containers/UserProfile';
import Inbox from './containers/Inbox';
import RequestCreationPage from './components/RequestCreation/RequestCreationPage';
import Request from './containers/Request';
import Home from './components/Home/Home';
import ConfirmEmail from './containers/ConfirmEmail';
import ForgotPassword from './containers/ForgotPassword';
import ChangePassword from './containers/ChangePassword';
import PrivateRoute from './components/PrivateRoute';
import { reducer } from './reducers/reducer';

import './App.css';
import 'materialize-css/dist/css/materialize.css';
import { AuthProvider } from './context/AuthContext';

const store = createStore(reducer, applyMiddleware(thunk, logger));
const queryClient = new QueryClient();

function App() {
    return (
        <Provider store={store}>
            <BrowserRouter>
                <QueryClientProvider client={queryClient}>
                    <AuthProvider>
                        <Layout>
                            <Switch>
                                <Route exact path="/" component={Home} />
                                <Route exact path="/signup" component={Signup} />
                                <Route exact path="/signin" component={Signin} />
                                <Route exact path="/forgotpassword" component={ForgotPassword} />
                                <Route exact path="/confirmemail/:token" component={ConfirmEmail} />
                                <Route
                                    exact
                                    path="/changepassword/:token"
                                    component={ChangePassword}
                                />

                                <PrivateRoute exact path="/inbox" component={Inbox} />
                                <PrivateRoute
                                    exact
                                    path="/createv1"
                                    component={RequestCreationPage}
                                />
                                <PrivateRoute exact path="/create" component={Request} />
                                <PrivateRoute exact path="/profile" component={UserProfile} />
                            </Switch>
                            <ReactQueryDevtools initialIsOpen={false} />
                        </Layout>
                    </AuthProvider>
                </QueryClientProvider>
            </BrowserRouter>
        </Provider>
    );
}

export default App;
