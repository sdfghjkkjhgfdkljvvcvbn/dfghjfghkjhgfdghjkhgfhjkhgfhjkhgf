import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { AuthLayout } from '../components/AuthLayout';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { useAuthStore } from '../store/authStore';
import { LoginCredentials } from '../types/admin';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, login, isLoading, error } = useAuthStore();
  const [localError, setLocalError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (credentials: LoginCredentials) => {
    try {
      setLocalError(null);
      await login(credentials);
      navigate('/admin/dashboard');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setLocalError(errorMessage);
    }
  };

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Sign In
        </h2>

        {(localError || error) && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800 font-medium">
              {localError || error}
            </p>
          </div>
        )}

        {/* Demo Credentials Info */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-800 font-medium mb-2">
            Demo Credentials:
          </p>
          <p className="text-xs text-blue-700">
            Email: admin@parbati.com<br />
            Password: admin123
          </p>
        </div>

        {/* Email Field */}
        <Input
          label="Email Address"
          type="email"
          placeholder="admin@parbati.com"
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Please enter a valid email',
            },
          })}
          error={errors.email?.message}
        />

        {/* Password Field */}
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          {...register('password', {
            required: 'Password is required',
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters',
            },
          })}
          error={errors.password?.message}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          size="md"
          className="w-full"
          isLoading={isLoading}
          disabled={isLoading}
        >
          Sign In
        </Button>

        {/* Footer */}
        <div className="text-center text-sm text-gray-600">
          <p>
            Need help?{' '}
            <a href="#" className="text-red-600 hover:text-red-700 font-semibold">
              Contact support
            </a>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};
