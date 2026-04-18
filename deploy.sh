#!/bin/bash

git push

ssh -i ~/facturas_new pavlo@192.168.1.231 "
cd ~/server/webstack &&
git pull &&
docker-compose up -d --build
"

