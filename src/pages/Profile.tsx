import React from 'react';
import { useAuthStore } from '../stores/authStore';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import type { UserProfile } from '../types';
import AvatarUploader from '../components/AvatarUploader';

const schema = z.object({
  name: z.string().min(1, '名前を入力してください'),
  email: z.string().email('有効なメールアドレスを入力してください'),
  loginId: z.string()
    .min(4, 'ログインIDは4文字以上である必要があります')
    .regex(/^[a-zA-Z0-9_-]+$/, 'ログインIDは半角英数字、ハイフン、アンダースコアのみ使用できます'),
  profile: z.object({
    phoneNumber: z.string().regex(/^[0-9-]+$/, '有効な電話番号を入力してください'),
    address: z.string().min(1, '住所を入力してください'),
    birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '生年月日を正しい形式で入力してください'),
    bankInfo: z.object({
      bankName: z.string().min(1, '銀行名を入力してください'),
      branchName: z.string().min(1, '支店名を入力してください'),
      accountType: z.enum(['普通', '当座']),
      accountNumber: z.string().regex(/^\d{7}$/, '7桁の口座番号を入力してください'),
      accountHolder: z.string().min(1, '口座名義を入力してください'),
    }),
  }),
});

type ProfileForm = z.infer<typeof schema>;

export default function Profile() {
  const { user, updateProfile, updateAvatar } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      loginId: user?.loginId || '',
      profile: {
        phoneNumber: user?.profile?.phoneNumber || '',
        address: user?.profile?.address || '',
        birthDate: user?.profile?.birthDate || '',
        bankInfo: {
          bankName: user?.profile?.bankInfo?.bankName || '',
          branchName: user?.profile?.bankInfo?.branchName || '',
          accountType: user?.profile?.bankInfo?.accountType || '普通',
          accountNumber: user?.profile?.bankInfo?.accountNumber || '',
          accountHolder: user?.profile?.bankInfo?.accountHolder || '',
        },
      },
    },
  });

  const onSubmit = (data: ProfileForm) => {
    updateProfile(data);
    toast.success('プロフィールを更新しました');
  };

  const handleAvatarChange = (avatarUrl: string) => {
    updateAvatar(avatarUrl);
    toast.success('プロフィール画像を更新しました');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">プロフィール画像</h2>
          <AvatarUploader
            currentAvatar={user?.avatarUrl}
            onAvatarChange={handleAvatarChange}
          />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">名前</label>
              <input
                type="text"
                {...register('name')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">ログインID</label>
              <input
                type="text"
                {...register('loginId')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              {errors.loginId && (
                <p className="mt-1 text-sm text-red-600">{errors.loginId.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">メールアドレス</label>
              <input
                type="email"
                {...register('email')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">電話番号</label>
              <input
                type="tel"
                {...register('profile.phoneNumber')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              {errors.profile?.phoneNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.profile.phoneNumber.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">生年月日</label>
              <input
                type="date"
                {...register('profile.birthDate')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              {errors.profile?.birthDate && (
                <p className="mt-1 text-sm text-red-600">{errors.profile.birthDate.message}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">住所</label>
              <input
                type="text"
                {...register('profile.address')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
              {errors.profile?.address && (
                <p className="mt-1 text-sm text-red-600">{errors.profile.address.message}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <h3 className="text-lg font-medium text-gray-900 mb-4">銀行口座情報</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">銀行名</label>
                  <input
                    type="text"
                    {...register('profile.bankInfo.bankName')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                  {errors.profile?.bankInfo?.bankName && (
                    <p className="mt-1 text-sm text-red-600">{errors.profile.bankInfo.bankName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">支店名</label>
                  <input
                    type="text"
                    {...register('profile.bankInfo.branchName')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                  {errors.profile?.bankInfo?.branchName && (
                    <p className="mt-1 text-sm text-red-600">{errors.profile.bankInfo.branchName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">口座種別</label>
                  <select
                    {...register('profile.bankInfo.accountType')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="普通">普通</option>
                    <option value="当座">当座</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">口座番号</label>
                  <input
                    type="text"
                    {...register('profile.bankInfo.accountNumber')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                  {errors.profile?.bankInfo?.accountNumber && (
                    <p className="mt-1 text-sm text-red-600">{errors.profile.bankInfo.accountNumber.message}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">口座名義</label>
                  <input
                    type="text"
                    {...register('profile.bankInfo.accountHolder')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                  {errors.profile?.bankInfo?.accountHolder && (
                    <p className="mt-1 text-sm text-red-600">{errors.profile.bankInfo.accountHolder.message}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}