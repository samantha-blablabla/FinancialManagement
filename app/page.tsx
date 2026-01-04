'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/atoms/Card';
import { Button } from '@/components/ui/atoms/Button';
import { FormField } from '@/components/ui/molecules/FormField';

export default function HomePage() {
  const router = useRouter();
  const [showCreateSpace, setShowCreateSpace] = useState(false);
  const [showSelectSpace, setShowSelectSpace] = useState(false);

  // Form state
  const [spaceName, setSpaceName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Validation state
  const [errors, setErrors] = useState<{
    spaceName: string;
    password: string;
    confirmPassword: string;
  }>({
    spaceName: '',
    password: '',
    confirmPassword: '',
  });

  // Validation helpers
  const validateSpaceName = (value: string) => {
    if (!value.trim()) {
      return 'Vui lòng nhập tên space';
    }
    if (value.length < 3) {
      return 'Tên space phải có ít nhất 3 ký tự';
    }
    return '';
  };

  const validatePassword = (value: string) => {
    if (!value) {
      return 'Vui lòng nhập mật khẩu';
    }
    if (value.length < 6) {
      return 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    return '';
  };

  const validateConfirmPassword = (value: string, original: string) => {
    if (!value) {
      return 'Vui lòng xác nhận mật khẩu';
    }
    if (value !== original) {
      return 'Mật khẩu xác nhận không khớp';
    }
    return '';
  };

  // Handlers
  const handleSpaceNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSpaceName(value);
    setErrors(prev => ({ ...prev, spaceName: validateSpaceName(value) }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    setErrors(prev => ({ ...prev, password: validatePassword(value) }));
    if (confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: validateConfirmPassword(confirmPassword, value) }));
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setErrors(prev => ({ ...prev, confirmPassword: validateConfirmPassword(value, password) }));
  };

  const handleCreateSpace = async () => {
    const spaceNameError = validateSpaceName(spaceName);
    const passwordError = validatePassword(password);
    const confirmPasswordError = validateConfirmPassword(confirmPassword, password);

    setErrors({
      spaceName: spaceNameError,
      password: passwordError,
      confirmPassword: confirmPasswordError,
    });

    if (spaceNameError || passwordError || confirmPasswordError) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/spaces/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          spaceName,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Space creation failed:', data);
        setErrors(prev => ({
          ...prev,
          spaceName: data.error || 'Đã xảy ra lỗi khi tạo space',
        }));
        return;
      }

      console.log('Space created successfully:', data.space);

      // Store space info in localStorage
      localStorage.setItem('currentSpace', JSON.stringify(data.space));
      console.log('Saved to localStorage:', localStorage.getItem('currentSpace'));

      // Redirect to dashboard using window.location for more reliable navigation
      console.log('Redirecting to:', `/dashboard/${data.space.id}`);
      window.location.href = `/dashboard/${data.space.id}`;
    } catch (error) {
      console.error('Error creating space:', error);
      setErrors(prev => ({
        ...prev,
        spaceName: 'Không thể kết nối đến server. Vui lòng thử lại.',
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setShowCreateSpace(false);
    setSpaceName('');
    setPassword('');
    setConfirmPassword('');
    setErrors({ spaceName: '', password: '', confirmPassword: '' });
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 md:p-8 animate-gradient">
      {/* Particles Background */}
      <div className="particles">
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
      </div>

      <div className="max-w-4xl w-full space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold text-stone-100">
            Quản lý Tài chính Cá nhân
          </h1>
          <p className="text-base md:text-lg text-stone-400">
            Ứng dụng quản lý tài chính toàn diện với theo dõi thu chi, đầu tư, tiết kiệm và ngân sách
          </p>
        </div>

        {/* Main Actions */}
        {!showCreateSpace && !showSelectSpace && (
          <div className="grid md:grid-cols-2 gap-4 md:gap-6">
            <Card className="hover:border-stone-500/50 transition-all duration-300 cursor-pointer backdrop-blur-xl bg-stone-900/40 border-stone-700/50 shadow-xl" onClick={() => setShowCreateSpace(true)}>
              <CardHeader>
                <CardTitle className="text-xl md:text-2xl">Tạo Space Mới</CardTitle>
                <CardDescription>
                  Tạo một không gian tài chính riêng với mật khẩu bảo mật
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="primary" className="w-full">
                  + Tạo Space
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:border-stone-500/50 transition-all duration-300 cursor-pointer backdrop-blur-xl bg-stone-900/40 border-stone-700/50 shadow-xl" onClick={() => setShowSelectSpace(true)}>
              <CardHeader>
                <CardTitle className="text-xl md:text-2xl">Chọn Space</CardTitle>
                <CardDescription>
                  Truy cập vào không gian tài chính đã tạo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="secondary" className="w-full">
                  Chọn Space
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Create Space Form */}
        {showCreateSpace && (
          <Card className="backdrop-blur-xl bg-stone-900/40 border-stone-700/50 shadow-xl">
            <CardHeader>
              <CardTitle>Tạo Space Mới</CardTitle>
              <CardDescription>
                Nhập thông tin để tạo không gian tài chính riêng của bạn
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                label="Tên Space"
                placeholder="VD: Tài chính cá nhân, Gia đình, Công ty..."
                required
                value={spaceName}
                onChange={handleSpaceNameChange}
                error={errors.spaceName}
              />
              <FormField
                label="Mật khẩu"
                type="password"
                placeholder="Nhập mật khẩu để bảo vệ space"
                required
                value={password}
                onChange={handlePasswordChange}
                error={errors.password}
                helperText={!errors.password ? "Mật khẩu sẽ được sử dụng để truy cập vào space này" : undefined}
              />
              <FormField
                label="Xác nhận mật khẩu"
                type="password"
                placeholder="Nhập lại mật khẩu"
                required
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                error={errors.confirmPassword}
              />
              <div className="flex gap-3 pt-2">
                <Button
                  variant="primary"
                  className="flex-1"
                  onClick={handleCreateSpace}
                  isLoading={isLoading}
                  disabled={isLoading}
                >
                  {isLoading ? 'Đang tạo...' : 'Tạo Space'}
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  Hủy
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Select Space Form */}
        {showSelectSpace && (
          <Card className="backdrop-blur-xl bg-stone-900/40 border-stone-700/50 shadow-xl">
            <CardHeader>
              <CardTitle>Chọn Space</CardTitle>
              <CardDescription>
                Nhập mật khẩu để truy cập vào space của bạn
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-stone-400 bg-stone-950/50 p-4 rounded-md">
                <p className="font-medium text-stone-300 mb-2">Chưa có space nào được tạo</p>
                <p>Vui lòng tạo một space mới để bắt đầu sử dụng ứng dụng.</p>
              </div>
              <div className="flex gap-3 pt-2">
                <Button
                  variant="ghost"
                  onClick={() => setShowSelectSpace(false)}
                  className="flex-1"
                >
                  Quay lại
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
