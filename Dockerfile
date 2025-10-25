# Dockerfile

# =========================
# Stage DEV
# =========================
FROM node:25-alpine AS dev
WORKDIR /app

# Installer dépendances
COPY package*.json ./
RUN npm install

# Copier le code
COPY . .

# Donner les droits d’exécution au script d’entrée
RUN chmod +x /app/docker-entrypoint.sh

EXPOSE 3001
CMD ["/app/docker-entrypoint.sh"]
