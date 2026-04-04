package com.business.growthsystem.controllers;

import com.business.growthsystem.models.Sale;
import com.business.growthsystem.models.SaleItem;
import com.business.growthsystem.repositories.SaleRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@RestController
@RequestMapping({"/api/ai", "/ai"})
@Transactional(readOnly = true)
public class AiController {

    private final SaleRepository saleRepository;
    private final RestTemplate restTemplate = new RestTemplate();
    private final String FASTAPI_URL = "http://localhost:8000";

    public AiController(SaleRepository saleRepository) {
        this.saleRepository = saleRepository;
    }

    @GetMapping("/advanced-analytics")
    public ResponseEntity<Map<String, Object>> getAdvancedAnalytics() {
        List<Sale> sales = saleRepository.findAll();
        List<Map<String, Object>> saleRecords = new ArrayList<>();
        
        for (Sale sale : sales) {
            for (SaleItem item : sale.getItems()) {
                Map<String, Object> record = new HashMap<>();
                record.put("product_id", item.getProduct().getId());
                record.put("product_name", item.getProduct().getName());
                record.put("quantity", item.getQuantity());
                record.put("price", item.getPriceAtSale());
                record.put("cost", item.getProduct().getCostPrice() != null ? item.getProduct().getCostPrice() : item.getPriceAtSale() * 0.8);
                record.put("date", sale.getDate().toString());
                saleRecords.add(record);
            }
        }
        
        Map<String, Object> request = Map.of("sales", saleRecords);
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Trend API
            Map trendData = restTemplate.postForObject(FASTAPI_URL + "/predict/sales-trend", request, Map.class);
            response.put("trends", trendData);
            
            // Dead Stock API
            Map deadStockData = restTemplate.postForObject(FASTAPI_URL + "/predict/dead-stock", request, Map.class);
            response.put("dead_stock", deadStockData);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of(
                "error", "Advanced Analytics Engine (Python) is not running.",
                "details", e.getMessage()
            ));
        }
    }
}
