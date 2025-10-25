# Dockerfile

FROM node:25-alpine AS dev
WORKDIR /app

# Copier package.json + package-lock.json
COPY package*.json ./

# Installer toutes les dépendances
RUN npm ci

# Copier le code source
COPY . .

# Donner les droits d’exécution au script d’entrée
RUN chmod +x /app/docker-entrypoint.sh

EXPOSE 3001

CMD ["/app/docker-entrypoint.sh"]
