import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implementar login
    console.log('Login:', { email, password });
  };

  return (
    <div className="max-w-md mx-auto card">
      <h1 className="text-2xl font-bold mb-6 text-center">Iniciar Sesión</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block mb-2 font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block mb-2 font-medium">
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-full">
          Iniciar Sesión
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-gray-600">
        ¿No tienes cuenta?{' '}
        <Link to="/register" className="text-primary-600 hover:underline">
          Regístrate aquí
        </Link>
      </p>
    </div>
  );
}

