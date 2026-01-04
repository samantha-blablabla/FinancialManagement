# Financial Management - Ứng dụng Quản lý Tài chính Cá nhân

Ứng dụng web quản lý tài chính toàn diện với tính năng theo dõi thu chi, đầu tư, tiết kiệm và ngân sách cho cá nhân và gia đình.

## ✨ Tính năng Chính

### 🏠 Multi-Space System
- Mỗi người dùng có thể tạo nhiều "space" (không gian tài chính) riêng
- Mỗi space có password bảo mật riêng
- Quản lý tài chính độc lập cho từng thành viên gia đình

### 💰 Quản lý Thu Chi
- Theo dõi thu nhập và chi tiêu hàng ngày
- Phân loại theo category tùy chỉnh
- Gắn giao dịch vào Plans (kế hoạch du lịch, sự kiện...)
- Filter và tìm kiếm nâng cao

### 📈 Đầu tư
- **Chứng khoán Việt Nam**: Tích hợp TCBS API để lấy giá real-time
- **Crypto**: Theo dõi Bitcoin, Ethereum, altcoins
- **Bất động sản**: Quản lý tài sản BĐS
- Tự động tính profit/loss
- Biểu đồ performance portfolio

### 🎯 Tiết kiệm
- Đặt mục tiêu tiết kiệm
- Theo dõi progress bar
- Thông báo khi đạt milestone

### 💳 Ngân sách & Cảnh báo
- Đặt ngân sách theo category
- Alert tự động khi vượt ngân sách
- Real-time budget tracking

### 📊 Báo cáo & Thống kê
- Biểu đồ interactive (Recharts)
- Xuất Excel với chi tiết transactions
- Xuất PDF với summary đẹp
- Monthly/yearly reports

### 🔔 Thông báo Real-time
- Budget alerts
- Savings milestones
- WebSocket với Supabase

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router) + TypeScript
- **Styling**: TailwindCSS với custom design system
- **Backend**: Supabase (PostgreSQL + Auth + RLS)
- **State Management**: Zustand
- **Charts**: Recharts
- **Export**: ExcelJS + jsPDF
- **Stock API**: TCBS (Vietnamese stock market)
- **Deployment**: Vercel + Supabase

## 🎨 Design System

- **Background**: #060606
- **Primary Colors**: Stone palette (50-950)
- **Typography**: Google Sans, Major Third scale (1.250)
- **Spacing**: 4px rule system
- **Fully Responsive**: Mobile, Tablet, Desktop

## 📦 Installation

### Prerequisites

- Node.js 20+
- npm hoặc yarn
- Tài khoản Supabase

### Setup

1. **Clone repository**

```bash
cd FinancialManagement
```

2. **Install dependencies**

```bash
npm install
```

3. **Setup Supabase**

Làm theo hướng dẫn trong [supabase/README.md](./supabase/README.md):
- Tạo Supabase project
- Chạy migrations (3 files SQL)
- Lấy API keys

4. **Environment Variables**

Copy `.env.example` thành `.env.local` và điền thông tin:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

5. **Google Sans Font (Optional)**

Tải Google Sans font và đặt vào `app/fonts/`:
- GoogleSans-Regular.ttf
- GoogleSans-Medium.ttf
- GoogleSans-Bold.ttf

Hoặc sử dụng font thay thế (xem `app/fonts/README.md`)

6. **Run development server**

```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000)

## 🗂 Project Structure

```
financial-management/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Auth routes
│   ├── (dashboard)/         # Dashboard routes
│   ├── api/                # API routes
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── ui/                 # Design system
│   │   ├── atoms/          # Button, Input, Card...
│   │   ├── molecules/      # FormField, Modal...
│   │   └── organisms/      # Navbar, Sidebar...
│   └── features/           # Feature components
├── lib/
│   ├── supabase/          # Supabase clients
│   ├── api/               # External APIs
│   ├── utils/             # Utilities
│   └── hooks/             # Custom hooks
├── store/                 # Zustand state
├── types/                 # TypeScript types
├── supabase/             # Database migrations
└── public/               # Static assets
```

## 🚀 Deployment

### Deploy to Vercel

```bash
npm run build

# Deploy to Vercel
vercel --prod
```

Hoặc kết nối GitHub repo với Vercel dashboard.

### Environment Variables in Vercel

Thêm các biến môi trường trong Vercel dashboard:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## 📚 Documentation

- [Supabase Setup Guide](./supabase/README.md)
- [Design System](./docs/design-system.md) _(coming soon)_
- [API Documentation](./docs/api.md) _(coming soon)_

## 🗺 Roadmap

### Phase 1: Foundation ✅
- [x] Next.js setup
- [x] Database schema
- [x] Design system
- [ ] Authentication flow
- [ ] Basic transactions

### Phase 2: Core Features
- [ ] Transaction management
- [ ] Budget tracking
- [ ] Notifications

### Phase 3: Investments
- [ ] Stock portfolio
- [ ] TCBS API integration
- [ ] Crypto & real estate

### Phase 4: Advanced
- [ ] Savings goals
- [ ] Excel/PDF export
- [ ] Advanced charts

### Phase 5: Polish
- [ ] Performance optimization
- [ ] Testing
- [ ] Documentation

## 🔐 Security

- ✅ Row-Level Security (RLS) trên tất cả tables
- ✅ Space-based data isolation
- ✅ Bcrypt password hashing
- ✅ Auth middleware protection
- ✅ Input validation với Zod
- ✅ Rate limiting cho APIs

## 🤝 Contributing

Dự án cá nhân, không nhận contributions. Nhưng bạn có thể fork và tùy chỉnh cho nhu cầu riêng!

## 📝 License

MIT License - Sử dụng tự do cho mục đích cá nhân và thương mại.

## 📧 Contact

Nếu có câu hỏi, tạo issue trong repository này.

---

**Built with ❤️ using Next.js, Supabase, and TailwindCSS**
