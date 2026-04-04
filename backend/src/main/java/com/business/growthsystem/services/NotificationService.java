package com.business.growthsystem.services;

import com.business.growthsystem.models.Product;
import com.business.growthsystem.repositories.ProductRepository;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

@Service
public class NotificationService {

    private static final Logger logger = LoggerFactory.getLogger(NotificationService.class);

    private final ProductRepository productRepository;
    // Commended out until Mail properties are configured in application.properties securely
    // private final JavaMailSender mailSender; 

    public NotificationService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    // Runs every day at 8 AM
    @Scheduled(cron = "0 0 8 * * ?")
    public void sendLowStockAlerts() {
        logger.info("Running scheduled low stock check...");
        List<Product> products = productRepository.findAll();
        StringBuilder lowStockItems = new StringBuilder();
        int threshold = 5; // Default threshold

        for (Product product : products) {
            if (product.getStockQuantity() <= threshold) {
                lowStockItems.append("- ").append(product.getName())
                        .append(" (Stock: ").append(product.getStockQuantity()).append(")\n");
            }
        }

        if (lowStockItems.length() > 0) {
            String message = "The following products are running low on stock:\n" + lowStockItems.toString();
            logger.warn("LOW STOCK ALERT:\n" + message);
            // sendEmail("admin@localbusiness.com", "Low Stock Alert", message);
        }
    }

    public void sendEmail(String to, String subject, String text) {
        /*
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("noreply@growthsystem.com");
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        mailSender.send(message);
        */
        logger.info("Email mocked for demonstration: To: " + to + ", Subject: " + subject);
    }
}
