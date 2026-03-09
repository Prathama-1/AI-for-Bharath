FROM public.ecr.aws/lambda/python:3.12

# Copy requirements.txt to the function root
COPY requirements.txt ${LAMBDA_TASK_ROOT}

# Install dependencies
RUN pip install -r requirements.txt

# Copy the entire server directory to the function root
# This ensures that 'server.main' is importable
COPY server/ ${LAMBDA_TASK_ROOT}/server/

# Set the cmd to the Mangum handler
# Format: [filename without .py].[handler name]
CMD [ "server.main.handler" ]
