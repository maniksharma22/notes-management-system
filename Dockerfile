# Stage 1: Build
FROM maven:3.8.5-openjdk-17-slim AS build
WORKDIR /app

# Copy the pom.xml from the specific backend subdirectory
COPY backend/notes-management/pom.xml .

# Download dependencies to speed up subsequent builds
RUN mvn dependency:go-offline

# Copy the source code from the specific backend subdirectory
COPY backend/notes-management/src ./src

# Build the application and skip tests for faster deployment
RUN mvn clean package -DskipTests

# Stage 2: Runtime
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy the jar file generated in the target folder to the runtime image
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]
