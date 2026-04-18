# Stage 1: Build
FROM maven:3.8.5-openjdk-17-slim AS build
WORKDIR /app

# 1. Copy the project file from the backend folder
COPY backend/pom.xml .

# 2. Download dependencies (this layer is cached)
RUN mvn dependency:go-offline

# 3. Copy the source code from backend folder
COPY backend/src ./src

# 4. Build the jar
RUN mvn clean package -DskipTests

# Stage 2: Runtime
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# 5. Copy the jar from build stage to runtime stage
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8081

ENTRYPOINT ["java", "-jar", "app.jar"]
