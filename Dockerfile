# Stage 1: Build the application
FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /app

# Copy the backend content
COPY backend/ .

# Debug: Show files in logs to confirm path is correct
RUN ls -la

# Fix Windows line endings and permissions
RUN tr -d '\r' < mvnw > mvnw_unix && mv mvnw_unix mvnw
RUN chmod +x ./mvnw

# Build the jar
RUN ./mvnw clean package -DskipTests

# Stage 2: Run the application
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
