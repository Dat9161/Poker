# Hướng dẫn đóng góp

## Cách đóng góp vào dự án

### 1. Fork repository
Click nút "Fork" ở góc trên bên phải

### 2. Clone repository
```bash
git clone https://github.com/your-username/poker-app.git
cd poker-app
```

### 3. Tạo branch mới
```bash
git checkout -b feature/ten-tinh-nang
```

### 4. Thực hiện thay đổi
- Viết code
- Test kỹ lưỡng
- Commit với message rõ ràng

```bash
git add .
git commit -m "Add: Mô tả tính năng mới"
```

### 5. Push lên GitHub
```bash
git push origin feature/ten-tinh-nang
```

### 6. Tạo Pull Request
Truy cập repository gốc và tạo Pull Request

## Coding Standards

### Frontend (React)
- Sử dụng functional components
- Hooks cho state management
- CSS modules hoặc styled-components
- ESLint + Prettier

### Backend (Java)
- Follow Java naming conventions
- Use Lombok để giảm boilerplate
- Write unit tests
- Document public APIs

### Database
- Sử dụng migrations
- Index các foreign keys
- Normalize data khi cần

## Commit Message Format

```
Type: Short description

Longer description if needed

Types:
- Add: Thêm tính năng mới
- Fix: Sửa bug
- Update: Cập nhật tính năng
- Refactor: Refactor code
- Docs: Cập nhật documentation
- Test: Thêm tests
```

## Testing

### Frontend
```bash
cd frontend
npm test
```

### Backend
```bash
cd backend
./mvnw test
```

## Pull Request Checklist

- [ ] Code builds without errors
- [ ] All tests pass
- [ ] Added tests for new features
- [ ] Updated documentation
- [ ] Followed coding standards
- [ ] No merge conflicts

## Báo cáo Bug

Khi báo cáo bug, hãy bao gồm:
1. Mô tả bug
2. Các bước tái hiện
3. Kết quả mong đợi
4. Kết quả thực tế
5. Screenshots (nếu có)
6. Environment (OS, Browser, Docker version)

## Đề xuất tính năng

Khi đề xuất tính năng mới:
1. Mô tả tính năng
2. Use case
3. Lợi ích
4. Mockups (nếu có)

## Code Review Process

1. Maintainer sẽ review PR
2. Yêu cầu thay đổi nếu cần
3. Approve và merge khi đạt yêu cầu

## Liên hệ

Nếu có câu hỏi, hãy tạo issue hoặc liên hệ maintainers.

Cảm ơn bạn đã đóng góp! 🎉
