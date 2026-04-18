# Stage 1: Build
FROM maven:3.8.5-openjdk-17-slim AS build
WORKDIR /app

# Copy the pom file from the backend directory to the current workdir
COPY backend/pom.xml .

# Pre-fetch dependencies to speed up subsequent builds
RUN mvn dependency:go-offline

# Copy the source code
COPY backend/src ./src

# Execute build
RUN mvn clean package -DskipTests

# Stage 2: Runtime
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy the built jar from the build stage
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8081

ENTRYPOINT ["java", "-jar", "app.jar"]
