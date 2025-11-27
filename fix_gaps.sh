#!/bin/bash
# Script para comentar propriedades gap (não suportadas no React Native)
find app -name "*.js" -type f -exec sed -i 's/^\(\s*\)gap:/\1\/\/ gap:/g' {} \;
echo "Propriedades gap comentadas!"
