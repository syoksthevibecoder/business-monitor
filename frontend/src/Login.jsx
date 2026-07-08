import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from './AuthStyles.module.css';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await fetch('http://localhost:8000/api/login/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('auth_token', data.token);
                navigate('/dashboard');
            } else {
                setError(data.detail || 'Invalid email or password.');
            }
        } catch (err) {
            console.error(err);
            setError('Could not reach the server. Please try again.');
        }
    };

    return (
        <div className={styles['auth-page-wrapper']}>
            <div className={styles['auth-container']}>
                <h2>Log In</h2>
                {error && <p className={styles['error-text']}>{error}</p>}
                <form onSubmit={handleLogin} className={styles['auth-form']}>
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
                    <button type="submit" className={styles['btn-primary']}>Log In</button>
                </form>
            </div>
        </div>
    );
}