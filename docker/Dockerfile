# Use a minimal base image for native binaries
FROM alpine:latest

# Install dependencies (if needed)
RUN apk add --no-cache libc6-compat

# Set working directory
WORKDIR /app

# Copy the native binary [Linux only]
COPY target/share-link ./share-link

# Make it executable
RUN chmod +x share-link

# Expose the port
EXPOSE 8080

# Run the binary
ENTRYPOINT ["./share-link"]