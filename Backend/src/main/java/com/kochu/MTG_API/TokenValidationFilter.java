package com.kochu.MTG_API;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE) // This ensures our filter runs before CORS filter
public class TokenValidationFilter extends OncePerRequestFilter {

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
        if (authHeader != null && authHeader.startsWith("Bearer ") && request.getRequestURI().contains("/ai/")) {
            String token = authHeader.substring(7); // Remove "Bearer " prefix

            try {
                // Add your token validation logic here
                if (isValidToken(token)) {
                    filterChain.doFilter(request, response);
                } else {
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.getWriter().write("Invalid token");
                }
            } catch (Exception e) {
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

    private boolean isValidToken(String token) {

        FirebaseAuth auth = FirebaseAuth.getInstance();
        try {
            auth.verifyIdToken(token);
        } catch (FirebaseAuthException e) {
            return false;
        }
        return true;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        // Add paths that should not be filtered
        String path = request.getRequestURI();
        return path.contains("/swagger-ui/") ||
                path.contains("/v3/api-docs") ;
    }
}