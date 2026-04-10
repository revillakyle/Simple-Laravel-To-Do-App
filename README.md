INSTRUCTIONS TO RUN


cd todo_app
composer install
cp .env.example .env
php artisan key:generate

DB must have the following:
    DB_CONNECTION=mysql
    DB_HOST=127.0.0.1
    DB_PORT=3306
    DB_DATABASE=todo_app
    DB_USERNAME=user
    DB_PASSWORD=password123

Spin up MySQL

input the following commands:
    php artisan migrate
    php artisan serve

then, after the backend server is up, cd into client:

cd client
npm install
npm run dev
