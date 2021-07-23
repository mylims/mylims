import React from 'react';

import AuthContract from '../contracts/AuthContract';

const AuthContext = React.createContext<AuthContract>({ isAuth: false });
export default AuthContext;
