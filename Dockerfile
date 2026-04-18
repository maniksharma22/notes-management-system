# Stage 1: Build
FROM maven:3.8.5-openjdk-17-slim AS build
WORKDIR /app

# Try to copy pom.xml from root or backend
COPY pom.xml* backend/pom.xml* ./

# Download dependencies
RUN mvn dependency:go-offline

# Try to copy src from root or backend
COPY src ./src
COPY backend/src ./src

# Build the jar
RUN mvn clean package -DskipTests

# Stage 2: Runtime
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy the built jar
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]
