FROM node:18-alpine

WORKDIR /app

# ติดตั้งเครื่องมือสำหรับ healthcheck
RUN apk add --no-cache wget

# Copy package.json ก่อน
COPY package*.json ./

# ติดตั้ง dependencies (ใช้ legacy-peer-deps เพื่อรองรับ package ที่อาจมีปัญหาเรื่อง peer dependencies)
RUN npm install --legacy-peer-deps

# Copy ไฟล์ทั้งหมด
COPY . .

# ตั้งค่า environment variables สำหรับการ build
ENV VITE_APP_API_URL=http://backend:3000/api/v1
ENV VITE_APP_API_URL_IMG=http://backend:3000
ENV VITE_APP_SOCKET_URL=http://backend:3000

# เปิดพอร์ต
EXPOSE 5173

# รัน Vite ในโหมด development
CMD ["npm", "run", "dev", "--", "--host=0.0.0.0", "--port=5173"]