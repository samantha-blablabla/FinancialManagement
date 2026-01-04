'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/atoms/Card';
import { Button } from '@/components/ui/atoms/Button';

interface Space {
  id: string;
  name: string;
  currency: string;
}

export default function TransactionsPage() {
  const params = useParams();
  const router = useRouter();
  const [space, setSpace] = useState<Space | null>(null);

  useEffect(() => {
    const currentSpaceData = localStorage.getItem('currentSpace');
    if (currentSpaceData) {
      const spaceData = JSON.parse(currentSpaceData);
      if (spaceData.id === params.spaceId) {
        setSpace(spaceData);
      } else {
        router.push('/');
      }
    } else {
      router.push('/');
    }
  }, [params.spaceId, router]);

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
              <Button variant="primary">
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
              <CardTitle className="text-2xl text-green-400">
                +0 {space.currency}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card className="backdrop-blur-xl bg-stone-900/40 border-stone-700/50 shadow-xl">
            <CardHeader>
              <CardDescription>Tổng Chi</CardDescription>
              <CardTitle className="text-2xl text-red-400">
                -0 {space.currency}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card className="backdrop-blur-xl bg-stone-900/40 border-stone-700/50 shadow-xl">
            <CardHeader>
              <CardDescription>Số Dư</CardDescription>
              <CardTitle className="text-2xl text-stone-100">
                0 {space.currency}
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
            <div className="text-center py-12">
              <p className="text-stone-400 mb-4">
                Chưa có giao dịch nào
              </p>
              <Button variant="primary">
                Thêm giao dịch đầu tiên
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
