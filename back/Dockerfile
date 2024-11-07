# Step 1: Use an official Python image
FROM python:3.10

# Step 2: Set the working directory
WORKDIR /app

# Step 3: Copy the requirements file and install dependencies
COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

# Step 4: Copy the application code
COPY . .

# Step 5: Copy the entrypoint script and make it executable
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

RUN mkdir -p logs && chmod 777 logs

# Step 6: Expose the port that Django runs on
EXPOSE 8000

# Step 7: Set the entrypoint to the script
ENTRYPOINT ["/entrypoint.sh"]

# Step 8: Default command to run Django when the container starts
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]