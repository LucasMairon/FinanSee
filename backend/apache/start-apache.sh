#!/bin/bash

# Script para gerar configuração dinâmica do Apache

# Define o valor padrão se não estiver definido
SERVER_NAME=${SERVER_NAME:-localhost}

echo "Apache configurado com ServerName: $SERVER_NAME"

# Cria o diretório conf.d se não existir
mkdir -p /usr/local/apache2/conf.d

# Cria um arquivo de configuração temporário
cat > /tmp/my-vhost.conf << EOF
# Configuração dinâmica gerada em $(date)
# ServerName: $SERVER_NAME

# Garanta que esta linha está no topo, fora de qualquer VirtualHost
SSLSessionCache "shmcb:/run/httpd/ssl_scache(512000)"

# Redireciona todo o tráfego HTTP (porta 80) para HTTPS
<VirtualHost *:80>
    ServerName $SERVER_NAME
    Redirect permanent / https://$SERVER_NAME/
</VirtualHost>

# Configuração do HTTPS (porta 443) com Proxy Reverso
<VirtualHost *:443>
    ServerName $SERVER_NAME
    
    SSLEngine on
    SSLCertificateFile "/usr/local/apache2/conf/ssl/server.crt"
    SSLCertificateKeyFile "/usr/local/apache2/conf/ssl/server.key"
    
    SSLProxyEngine on
    ProxyPreserveHost On

    # Não envia requisições para o backend Django
    ProxyPass /static !
    ProxyPass /.well-known !

    # Envia todo o resto para o backend Django
    ProxyPass / http://web:8000/
    ProxyPassReverse / http://web:8000/

    ErrorLog /proc/self/fd/2
    CustomLog /proc/self/fd/1 common
</VirtualHost>
EOF

# Copia o arquivo gerado para o local correto
cp /tmp/my-vhost.conf /usr/local/apache2/conf.d/my-vhost.conf

# Inicia o Apache
exec httpd-foreground 