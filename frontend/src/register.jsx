import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from './AuthStyles.module.css';

export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await fetch('http://localhost:8000/api/register/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            if (response.ok) {
                localStorage.setItem('verifying_email', email);
                navigate('/verify-otp');
            } else {
                const data = await response.json().catch(() => ({}));
                setError(data.detail || 'Registration failed. Please try again.');
            }
        } catch (error) {
            console.error(error);
            setError('Could not reach the server. Please try again.');
        }
     };

    return (
        <div className={styles['auth-page-wrapper']}>
            <div className={styles['auth-container']}>
                <h2>Create Account</h2>
                {error && <p className={styles['error-text']}>{error}</p>}
                <form onSubmit={handleSubmit} className={styles['auth-form']}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={styles['auth-input']}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={styles['auth-input']}
                        required
                    />
                    <button type="submit" className={styles['btn-primary']}>
                        Sign Up
                    </button>
                </form>
            </div>
        </div>
    );
}
