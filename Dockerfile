# Build Stage
FROM maven:3.8.5-openjdk-17-slim AS build
WORKDIR /app

# Copy only the backend folder
COPY backend/ /app/

# Build the project
RUN mvn clean package -DskipTests

# Run Stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy the generated jar file
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8081

ENTRYPOINT ["java", "-jar", "app.jar"]
