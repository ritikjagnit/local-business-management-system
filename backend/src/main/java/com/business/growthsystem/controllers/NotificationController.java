package com.business.growthsystem.controllers;

import com.business.growthsystem.services.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping("/alerts/low-stock")
    public ResponseEntity<Map<String, String>> triggerLowStockCheck() {
        notificationService.sendLowStockAlerts();
        return ResponseEntity.ok(Map.of("message", "Low stock alert check triggered successfully. Check logs."));
    }

    @PostMapping("/notifications/send")
    public ResponseEntity<Map<String, String>> sendCustomNotification(
            @RequestParam String to, 
            @RequestParam String subject, 
            @RequestParam String text) {
        notificationService.sendEmail(to, subject, text);
        return ResponseEntity.ok(Map.of("message", "Notification sent to " + to));
    }
}
