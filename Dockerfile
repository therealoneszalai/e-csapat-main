# --- 1. Alap image ---
FROM node:24-alpine

# --- 2. Munkakönyvtár a konténerben---
WORKDIR /app

# --- 3. Dependenciák ---
COPY package.json ./
RUN npm i

# --- 4. Forráskód bemásolása az aktuális mappából a konténer app mappájába ---
COPY . .

# --- 5. Környezeti változók (Docker Compose-ból vagy futtatáskor kell átadni)
# Lokális MongoDB esetén: DATABASE_URL=mongodb://host.docker.internal:27017/database_nev
# Linux esetén: DATABASE_URL=mongodb://172.17.0.1:27017/database_nev

# --- 6. Port megnyitása ---
EXPOSE 3000

# --- 7. Indítás ---
CMD ["npm", "start"]