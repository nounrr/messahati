import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchAuthUser } from './Redux/auth/authSlice';

const AuthProvider = ({ children }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchAuthUser());
    }, [dispatch]);

    return children;
};

export default AuthProvider;
