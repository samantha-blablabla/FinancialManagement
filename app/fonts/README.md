# Google Sans Font

Tải Google Sans font và đặt các file sau vào thư mục này:

- GoogleSans-Regular.ttf
- GoogleSans-Medium.ttf
- GoogleSans-Bold.ttf

Bạn có thể tải từ: https://fonts.google.com/specimen/Google+Sans (hoặc tìm kiếm "Google Sans ttf download")

Nếu không có font, bạn có thể tạm thời sử dụng system font bằng cách comment phần `localFont` trong `app/layout.tsx` và sử dụng:

```tsx
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin', 'vietnamese'] });
```
