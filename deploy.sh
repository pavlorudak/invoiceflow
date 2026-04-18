#!/bin/bash

echo "📤 Subiendo a GitHub..."
git push

echo "🚀 Desplegando en servidor..."
ssh -i ~/facturas_new pavlo@192.168.1.231 "
cd ~/server/webstack &&
git pull origin main &&
docker-compose up -d --build
"

echo "✅ Deploy terminado"

