import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { TrendingUp } from 'lucide-react';
import { useAuthStore, AUTH_CREDENTIALS } from '../stores/authStore';
import { toast } from 'sonner';
import { useState } from 'react';

const loginSchema = z.object({
  loginId: z.string().min(1, 'ログインIDを入力してください'),
  password: z.string().min(6, 'パスワードは6文字以上である必要があります'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const navigate = useNavigate();
  const { login, users } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  
  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onLogin = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      // Check credentials
      const correctPassword = AUTH_CREDENTIALS[data.loginId];
      if (!correctPassword || correctPassword !== data.password) {
        throw new Error('ログインIDまたはパスワードが正しくありません');
      }

      // Find user
      const user = Object.values(users).find(u => u.loginId === data.loginId);
      if (!user) {
        throw new Error('ユーザーが見つかりません');
      }

      login(user);
      toast.success('ログインしました');
      navigate(user.role === 'admin' ? '/admin' : '/');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'ログインに失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <TrendingUp className="h-12 w-12 text-indigo-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          pointmoney
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          ポイント管理システム
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={loginForm.handleSubmit(onLogin)}>
            <div>
              <label htmlFor="loginId" className="block text-sm font-medium text-gray-700">
                ログインID
              </label>
              <div className="mt-1">
                <input
                  id="loginId"
                  type="text"
                  {...loginForm.register('loginId')}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {loginForm.formState.errors.loginId && (
                  <p className="mt-1 text-sm text-red-600">{loginForm.formState.errors.loginId.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                パスワード
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  type="password"
                  {...loginForm.register('password')}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {loginForm.formState.errors.password && (
                  <p className="mt-1 text-sm text-red-600">{loginForm.formState.errors.password.message}</p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isLoading ? 'ログイン中...' : 'ログイン'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}