import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl text-center space-y-8">
        <h1 className="text-4xl font-bold text-stone-100">
          Quản lý Tài chính Cá nhân
        </h1>
        <p className="text-lg text-stone-400">
          Ứng dụng quản lý tài chính toàn diện với theo dõi thu chi, đầu tư, tiết kiệm và ngân sách
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/login"
            className="px-6 py-3 bg-stone-100 text-stone-900 rounded-lg font-medium hover:bg-stone-200 transition-colors"
          >
            Đăng nhập
          </Link>
          <Link
            href="/register"
            className="px-6 py-3 bg-stone-800 text-stone-100 rounded-lg font-medium hover:bg-stone-700 border border-stone-700 transition-colors"
          >
            Đăng ký
          </Link>
        </div>
      </div>
    </div>
  );
}
