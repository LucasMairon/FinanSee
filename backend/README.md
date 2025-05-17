# SAGE (Sistema de Análise e Gestão Econômica) - API

## Tecnologias Utilizadas
- [Django 5.2](https://docs.djangoproject.com/pt-br/5.2/)
- [Django REST Framework](https://www.django-rest-framework.org)
- [drf-spectacular](https://drf-spectacular.readthedocs.io/en/latest/)
- [PostgreSQL](https://www.postgresql.org)

## Instalação
1. Clone o projeto.
    ```bash
    git clone https://github.com/LucasMairon/SAGE.git
    ```
2. crie o ambiente virtual e ative-o.
    ```bash
    cd backend
    python3 -m venv .venv
    source venv/bin/activate # ./venv/Scripts/activate no windows
    ```
3. Baixe o requerimentos de desenvolvimento.
    ```bash
    pip install -r requirements/development.txt
    ```
4. Configure as variáveis de ambiente. duplique o arquivo .env.example e renomeio para .env
    ```properties
    DEBUG=False
    SECRET_KEY='secret_key'
    ALLOWED_HOSTS='localhost, 127.0.0.1'

    # Permitir requisições de outros domínios
    CORS_ALLOWED_ORIGINS='http://example.com, https://sub.example.com, http://localhost:8080, http://127.0.0.1:9000'

    USE_POSTGRESQL=False

    # Configurações necessárias apenas se for utilizar o PostgreSQL
    # Database Configurations
    DB_NAME='Database Name' 
    DB_USER='Database Username'
    DB_PASSWORD='Database Password'
    DB_HOST='Database Host'
    DB_PORT='Database Port'
    ```

5. Execute as migrações.
    ```bash
    python3 manage.py makemigrations
    python3 manage.py migrate
    ```

6. Execute o servidor.
    ```bash
    python3 manage.py runserver
    ```

7. acesse em:
- swagger-ui -> <http://localhost:8000/api/schema/swagger-ui/>
- redoc -> <http://localhost:8000/api/schema/redoc/>
- baixe o schema -> <http://localhost:8000/api/schema/>

8. Passo opcional. Configurar o verificador de mensagens de commit.

    1. Crie o diretório .git/hooks (se ainda não existir)
        
        verifique se existe:
        ```bash
        ls -la .git/hooks
        ```

        Se o diretório não existir, crie-o:
        ```bash
        mkdir -p .git/hooks
        ```

    2. Copie o arquivo commit-msg.sh para o diretório .git/hooks e renomeie-o para commit-msg (sem extensão):
        ```bash
        cp backend/commit-msg.sh .git/hooks/commit-msg
        ```


    3. Para que o Git possa executar o script, você precisa dar permissão de execução:
        ```bash
        chmod +x .git/hooks/commit-msg
        ```
    referência: <https://github.com/iuricode/padroes-de-commits>