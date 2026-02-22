import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register, clearError } from '../store/userSlice.js';

export function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (user) navigate('/', { replace: true });
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      dispatch(clearError());
      return;
    }
    const result = await dispatch(register({ name, email, password }));
    if (register.fulfilled.match(result)) {
      navigate('/', { replace: true });
    }
  };

  const passwordMismatch = password && confirmPassword && password !== confirmPassword;

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Create owner account</h1>
        <p className="auth-subtitle">Register once, then use this email and password to sign in.</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-label">
            Your name
            <input
              type="text"
              className="auth-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Umesh"
              required
              autoComplete="name"
            />
          </label>
          <label className="auth-label">
            Email
            <input
              type="email"
              className="auth-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoComplete="email"
            />
          </label>
          <label className="auth-label">
            Password
            <input
              type="password"
              className="auth-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              autoComplete="new-password"
            />
          </label>
          <label className="auth-label">
            Confirm password
            <input
              type="password"
              className="auth-input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              autoComplete="new-password"
            />
          </label>
          {passwordMismatch && (
            <p className="auth-error">Password and confirm password do not match.</p>
          )}
          {error && !passwordMismatch && <p className="auth-error">{error}</p>}
          <button
            type="submit"
            className="btn btn-primary auth-submit"
            disabled={loading || passwordMismatch}
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>
        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
