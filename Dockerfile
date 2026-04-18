# Stage 1: Build the application
FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /app

# Copy EVERYTHING to be safe
COPY . .

# Find where mvnw is and move it to the current WORKDIR
RUN find . -name "mvnw" -exec cp {} . \;
RUN find . -name "pom.xml" -exec cp {} . \;
RUN find . -name "src" -type d -exec cp -r {} . \;

# Fix line endings and permissions
RUN tr -d '\r' < mvnw > mvnw_unix && mv mvnw_unix mvnw
RUN chmod +x ./mvnw

# Build
RUN ./mvnw clean package -DskipTests

# Stage 2: Run the application
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
