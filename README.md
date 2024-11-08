# StudentWebApp

Web app made using React, Vite and Django

## Prerequisites

Before starting, ensure you have the following installed (unless you would like to run locally without Docker):

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Docker setup

1. Clone the repository

2. Create a `.env` file in the root of the project. The variables inside should match the variables defined in `db` service environment section of `docker-compose.yml`. Here is an example:

    docker-compose.yml
    ```
    MYSQL_ROOT_PASSWORD: some_root_password
    MYSQL_DATABASE: some_db_name
    MYSQL_USER: some_username
    MYSQL_PASSWORD: some_password
    ```

    .env
    ```
    MYSQL_ROOT_PASSWORD=some_root_password
    MYSQL_DATABASE=some_db_name
    MYSQL_USER=some_username
    MYSQL_PASSWORD=some_password
    ```

    The `.env` file is used to ensure healthchecking the database when containers run.

3. Build and start the application using Docker Compose:

    ```bash
    docker compose up --build
    ```

4. Once the containers are up, the application should be running and accessible on the port defined in `docker-compose.yml` (e.g., `http://localhost:3001`).

5. To stop the running containers, simply use:

    ```bash
    docker compose down
    ```

## Local setup

1. Clone the repository

2. Install frontend dependencies:

    ```bash
    cd front
    npm install
    ```

3. Install backend dependencies (recommended with Python venv):

    ```bash
    cd back
    pip install -r requirements.txt
    ```

4. Create a `.env` file in the `back` folder containing local MySQL database credentials (or update `back/back/settings.py` database section). 
   Here is an example:

    ```dotenv
    DB_NAME=mydb
    DB_USER=root
    DB_PASSWORD=password
    DB_HOST=localhost
    DB_PORT=1111
    ```

5. Run Django `migrate` and `loaddata` to initialize database:

    ```bash
    cd back
    python manage.py migrate
    python manage.py loaddata ../initial_data.json
    ```

5. Run frontend in developer mode:

    ```bash
    cd front
    npm run dev
    ```

6. Run backend:

    ```bash
    cd back
    python manage.py runserver
    ```

## Notes

You may need to change End of Line Sequence for `back/entrypoint.sh` depending on which OS Docker is run.