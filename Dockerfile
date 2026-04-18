# Stage 1: Build the application
FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /app

# Copies everything from your local backend folder into the container
COPY backend/ .

# Fixes line endings and permissions for the wrapper
RUN tr -d '\r' < mvnw > mvnw_unix && mv mvnw_unix mvnw
RUN chmod +x ./mvnw

RUN ./mvnw clean package -DskipTests

# Stage 2: Run the application
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
