'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/atoms/Card';
import { Button } from '@/components/ui/atoms/Button';
import { AddTransactionModal } from '@/components/ui/molecules/AddTransactionModal';
import { EditTransactionModal } from '@/components/ui/molecules/EditTransactionModal';
import { CategoryIcon } from '@/components/ui/atoms/CategoryIcon';
import { Pencil, Trash2 } from 'lucide-react';

interface Space {
  id: string;
  name: string;
  currency: string;
}

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  date: string;
  notes: string | null;
  category_id: string;
  category: {
    id: string;
    name: string;
    icon: string;
    color: string;
  } | null;
}

export default function TransactionsPage() {
  const params = useParams();
  const router = useRouter();
  const [space, setSpace] = useState<Space | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
  });

  useEffect(() => {
    const currentSpaceData = localStorage.getItem('currentSpace');
    if (currentSpaceData) {
      const spaceData = JSON.parse(currentSpaceData);
      if (spaceData.id === params.spaceId) {
        setSpace(spaceData);
        fetchTransactions(spaceData.id);
      } else {
        router.push('/');
      }
    } else {
      router.push('/');
    }
  }, [params.spaceId, router]);

  const fetchTransactions = async (spaceId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/transactions?spaceId=${spaceId}`);
      if (response.ok) {
        const data = await response.json();
        setTransactions(data.transactions || []);
        calculateSummary(data.transactions || []);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateSummary = (txns: Transaction[]) => {
    const totalIncome = txns
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const totalExpense = txns
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    setSummary({
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const handleTransactionAdded = () => {
    if (space) {
      fetchTransactions(space.id);
    }
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsEditModalOpen(true);
  };

  const handleDeleteTransaction = async (transactionId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa giao dịch này?')) {
      return;
    }

    try {
      const response = await fetch(`/api/transactions/delete?id=${transactionId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Refresh transactions list
        if (space) {
          fetchTransactions(space.id);
        }
      } else {
        const data = await response.json();
        alert(data.error || 'Không thể xóa giao dịch');
      }
    } catch (error) {
      console.error('Error deleting transaction:', error);
      alert('Không thể kết nối đến server');
    }
  };

  if (!space) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-stone-400">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen animate-gradient">
      {/* Particles Background */}
      <div className="particles">
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-stone-100 mb-2">
                Thu Chi
              </h1>
              <p className="text-stone-400">
                Quản lý giao dịch hàng ngày
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="ghost"
                onClick={() => router.push(`/dashboard/${space.id}`)}
              >
                Quay lại
              </Button>
              <Button
                variant="primary"
                onClick={() => setIsModalOpen(true)}
              >
                + Thêm giao dịch
              </Button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card className="backdrop-blur-xl bg-stone-900/40 border-stone-700/50 shadow-xl">
            <CardHeader>
              <CardDescription>Tổng Thu</CardDescription>
              <CardTitle className="text-2xl text-stone-100">
                +{formatCurrency(summary.totalIncome)} {space.currency}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card className="backdrop-blur-xl bg-stone-900/40 border-stone-700/50 shadow-xl">
            <CardHeader>
              <CardDescription>Tổng Chi</CardDescription>
              <CardTitle className="text-2xl text-stone-100">
                -{formatCurrency(summary.totalExpense)} {space.currency}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card className="backdrop-blur-xl bg-stone-900/40 border-stone-700/50 shadow-xl">
            <CardHeader>
              <CardDescription>Số Dư</CardDescription>
              <CardTitle className="text-2xl text-stone-100">
                {summary.balance >= 0 ? '+' : ''}{formatCurrency(summary.balance)} {space.currency}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Transactions List */}
        <Card className="backdrop-blur-xl bg-stone-900/40 border-stone-700/50 shadow-xl">
          <CardHeader>
            <CardTitle>Giao dịch gần đây</CardTitle>
            <CardDescription>
              Danh sách các giao dịch thu chi
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12 text-stone-400">
                Đang tải...
              </div>
            ) : transactions.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-stone-400 mb-4">
                  Chưa có giao dịch nào
                </p>
                <Button
                  variant="primary"
                  onClick={() => setIsModalOpen(true)}
                >
                  Thêm giao dịch đầu tiên
                </Button>
              </div>
            ) : (
              <div className="space-y-2 md:space-y-3">
                {transactions.map((transaction) => {
                  // Handle transactions with deleted or missing categories
                  const category = transaction.category || {
                    icon: 'Wallet',
                    name: 'Không xác định',
                    color: '#64748b'
                  };

                  return (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-3 md:p-4 bg-stone-800/30 border border-stone-700/30 rounded-lg hover:bg-stone-800/50 transition-colors gap-2 md:gap-4"
                    >
                      <div className="flex items-center gap-2 md:gap-4 flex-1 min-w-0">
                        <div
                          className="w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: `${category.color}20` }}
                        >
                          <CategoryIcon name={category.icon} size={20} style={{ color: category.color }} className="md:w-6 md:h-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-stone-100 font-medium text-sm md:text-base truncate">
                            {transaction.description}
                          </h3>
                          <div className="flex items-center gap-1 md:gap-2 text-xs md:text-sm text-stone-400">
                            <span className="truncate">{category.name}</span>
                            <span className="hidden sm:inline">•</span>
                            <span className="hidden sm:inline">{formatDate(transaction.date)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 md:gap-4 flex-shrink-0">
                        <div className="text-right">
                          <div className="text-sm md:text-lg font-semibold text-stone-100 whitespace-nowrap">
                            {transaction.type === 'income' ? '+' : '-'}
                            {formatCurrency(transaction.amount)}
                          </div>
                          <div className="text-xs text-stone-500 md:hidden">
                            {formatDate(transaction.date)}
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleEditTransaction(transaction)}
                            className="p-1.5 md:p-2 text-stone-400 hover:text-stone-100 hover:bg-stone-700/50 rounded-lg transition-colors"
                            title="Chỉnh sửa"
                          >
                            <Pencil size={16} className="md:w-[18px] md:h-[18px]" />
                          </button>
                          <button
                            onClick={() => handleDeleteTransaction(transaction.id)}
                            className="p-1.5 md:p-2 text-stone-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                            title="Xóa"
                          >
                            <Trash2 size={16} className="md:w-[18px] md:h-[18px]" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add Transaction Modal */}
      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        spaceId={space.id}
        onSuccess={handleTransactionAdded}
      />

      {/* Edit Transaction Modal */}
      <EditTransactionModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingTransaction(null);
        }}
        spaceId={space.id}
        transaction={editingTransaction}
        onSuccess={handleTransactionAdded}
      />
    </div>
  );
}
