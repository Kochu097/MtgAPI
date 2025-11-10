package com.kochu.MTG_API.API.Auth;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "User authentication endpoints")
public class AuthController {

    @Value("${firebase.api.key}")
    private String firebaseApiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    @Operation(
            summary = "Login with email and password",
            description = "Authenticate user and return JWT token for API access"
    )
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        String url = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=" + firebaseApiKey;

        Map<String, Object> requestBody = Map.of(
                "email", loginRequest.getEmail(),
                "password", loginRequest.getPassword(),
                "returnSecureToken", true
        );

        try {
            var response = restTemplate.postForObject(url, requestBody, Map.class);

            log.info("User logged in successfully: {}", loginRequest.getEmail());

            return ResponseEntity.ok(new LoginResponse(
                    (String) response.get("idToken"),
                    (String) response.get("refreshToken"),
                    (String) response.get("expiresIn"),
                    (String) response.get("localId")
            ));

        } catch (HttpClientErrorException e) {
            log.warn("Login failed for user: {}", loginRequest.getEmail());
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid email or password"));
        } catch (Exception e) {
            log.error("Login error: ", e);
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Authentication service unavailable"));
        }
    }

    @Operation(
            summary = "Login with Google",
            description = "Authenticate user with Google OAuth token and return JWT token for API access"
    )
    @PostMapping("/google")
    public ResponseEntity<?> loginWithGoogle(@Valid @RequestBody GoogleLoginRequest googleLoginRequest) {
        String url = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithIdp?key=" + firebaseApiKey;

        Map<String, Object> requestBody = Map.of(
                "postBody", "id_token=" + googleLoginRequest.getIdToken() + "&providerId=google.com",
                "requestUri", "http://localhost",
                "returnSecureToken", true,
                "returnIdpCredential", true
        );

        try {
            var response = restTemplate.postForObject(url, requestBody, Map.class);

            log.info("User logged in with Google successfully: {}", response.get("email"));

            return ResponseEntity.ok(new LoginResponse(
                    (String) response.get("idToken"),
                    (String) response.get("refreshToken"),
                    (String) response.get("expiresIn"),
                    (String) response.get("localId")
            ));

        } catch (HttpClientErrorException e) {
            log.warn("Google login failed: {}", e.getMessage());
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid Google token"));
        } catch (Exception e) {
            log.error("Google login error: ", e);
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Authentication service unavailable"));
        }
    }

    @Operation(summary = "Refresh authentication token")
    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
        String url = "https://securetoken.googleapis.com/v1/token?key=" + firebaseApiKey;

        Map<String, Object> requestBody = Map.of(
                "grant_type", "refresh_token",
                "refresh_token", request.getRefreshToken()
        );

        try {
            var response = restTemplate.postForObject(url, requestBody, Map.class);

            return ResponseEntity.ok(Map.of(
                    "idToken", response.get("id_token"),
                    "refreshToken", response.get("refresh_token"),
                    "expiresIn", response.get("expires_in")
            ));

        } catch (Exception e) {
            log.error("Token refresh error: ", e);
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Invalid refresh token"));
        }
    }

    @Data
    public static class LoginRequest {
        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email format")
        private String email;

        @NotBlank(message = "Password is required")
        private String password;
    }

    @Data
    public static class RefreshTokenRequest {
        @NotBlank(message = "Refresh token is required")
        private String refreshToken;
    }

    @Data
    public static class LoginResponse {
        private final String idToken;
        private final String refreshToken;
        private final String expiresIn;
        private final String userId;
    }

    @Data
    public static class GoogleLoginRequest {
        @NotBlank(message = "Google ID token is required")
        private String idToken;
    }
}