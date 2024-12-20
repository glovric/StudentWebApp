#!/bin/bash

# Check if the flag file exists. If it does, skip initialization.
if [ ! -f /app/first_run.flag ]; then

    echo "First run: Initializing the database..."

    # Run Django migrations to set up the database schema
    echo "Running Django migrations..."
    python manage.py migrate

    # Load initial data from the JSON file
    if [ -f /app/initial_data.json ]; then
        echo "Loading initial data into the database..."
        python manage.py loaddata /app/initial_data.json
    fi

    # Create a Django superuser if it doesn't exist
    echo "Creating Django superuser..."

    # Create superuser if not already created
    python manage.py shell <<EOF
from django.contrib.auth import get_user_model
from django.core.management import call_command

User = get_user_model()
if not User.objects.filter(username='$DJANGO_SUPERUSER_USERNAME').exists():
    User.objects.create_superuser(
        username='$DJANGO_SUPERUSER_USERNAME',
        email='$DJANGO_SUPERUSER_EMAIL',
        password='$DJANGO_SUPERUSER_PASSWORD'
    )
    print("Superuser created!")
else:
    print("Superuser already exists.")
EOF

    # Mark the process as complete by creating a flag file
    touch /app/first_run.flag
    echo "Database initialized, migrations applied, and superuser created. Flag file created."

fi

# Continue with the Django server start
exec "$@"
