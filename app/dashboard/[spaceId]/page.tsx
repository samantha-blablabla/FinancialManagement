'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/atoms/Card';
import { Button } from '@/components/ui/atoms/Button';
import { EditSpaceModal } from '@/components/ui/molecules/EditSpaceModal';
import { ConfirmDialog } from '@/components/ui/molecules/ConfirmDialog';
import { Settings, Pencil, Trash2 } from 'lucide-react';

interface Space {
  id: string;
  name: string;
  currency: string; // Legacy
  currencies?: string[]; // Multi-currency support
}

export default function DashboardPage() {
  const params = useParams();
  const router = useRouter();
  const [space, setSpace] = useState<Space | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    console.log('Dashboard mounted, spaceId from URL:', params.spaceId);

    // Load space info from localStorage
    const currentSpaceData = localStorage.getItem('currentSpace');
    console.log('LocalStorage data:', currentSpaceData);

    if (currentSpaceData) {
      try {
        const spaceData = JSON.parse(currentSpaceData);
        console.log('Parsed space data:', spaceData);

        // Verify space ID matches
        if (spaceData.id === params.spaceId) {
          console.log('Space ID matches, setting space state');
          setSpace(spaceData);
        } else {
          console.log('Space ID mismatch, redirecting to home');
          router.push('/');
        }
      } catch (error) {
        console.error('Error parsing localStorage data:', error);
        router.push('/');
      }
    } else {
      console.log('No localStorage data found, redirecting to home');
      router.push('/');
    }
  }, [params.spaceId, router]);

  const handleEditSuccess = () => {
    // Reload space data from API
    const fetchSpace = async () => {
      try {
        const response = await fetch(`/api/spaces/${space?.id}`);
        if (response.ok) {
          const data = await response.json();
          setSpace(data.space);
          localStorage.setItem('currentSpace', JSON.stringify(data.space));
        }
      } catch (error) {
        console.error('Error fetching updated space:', error);
      }
    };
    fetchSpace();
  };

  const handleDeleteConfirm = async () => {
    if (!space) return;

    try {
      const response = await fetch(`/api/spaces/delete?id=${space.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        localStorage.removeItem('currentSpace');
        router.push('/');
      } else {
        const data = await response.json();
        alert(data.error || 'Không thể xóa không gian');
      }
    } catch (error) {
      console.error('Error deleting space:', error);
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
                {space.name}
              </h1>
              <p className="text-stone-400">
                Không gian quản lý tài chính của bạn
              </p>
            </div>
            <div className="relative">
              <Button
                variant="ghost"
                onClick={() => setShowSettings(!showSettings)}
                className="flex items-center gap-2"
              >
                <Settings size={20} />
                Cài đặt
              </Button>

              {showSettings && (
                <>
                  {/* Backdrop to close dropdown when clicking outside */}
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowSettings(false)}
                  />

                  {/* Dropdown menu */}
                  <div className="absolute right-0 mt-2 w-56 backdrop-blur-xl bg-stone-900/90 border border-stone-700/50 rounded-lg shadow-2xl z-20">
                    <div className="p-2">
                      <button
                        onClick={() => {
                          setShowSettings(false);
                          setIsEditModalOpen(true);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-stone-300 hover:bg-stone-800/50 rounded-lg transition-colors"
                      >
                        <Pencil size={16} />
                        Chỉnh sửa tiền tệ
                      </button>
                      <button
                        onClick={() => {
                          setShowSettings(false);
                          setIsDeleteDialogOpen(true);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                        Xóa không gian
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card
            className="backdrop-blur-xl bg-stone-900/40 border-stone-700/50 shadow-xl hover:border-stone-500/50 transition-all duration-300 cursor-pointer"
            onClick={() => router.push(`/dashboard/${space.id}/transactions`)}
          >
            <CardHeader>
              <CardTitle>Thu Chi</CardTitle>
              <CardDescription>
                Theo dõi giao dịch hàng ngày
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="secondary" className="w-full">
                Xem chi tiết →
              </Button>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-xl bg-stone-900/40 border-stone-700/50 shadow-xl">
            <CardHeader>
              <CardTitle>Đầu Tư</CardTitle>
              <CardDescription>
                Quản lý danh mục đầu tư
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-stone-400">
                Tính năng đang được phát triển...
              </p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-xl bg-stone-900/40 border-stone-700/50 shadow-xl">
            <CardHeader>
              <CardTitle>Tiết Kiệm</CardTitle>
              <CardDescription>
                Theo dõi mục tiêu tiết kiệm
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-stone-400">
                Tính năng đang được phát triển...
              </p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-xl bg-stone-900/40 border-stone-700/50 shadow-xl">
            <CardHeader>
              <CardTitle>Ngân Sách</CardTitle>
              <CardDescription>
                Quản lý ngân sách theo danh mục
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-stone-400">
                Tính năng đang được phát triển...
              </p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-xl bg-stone-900/40 border-stone-700/50 shadow-xl">
            <CardHeader>
              <CardTitle>Báo Cáo</CardTitle>
              <CardDescription>
                Phân tích và xuất báo cáo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-stone-400">
                Tính năng đang được phát triển...
              </p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-xl bg-stone-900/40 border-stone-700/50 shadow-xl">
            <CardHeader>
              <CardTitle>Thông Báo</CardTitle>
              <CardDescription>
                Xem thông báo và nhắc nhở
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-stone-400">
                Tính năng đang được phát triển...
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Space Modal */}
      <EditSpaceModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        space={space}
        onSuccess={handleEditSuccess}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Xóa không gian"
        message="Bạn có chắc chắn muốn xóa không gian này? Tất cả dữ liệu bao gồm giao dịch, danh mục sẽ bị xóa vĩnh viễn. Hành động này không thể hoàn tác."
        confirmText="Xóa vĩnh viễn"
        cancelText="Hủy"
        variant="danger"
      />
    </div>
  );
}
