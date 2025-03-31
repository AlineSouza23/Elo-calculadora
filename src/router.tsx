import { createBrowserRouter, Navigate } from "react-router";
import { Dash } from "./pages/app/dash";
import { SECRET_KEY, SignIn, TOKEN_EXPIRATION_TIME } from "./pages/auth/sign-in";

import CryptoJS from "crypto-js"
import Cookies from 'js-cookie'

//Componente para privar rotas com base no login do usuario
const PrivateRoute = ({ element }) => {
   return isAuthenticated() ? element : <Navigate to="/sign-in"/>
}

export const logout = () => {
    Cookies.remove('authToken');
    Cookies.remove('authHash');
};
  

export const isAuthenticated  = () => {
    const token = Cookies.get('authToken');
    const hash = Cookies.get('authHash');

    if (!token || !hash ) {
        logout()

        return false
    }

    const validHash = CryptoJS.HmacSHA256(token, SECRET_KEY).toString();
    if (hash !== validHash) return false

    const tokenParts = token.split('.')
    const timestamp = parseInt(tokenParts[1], 10)

    if(Date.now() - timestamp > TOKEN_EXPIRATION_TIME) {
        logout()
        return false
    }

    return hash === validHash
}

export const router = createBrowserRouter([
    { 
        path: '/', 
        element: <PrivateRoute element={<Dash />} />
        
    },
    { path: '/sign-in', element: <SignIn />}
])

