#!/bin/bash

echo "📤 Subiendo cambios..."
git push

echo "🚀 Actualizando servidor..."
ssh -i ~/facturas_new pavlo@192.168.1.231 "
cd ~/server/webstack &&
git fetch origin &&
git reset --hard origin/main &&
docker-compose up -d --build
"

echo "✅ Deploy completado"

