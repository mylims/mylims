import { createContext } from 'react';

import AuthContract from '../contracts/AuthContract';

const AuthContext = createContext<AuthContract>({ isAuth: false });
export default AuthContext;
