# docker-entrypoint.sh

#!/bin/sh
set -e

echo "🏁 Initialisation du conteneur NestJS (mode DEV)..."

# Attendre MySQL
echo "⏳ Attente de MySQL..."
until nc -z ${DB_HOST:-mysql_nestjs_api_001} 3306; do
  echo "   ➤ MySQL n'est pas encore prêt..."
  sleep 3
done
echo "✅ MySQL est disponible !"
sleep 2 # Attendre un peu plus pour s'assurer que MySQL est prêt

# Générer Prisma client
echo "🔹 Génération du client Prisma..."
npx prisma generate

# Appliquer les migrations en dev
echo "🔹 Application des migrations (migrate dev)..."
npx prisma migrate dev --name init --skip-seed || true

# Démarrage du serveur NestJS avec watch + polling
echo "🚀 Démarrage de NestJS (watch mode avec polling)..."
npm run start:dev


