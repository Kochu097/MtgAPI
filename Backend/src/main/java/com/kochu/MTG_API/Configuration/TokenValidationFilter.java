package com.kochu.MTG_API.Configuration;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import com.kochu.MTG_API.API.DTO.UserDto;
import com.kochu.MTG_API.Services.Firestore.FirebaseConnectionException;
import com.kochu.MTG_API.Services.UserService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Objects;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE) // This ensures our filter runs before CORS filter
public class TokenValidationFilter extends OncePerRequestFilter {

    private final UserService userService;

    public TokenValidationFilter(UserService userService) {
        this.userService = userService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        // Allow OPTIONS requests to pass through (required for CORS preflight)
        if ("OPTIONS".equals(request.getMethod())) {
            filterChain.doFilter(request, response);
            return;
        }

        // Check if the request has an Authorization header
        if (!Objects.isNull(authHeader) && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7); // Remove "Bearer " prefix

            try {
                // Add your token validation logic here
                FirebaseToken decodedToken = isValidToken(token);
                if (!Objects.isNull(decodedToken)) {
                    var userId = decodedToken.getUid();
                    var user = getOrCreateUser(userId);

                    var authentication = new UsernamePasswordAuthenticationToken(user, decodedToken.getUid());
                    SecurityContextHolder.getContext().setAuthentication(authentication);

                    filterChain.doFilter(request, response);
                } else {
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.getWriter().write("Invalid token");
                }
            } catch (FirebaseConnectionException e) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("Token validation failed");
            }
        } else {
            if(request.getRequestURI().contains("/api/")){
                filterChain.doFilter(request, response);
                return;
            }
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Authorization header required");
        }
    }

    private UserDto getOrCreateUser(String userId) throws FirebaseConnectionException {
        var user = userService.getUser(userId);
        if(Objects.isNull(user)) {
           user = userService.createNewUser(userId);
        }
        return user;
    }

    private FirebaseToken isValidToken(String token) {

        FirebaseAuth auth = FirebaseAuth.getInstance();
        try {
            return auth.verifyIdToken(token);
        } catch (FirebaseAuthException e) {
            return null;
        }
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        // Add paths that should not be filtered
        String path = request.getRequestURI();
        return path.contains("/swagger-ui/") ||
                path.contains("/v3/api-docs") ;
    }
}