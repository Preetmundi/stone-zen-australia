import React, { useState } from 'react';
import { useAuth } from '../hooks/use-auth';
import StoneDesignBusinessPlatform from '../components/StoneDesignBusinessPlatform';

const Index = () => {
  const { user, login, register, logout, loading } = useAuth();
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (loading) return <div>Loading...</div>;

  if (!user) {
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');
      try {
        let result;
        if (mode === 'login') {
          result = await login(email, password);
        } else {
          result = await register(email, password);
        }
        
        if (result.error) {
          setError(result.error.message || 'Authentication failed');
        }
      } catch (err: any) {
        setError(err.message || 'Authentication failed');
      }
    };
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow w-80 space-y-4">
          <h2 className="text-xl font-bold mb-2">{mode === 'login' ? 'Login' : 'Register'}</h2>
          <input className="border px-2 py-1 rounded w-full" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
          <input className="border px-2 py-1 rounded w-full" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <button className="w-full bg-primary text-white py-2 rounded" type="submit">{mode === 'login' ? 'Login' : 'Register'}</button>
          <div className="text-sm text-center">
            {mode === 'login' ? (
              <span>Don't have an account? <button type="button" className="text-blue-600 underline" onClick={() => setMode('register')}>Register</button></span>
            ) : (
              <span>Already have an account? <button type="button" className="text-blue-600 underline" onClick={() => setMode('login')}>Login</button></span>
            )}
          </div>
        </form>
      </div>
    );
  }

  return <StoneDesignBusinessPlatform />;
};

export default Index;
