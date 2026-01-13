'use client';

import { useState, useEffect } from 'react';

export const dynamic = 'force-dynamic';

export default function TestAPI() {
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setToken(localStorage.getItem('token'));
    }
  }, []);

  const testLogin = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'admin@trustauto.co.ke',
          password: 'Admin123!'
        }),
      });

      const data = await res.json();
      setResponse(data);
      console.log('Test Login Response:', data);

      if (data.token) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        alert('Login successful! Token saved.');
      }
    } catch (error: any) {
      console.error('Login Error:', error);
      setResponse({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const testVehicles = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/vehicles', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      const data = await res.json();
      setResponse(data);
      console.log('Vehicles Response:', data);
    } catch (error: any) {
      console.error('Vehicles Error:', error);
      setResponse({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>API Test Page</h1>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <button
          onClick={testLogin}
          disabled={loading}
          style={{
            padding: '1rem 2rem',
            fontSize: '1rem',
            cursor: 'pointer',
          }}
        >
          {loading ? 'Testing...' : 'Test Login'}
        </button>
        <button
          onClick={testVehicles}
          disabled={loading}
          style={{
            padding: '1rem 2rem',
            fontSize: '1rem',
            cursor: 'pointer',
          }}
        >
          {loading ? 'Testing...' : 'Get Vehicles'}
        </button>
      </div>

      {response && (
        <div style={{ marginTop: '2rem', padding: '1rem', background: '#f0f0f0', borderRadius: '8px' }}>
          <h3>Response:</h3>
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}

      <div style={{ marginTop: '2rem' }}>
        <h3>Debug Info:</h3>
        <p><strong>Current Token:</strong> {token || 'None'}</p>
        <p><strong>Backend URL:</strong> {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}</p>
        <a href="/auth/login" style={{ display: 'block', marginTop: '1rem', padding: '0.5rem 1rem', background: '#0070f3', color: 'white', textDecoration: 'none' }}>
          Go to Login Page
        </a>
      </div>
    </div>
  );
}
