import React from 'react';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { useAuthStore } from '../stores/authStore';
import { toast } from 'sonner';

const withdrawalHistory: any[] = [];

export default function WithdrawalRequests() {
  const user = useAuthStore(state => state.user);

  const handleWithdraw = () => {
    toast.success('出金申請を受け付けました');
  };

  return (
    <div className="space-y-6">
      {user?.role === 'worker' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">新規出金申請</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                出金金額
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1000"
                  step="100"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="1000"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">P</span>
                </div>
              </div>
              <p className="mt-1 text-sm text-gray-500">最低出金額: 1,000P</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                出金方法
              </label>
              <select className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
                <option value="bank">銀行振込</option>
                <option value="paypal">PayPal</option>
              </select>
            </div>
          </div>
          <div className="mt-6">
            <button
              onClick={handleWithdraw}
              className="btn btn-primary"
            >
              出金を申請する
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">出金履歴</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  申請日時
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  金額
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  出金方法
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ステータス
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {withdrawalHistory.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                    履歴はありません
                  </td>
                </tr>
              ) : (
                withdrawalHistory.map((withdrawal) => (
                  <tr key={withdrawal.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {format(new Date(withdrawal.timestamp), 'yyyy年M月d日 HH:mm', { locale: ja })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {withdrawal.amount.toLocaleString()} P
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {withdrawal.paymentMethod}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        withdrawal.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {withdrawal.status === 'completed' ? '完了' : '処理中'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}