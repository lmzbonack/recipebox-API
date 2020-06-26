FROM python:3.7-slim

ENV PIP_DISABLE_PIP_VERSION_CHECK=on
ENV PIP_DEFAULT_TIMEOUT=100
ENV POETRY_VERSION=1.0.3

# Install poetry
RUN pip install "poetry==$POETRY_VERSION"

WORKDIR /recipebox

COPY poetry.lock pyproject.toml ./
# Install dependencies
RUN poetry config virtualenvs.create false \
  && poetry install $(test "$FLASK_ENV" = prod && echo "--no-dev") --no-interaction --no-ansi
COPY . .
# Set up scripts
# RUN chmod 755 /app/setup/scripts/entrypoint.sh
# RUN chmod 775 /app/setup/scripts/wait-for-it.sh
# Run the entrypoint script
# ENTRYPOINT ["/app/setup/scripts/entrypoint.sh"]
EXPOSE 5000
# Run the server
CMD ["gunicorn", "-b 0.0.0.0:5000", "--reload", "recipebox.app:app"]
