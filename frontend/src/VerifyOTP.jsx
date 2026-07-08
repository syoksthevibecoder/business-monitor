import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AuthStyles.module.css';

export default function VerifyOTP() {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const email = localStorage.getItem('verifying_email');

    const handleVerify = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await fetch('http://localhost:8000/api/verify-otp/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp }),
            });

            if (response.ok) {
                localStorage.removeItem('verifying_email');
                navigate('/login');
            } else {
                const data = await response.json().catch(() => ({}));
                setError(data.message || 'Invalid or expired code.');
            }
        } catch (err) {
            console.error(err);
            setError('Could not reach the server. Please try again.');
        }
    };

    return (
        <div className={styles['auth-page-wrapper']}>
            <div className={styles['auth-container']}>
                <h2>Enter Verification Code</h2>
                <p>OTP sent to {email}</p>
                {error && <p className={styles['error-text']}>{error}</p>}
                <form onSubmit={handleVerify} className={styles['auth-form']}>
                    <input
                        type="text"
                        maxLength="6"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className={styles['auth-input']}
                        required
                    />
                    <button type="submit" className={styles['btn-primary']}>
                        Verify Account
                    </button>
                </form>
            </div>
        </div>
    );
}