"use client";

import { useState } from 'react';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login');

  return (
    <div className="flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">
          {mode === 'login' ? 'Sign in to your account' : 'Create a new account'}
        </h2>
      </div>

      {mode === 'login' ? <LoginForm /> : <RegisterForm />}

      <p className="mt-10 text-center text-sm text-gray-400">
        {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
        <button
          onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
          className="font-semibold leading-6 text-pink-500 hover:text-pink-400"
        >
          {mode === 'login' ? 'Sign up here' : 'Sign in here'}
        </button>
      </p>
    </div>
  );
}
