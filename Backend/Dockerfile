### Stage 1: Build the JAR ###
FROM maven:3.9.9-eclipse-temurin-17 AS build
WORKDIR /app

# Copy all project files
COPY . .

# Build the Spring Boot JAR
RUN mvn clean package -DskipTests

### Stage 2: Run the JAR ###
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app

# Copy the built JAR from the build stage
COPY --from=build /app/target/MTG_API-0.0.2.jar app.jar

# Expose Spring Boot's default port
EXPOSE 8080

# Run the app
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
