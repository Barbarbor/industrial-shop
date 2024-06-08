import React, { useState } from 'react';
import { Link } from 'react-router-dom';
const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (email.trim() === '' || password.trim() === '') {
      setError('Please enter both email and password');
      return;
    }
   
    console.log('Logged in with:', { email, password });

    setEmail('');
    setPassword('');
    setError('');
  };

   return (
    <div className="max-w-sm mx-auto bg-gray-50 p-6 rounded-md shadow-md border">
      <h2 className="text-xl font-semibold mb-4">Вход</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block mb-1">Email</label>
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2" />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block mb-1">Пароль</label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2" />
        </div>
        <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md focus:outline-none focus:shadow-outline w-full">Войти</button>
      </form>
      <div className="text-center mt-4">
        <p>Нет аккаунта? <Link to="/register" className="text-blue-500 hover:underline">Зарегистрироваться</Link></p>
      </div>
    </div>
  );
};
export default LoginForm