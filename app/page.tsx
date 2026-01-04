'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/atoms/Card';
import { Button } from '@/components/ui/atoms/Button';
import { FormField } from '@/components/ui/molecules/FormField';
import { Lock } from 'lucide-react';

interface Space {
  id: string;
  name: string;
  currency: string;
  created_at: string;
}

export default function HomePage() {
  const router = useRouter();
  const [showCreateSpace, setShowCreateSpace] = useState(false);
  const [showSelectSpace, setShowSelectSpace] = useState(false);
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [selectedSpace, setSelectedSpace] = useState<Space | null>(null);

  // Form state
  const [spaceName, setSpaceName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

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

  // Fetch spaces when "Select Space" is clicked
  useEffect(() => {
    if (showSelectSpace) {
      fetchSpaces();
    }
  }, [showSelectSpace]);

  const fetchSpaces = async () => {
    try {
      const response = await fetch('/api/spaces/list');
      if (response.ok) {
        const data = await response.json();
        setSpaces(data.spaces || []);
      }
    } catch (error) {
      console.error('Error fetching spaces:', error);
    }
  };

  const handleSpaceLogin = async (space: Space) => {
    setSelectedSpace(space);
    setLoginPassword('');
    setLoginError('');
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSpace) return;

    setIsLoading(true);
    setLoginError('');

    try {
      const response = await fetch('/api/spaces/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          spaceId: selectedSpace.id,
          password: loginPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setLoginError(data.error || 'Mật khẩu không đúng');
        return;
      }

      // Store space info and redirect
      localStorage.setItem('currentSpace', JSON.stringify(data.space));
      window.location.href = `/dashboard/${data.space.id}`;
    } catch (error) {
      console.error('Error logging in:', error);
      setLoginError('Không thể kết nối đến server');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToSpaceList = () => {
    setSelectedSpace(null);
    setLoginPassword('');
    setLoginError('');
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
        {showSelectSpace && !selectedSpace && (
          <Card className="backdrop-blur-xl bg-stone-900/40 border-stone-700/50 shadow-xl">
            <CardHeader>
              <CardTitle>Chọn Space</CardTitle>
              <CardDescription>
                Chọn không gian để truy cập
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {spaces.length === 0 ? (
                <div className="text-sm text-stone-400 bg-stone-950/50 p-4 rounded-md">
                  <p className="font-medium text-stone-300 mb-2">Chưa có space nào được tạo</p>
                  <p>Vui lòng tạo một space mới để bắt đầu sử dụng ứng dụng.</p>
                </div>
              ) : (
                <div className="grid gap-3">
                  {spaces.map((space) => (
                    <button
                      key={space.id}
                      onClick={() => handleSpaceLogin(space)}
                      className="w-full p-4 bg-stone-800/30 border border-stone-700/50 rounded-lg hover:bg-stone-800/50 hover:border-stone-600/50 transition-all text-left group"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-stone-100 mb-1">
                            {space.name}
                          </h3>
                          <p className="text-sm text-stone-400">
                            Tiền tệ: {space.currency}
                          </p>
                        </div>
                        <Lock className="text-stone-500 group-hover:text-stone-400 transition-colors" size={20} />
                      </div>
                    </button>
                  ))}
                </div>
              )}
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

        {/* Password Login Form */}
        {showSelectSpace && selectedSpace && (
          <Card className="backdrop-blur-xl bg-stone-900/40 border-stone-700/50 shadow-xl">
            <CardHeader>
              <CardTitle>Đăng nhập vào {selectedSpace.name}</CardTitle>
              <CardDescription>
                Nhập mật khẩu để truy cập không gian này
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <FormField
                  label="Mật khẩu"
                  type="password"
                  placeholder="Nhập mật khẩu"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  error={loginError}
                />
                <div className="flex gap-3 pt-2">
                  <Button
                    variant="ghost"
                    onClick={handleBackToSpaceList}
                    disabled={isLoading}
                    className="flex-1"
                  >
                    Quay lại
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    className="flex-1"
                    isLoading={isLoading}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
