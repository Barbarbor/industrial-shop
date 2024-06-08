import React, { useState } from 'react';
import { Link } from 'react-router-dom';
const RegistrationForm: React.FC = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [error, setError] = useState('');
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
    
      if (username.trim() === '' || email.trim() === '' || password.trim() === '' || repeatPassword.trim() === '') {
        setError('All fields are required');
        return;
      }
      if (password !== repeatPassword) {
        setError('Passwords do not match');
        return;
      }
    
      console.log('Registered with:', { username, email, password });
    
      setUsername('');
      setEmail('');
      setPassword('');
      setRepeatPassword('');
      setError('');
    };
  
        return (
            <div className="max-w-sm mx-auto bg-gray-50 p-6 rounded-md shadow-md border">
              <h2 className="text-xl font-semibold mb-4">Регистрация</h2>
              {error && <div className="text-red-500 mb-4">{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="username" className="block mb-1">Имя пользователя</label>
                  <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2" />
                </div>
                <div className="mb-4">
                  <label htmlFor="email" className="block mb-1">Email</label>
                  <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2" />
                </div>
                <div className="mb-4">
                  <label htmlFor="password" className="block mb-1">Пароль</label>
                  <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2" />
                </div>
                <div className="mb-4">
                  <label htmlFor="repeat-password" className="block mb-1">Подтвердите пароль</label>
                  <input type="password" id="repeat-password" value={repeatPassword} onChange={(e) => setRepeatPassword(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2" />
                </div>
                <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md focus:outline-none focus:shadow-outline w-full">Зарегистрироваться</button>
              </form>
              <div className="text-center mt-4">
                <p> Уже есть аккаунт? <Link to="/login" className="text-blue-500 hover:underline">Вход</Link></p>
              </div>
            </div>
          );
        };
  
  export default RegistrationForm