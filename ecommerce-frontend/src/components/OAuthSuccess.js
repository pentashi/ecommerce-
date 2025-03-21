import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser } from '../redux/features/authSlice'; // <-- Use loginUser (AsyncThunk)

const OAuthSuccess = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const userId = params.get('userId');
    const isAdmin = params.get('isAdmin') === 'true'; // Convert to boolean

    if (token && userId) {
      localStorage.setItem('token', token); // Store token
      dispatch(loginUser({ token, userId, isAdmin })); // Dispatch loginUser instead of loginSuccess
    }
  }, [dispatch]);

  return <h1>Login Successful! Redirecting...</h1>;
};

export default OAuthSuccess;
