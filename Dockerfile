# Stage 1: Build using official Maven image
FROM maven:3.8.5-openjdk-17-slim AS build
WORKDIR /app

# Copy everything
COPY . .

# Find and move pom.xml and src to the current directory (fixes nesting)
RUN find . -name "pom.xml" -exec cp {} . \;
RUN find . -name "src" -type d -exec cp -r {} . \;

# Build using the pre-installed 'mvn' (not the buggy ./mvnw)
RUN mvn clean package -DskipTests

# Stage 2: Run the application
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]
