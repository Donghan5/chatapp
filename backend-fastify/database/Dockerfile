FROM postgres:15-alpine

COPY ./migration/*.sql /docker-entrypoint-initdb.d/

RUN chmod -R 755 /docker-entrypoint-initdb.d || \
true

EXPOSE 5432

VOLUME ["/var/lib/postgresql/data"]

HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=5 \
  CMD pg_isready -U "$POSTGRES_USER" -d "$POSTGRES_DB" || exit 1