import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setToken, setUserData } from '../store/slices/authSlice';
import { Spinner } from 'react-bootstrap';
import { showSuccess } from '../utils/Toast';
import { BASE_URL } from '../services/axiosInstance';

const GoogleRedirectHandler = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        if (token) {
            // ✅ Save token to localStorage
            localStorage.setItem('token', token);

            // // ✅ Remove token from URL
            // window.history.replaceState({}, document.title, window.location.pathname);

            // ✅ Call backend to verify and fetch user data
            axios
                .get(BASE_URL + '/api/user-from-token', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((res) => {
                    // setting user in redux
                    dispatch(setUserData(res?.data))
                    dispatch(setToken(token))
                    showSuccess("Logged In Successfully!")
                    navigate('/dashboard/monitors');
                })
                .catch((err) => {
                    console.error('❌ Token invalid:', err);
                    localStorage.removeItem('token');
                    navigate('/');
                });
        }
    }, []);

    return <div
        style={{
            width: '100%',
            height: '100vh',
            background: '#0f172a',
            color: '#e2e8f0',
            fontFamily: "'Inter', sans-serif",
            letterSpacing: '0.5px',
        }}
        className="d-flex flex-column align-items-center justify-content-center text-center px-3"
    >
        <Spinner animation="border" variant="light" className="mb-4" style={{ width: 48, height: 48 }} />
        <h4 className="fw-semibold" style={{ fontSize: '1.5rem' }}>
            Taking you to <span style={{ color: '#38bdf8' }}>Apex</span> by{' '}
            <span style={{ color: '#facc15' }}>Visdum</span>
        </h4>
        <p style={{ fontSize: '0.9rem', color: '#94a3b8' }} className="mt-2">
            Authenticating your account, Please wait...
        </p>
    </div>
};

export default GoogleRedirectHandler;
