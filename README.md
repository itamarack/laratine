# Laratine

Laratine is a modern, responsive admin dashboard built with Laravel and Inertia.js (React). It offers a robust and flexible structure to manage your application with ease and efficiency.

## Features

- **User Management**: Create, read, update, and delete users.
- **Role Management**: Assign and manage user roles.
- **Permission Control**: Fine-grained control over user permissions.
- **Responsive Design**: Works seamlessly on all devices.
- **Interactive UI**: Built with React to provide a dynamic and interactive user experience.
- **Customization**: Highly customizable to fit your specific needs.

## Installation

### Prerequisites

Before you begin, ensure you have met the following requirements:

- PHP >= 8.0
- Composer
- Node.js and npm
- Docker and Docker Compose
- A web server (e.g., Apache, Nginx)
- A database (e.g., MySQL, PostgreSQL)

### Steps

#### VSCode Dev Container

You can also use VSCode Dev Container to develop Laratine. Simply open the project folder in VSCode, and the Dev Container will take care of setting up the environment for you.

#### Local Development

**Clone the repository:**

```sh
git clone https://github.com/itamarack/laratine.git
cd laratine
```

**Install dependencies:**

```sh
composer install
npm install
```

**Copy the .env.example file to .env:**

```sh
cp .env.example .env
```

**Generate an application key:**

```sh
php artisan key:generate
```

**Update the following lines in your .env file to match your database configuration:**

```sh
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_database
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

**Run the database migrations:**

```sh
php artisan migrate
```

**Build the front-end assets:**

```sh
npm run dev
```

**Start the development server:**

```sh
php artisan serve
```

Usage
Laratine comes with a default user to help you get started quickly.

Default Admin User:
Email: <admin@example.com>
Password: password
You can log in with these credentials and start managing your application.

### Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.

**To contribute:**

Fork the Project
Create your Feature Branch (git checkout -b feature/AmazingFeature)
Commit your Changes (git commit -m 'Add some AmazingFeature')
Push to the Branch (git push origin feature/AmazingFeature)
Open a Pull Request

## License

Distributed under the MIT License. See LICENSE for more information.

## Contact

Your Tamara - @itamarack - <innosabel@gmail.com>
Project Link: <https://github.com/itamarack/laratine>

## Acknowledgements

Laravel
Inertia.js
React
Tailwind CSS
