# Dockerfile for a PostgreSQL database (based on the official image)
FROM postgres:15-alpine

ENV PGDATA=/var/lib/postgresql/data/pgdata

COPY ./migration/001_create_users_table.sql /docker-entrypoint-initdb.d/001_create_users_table.sql
RUN chmod -R 755 /docker-entrypoint-initdb.d || true

EXPOSE 5432

VOLUME ["/var/lib/postgresql/data"]

HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=5 \
  CMD pg_isready -U "$POSTGRES_USER" -d "$POSTGRES_DB" || exit 1