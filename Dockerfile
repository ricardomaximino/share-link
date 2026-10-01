# -----------------------------------------------------------------------------
# Stage 1: Build GraalVM Native Image using Java 25 Linux container
# -----------------------------------------------------------------------------
FROM ghcr.io/graalvm/native-image-community:25 AS builder

WORKDIR /build

# Copy Maven Wrapper configuration and POM first for Docker layer caching
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./

# Convert line endings in case repository was cloned on Windows with CRLF
RUN sed -i 's/\r$//' mvnw && chmod +x mvnw

# Warm up dependency cache (optional/offline)
RUN ./mvnw dependency:go-offline -B || true

# Copy application source code
COPY src/ src/

# Build the Linux native executable (skip unit tests for faster image builds)
RUN ./mvnw -Pnative native:compile -DskipTests -B

# -----------------------------------------------------------------------------
# Stage 2: Ultra-slim, secure Linux runtime container
# -----------------------------------------------------------------------------
FROM debian:bookworm-slim

# Install CA certificates and curl for health checks
RUN apt-get update && \
    apt-get install -y --no-install-recommends ca-certificates curl && \
    rm -rf /var/lib/apt/lists/*

# Run as non-root user
RUN useradd -m -u 1001 appuser
USER appuser
WORKDIR /app

# Copy the compiled native binary from the builder stage
COPY --from=builder --chown=appuser:appuser /build/target/share-link ./share-link

EXPOSE 8080

ENV PORT=8080

ENTRYPOINT ["./share-link"]
