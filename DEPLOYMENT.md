# Hướng dẫn triển khai Production

## Chuẩn bị

### 1. Server Requirements
- Ubuntu 20.04+ hoặc CentOS 7+
- RAM: Tối thiểu 4GB (khuyến nghị 8GB)
- CPU: 2 cores trở lên
- Disk: 20GB trở lên
- Docker & Docker Compose đã cài đặt

### 2. Domain & SSL
- Đăng ký domain name
- Cấu hình DNS trỏ về server IP
- Chuẩn bị SSL certificate (Let's Encrypt khuyến nghị)

## Triển khai trên VPS/Cloud

### Bước 1: Cài đặt Docker

#### Ubuntu/Debian
```bash
sudo apt update
sudo apt install -y docker.io docker-compose
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER
```

#### CentOS/RHEL
```bash
sudo yum install -y docker docker-compose
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker $USER
```

### Bước 2: Clone repository
```bash
git clone https://github.com/your-username/poker-app.git
cd poker-app
```

### Bước 3: Cấu hình Environment
```bash
cp .env.example .env
nano .env
```

Cập nhật các giá trị:
```env
MYSQL_ROOT_PASSWORD=your_secure_password
MYSQL_PASSWORD=your_secure_password
JWT_SECRET=your_very_long_and_secure_secret_key_here
REACT_APP_API_URL=https://yourdomain.com/api
REACT_APP_WS_URL=wss://yourdomain.com/ws
```

### Bước 4: Cấu hình SSL (Let's Encrypt)
```bash
# Cài đặt Certbot
sudo apt install -y certbot

# Tạo SSL certificate
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com

# Certificates sẽ được lưu tại:
# /etc/letsencrypt/live/yourdomain.com/fullchain.pem
# /etc/letsencrypt/live/yourdomain.com/privkey.pem
```

### Bước 5: Cấu hình Nginx
```bash
mkdir -p nginx/ssl
sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem nginx/ssl/
sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem nginx/ssl/
```

Tạo file `nginx/nginx.conf`:
```nginx
events {
    worker_connections 1024;
}

http {
    upstream backend {
        server backend:8080;
    }

    upstream frontend {
        server frontend:80;
    }

    # HTTP to HTTPS redirect
    server {
        listen 80;
        server_name yourdomain.com www.yourdomain.com;
        return 301 https://$server_name$request_uri;
    }

    # HTTPS server
    server {
        listen 443 ssl http2;
        server_name yourdomain.com www.yourdomain.com;

        ssl_certificate /etc/nginx/ssl/fullchain.pem;
        ssl_certificate_key /etc/nginx/ssl/privkey.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers HIGH:!aNULL:!MD5;

        # Frontend
        location / {
            proxy_pass http://frontend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }

        # Backend API
        location /api {
            proxy_pass http://backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }

        # WebSocket
        location /ws {
            proxy_pass http://backend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host $host;
        }
    }
}
```

### Bước 6: Khởi động Production
```bash
docker-compose -f docker-compose.prod.yml up -d --build
```

### Bước 7: Kiểm tra logs
```bash
docker-compose -f docker-compose.prod.yml logs -f
```

### Bước 8: Verify
Truy cập: https://yourdomain.com

## Triển khai trên AWS

### Sử dụng EC2 + RDS

#### 1. Tạo RDS MySQL Instance
- Engine: MySQL 8.0
- Instance class: db.t3.micro (hoặc lớn hơn)
- Storage: 20GB
- Enable automatic backups
- Note endpoint URL

#### 2. Tạo EC2 Instance
- AMI: Ubuntu 20.04
- Instance type: t3.small (hoặc lớn hơn)
- Security Group:
  - Port 80 (HTTP)
  - Port 443 (HTTPS)
  - Port 22 (SSH)

#### 3. Cấu hình
```bash
# SSH vào EC2
ssh -i your-key.pem ubuntu@your-ec2-ip

# Cài đặt Docker
sudo apt update
sudo apt install -y docker.io docker-compose

# Clone và cấu hình
git clone https://github.com/your-username/poker-app.git
cd poker-app
cp .env.example .env
nano .env
```

Cập nhật database URL:
```env
SPRING_DATASOURCE_URL=jdbc:mysql://your-rds-endpoint:3306/poker_db
```

#### 4. Deploy
```bash
docker-compose -f docker-compose.prod.yml up -d --build
```

### Sử dụng ECS (Elastic Container Service)

#### 1. Push images lên ECR
```bash
# Authenticate
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin your-account-id.dkr.ecr.us-east-1.amazonaws.com

# Build và push
docker build -t poker-backend ./backend
docker tag poker-backend:latest your-account-id.dkr.ecr.us-east-1.amazonaws.com/poker-backend:latest
docker push your-account-id.dkr.ecr.us-east-1.amazonaws.com/poker-backend:latest

docker build -t poker-frontend ./frontend
docker tag poker-frontend:latest your-account-id.dkr.ecr.us-east-1.amazonaws.com/poker-frontend:latest
docker push your-account-id.dkr.ecr.us-east-1.amazonaws.com/poker-frontend:latest
```

#### 2. Tạo ECS Task Definition
- Container 1: Backend (poker-backend)
- Container 2: Frontend (poker-frontend)
- Link với RDS

#### 3. Tạo ECS Service
- Load Balancer: Application Load Balancer
- Target Groups: Backend (8080), Frontend (80)

## Triển khai trên Google Cloud

### Sử dụng GKE (Google Kubernetes Engine)

#### 1. Tạo GKE Cluster
```bash
gcloud container clusters create poker-cluster \
    --num-nodes=3 \
    --machine-type=n1-standard-2 \
    --zone=us-central1-a
```

#### 2. Build và push images
```bash
# Build
docker build -t gcr.io/your-project-id/poker-backend ./backend
docker build -t gcr.io/your-project-id/poker-frontend ./frontend

# Push
docker push gcr.io/your-project-id/poker-backend
docker push gcr.io/your-project-id/poker-frontend
```

#### 3. Deploy với Kubernetes
Tạo file `k8s/deployment.yaml` và apply:
```bash
kubectl apply -f k8s/
```

## Monitoring & Maintenance

### 1. Logs
```bash
# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Save logs to file
docker-compose logs > logs.txt
```

### 2. Backup Database
```bash
# Manual backup
docker exec poker-mysql-prod mysqldump -u poker_user -ppoker_password poker_db > backup_$(date +%Y%m%d).sql

# Automated backup (cron)
0 2 * * * /path/to/backup-script.sh
```

### 3. Update Application
```bash
# Pull latest code
git pull origin main

# Rebuild and restart
docker-compose -f docker-compose.prod.yml up -d --build

# Remove old images
docker image prune -a
```

### 4. SSL Certificate Renewal
```bash
# Renew certificate
sudo certbot renew

# Copy to nginx
sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem nginx/ssl/
sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem nginx/ssl/

# Restart nginx
docker-compose -f docker-compose.prod.yml restart nginx
```

### 5. Monitoring
```bash
# Check container status
docker-compose ps

# Check resource usage
docker stats

# Check disk space
df -h
```

## Security Checklist

- [ ] Thay đổi tất cả default passwords
- [ ] Sử dụng strong JWT secret
- [ ] Enable HTTPS/SSL
- [ ] Configure firewall (UFW/iptables)
- [ ] Regular security updates
- [ ] Database backups
- [ ] Rate limiting
- [ ] CORS configuration
- [ ] Input validation
- [ ] SQL injection prevention

## Performance Optimization

### 1. Database
- Enable query cache
- Add proper indexes
- Connection pooling
- Regular OPTIMIZE TABLE

### 2. Backend
- JVM tuning
- Connection pooling
- Caching (Redis)
- Async processing

### 3. Frontend
- CDN for static assets
- Gzip compression
- Browser caching
- Code splitting

### 4. Infrastructure
- Load balancer
- Auto-scaling
- CDN (CloudFlare)
- Database read replicas

## Troubleshooting

### Container won't start
```bash
docker-compose logs container-name
docker inspect container-name
```

### Database connection issues
```bash
# Check MySQL is running
docker exec -it poker-mysql-prod mysql -u root -p

# Check network
docker network inspect poker-network-prod
```

### High memory usage
```bash
# Check memory
docker stats

# Restart containers
docker-compose restart
```

## Rollback

### Rollback to previous version
```bash
# Stop current version
docker-compose down

# Checkout previous version
git checkout previous-commit-hash

# Deploy
docker-compose up -d --build
```

## Support

Nếu gặp vấn đề trong quá trình deploy:
1. Kiểm tra logs
2. Verify configuration
3. Check firewall/security groups
4. Tạo issue trên GitHub

---

**Good luck with your deployment! 🚀**
