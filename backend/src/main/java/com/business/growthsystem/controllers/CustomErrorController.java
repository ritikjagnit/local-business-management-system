package com.business.growthsystem.controllers;


import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.http.HttpServletRequest;
import java.util.Map;

@RestController
public class CustomErrorController implements ErrorController {

    @RequestMapping("/error")
    public ResponseEntity<Map<String, Object>> handleError(HttpServletRequest request) {
        Object status = request.getAttribute(RequestDispatcher.ERROR_STATUS_CODE);
        int statusCode = status != null ? Integer.parseInt(status.toString()) : 500;
        
        String message = "An unexpected error occurred.";
        if (statusCode == 404) {
            message = "Endpoint not found. Please verify the URL.";
        } else if (statusCode == 403) {
            message = "Access Denied. You must be authenticated to view this endpoint.";
        } else if (statusCode == 401) {
            message = "Unauthorized. Please provide a valid JWT token.";
        }

        return ResponseEntity.status(statusCode).body(Map.of(
            "status", statusCode,
            "error", true,
            "message", message
        ));
    }

    @RequestMapping("/")
    public ResponseEntity<Map<String, Object>> root() {
        return ResponseEntity.ok(Map.of(
            "status", 200,
            "message", "Backend API is running. Please access the React frontend at http://localhost:5173",
            "system", "GrowthSystem API"
        ));
    }
}
