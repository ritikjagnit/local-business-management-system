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

import java.time.Month;
import java.util.*;
import java.util.stream.Collectors;

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

    @GetMapping("/predict-sales")
    public ResponseEntity<Map<String, Object>> predictSales() {
        List<Sale> sales = saleRepository.findAll();
        
        // Group by month
        Map<Month, Double> monthlySales = sales.stream()
            .collect(Collectors.groupingBy(
                s -> s.getDate().getMonth(),
                Collectors.summingDouble(Sale::getTotalAmount)
            ));

        // Create historical data
        List<String> months = new ArrayList<>();
        List<Double> revenues = new ArrayList<>();
        List<Map<String, Object>> hist = new ArrayList<>();
        
        // Sort explicitly by month value
        monthlySales.entrySet().stream()
            .sorted(Comparator.comparingInt(e -> e.getKey().getValue()))
            .forEach(e -> {
                months.add(e.getKey().name().substring(0, 3));
                revenues.add(e.getValue());
                hist.add(Map.of("name", e.getKey().name().substring(0, 3), "sales", e.getValue()));
            });

        // Fallback for empty data
        if (hist.isEmpty()) {
            return ResponseEntity.ok(Map.of(
                "trend", "steady", "predictedIncrease", "N/A",
                "recommendedAction", "Start capturing sales to unlock AI insights",
                "historicalData", List.of()
            ));
        }

        try {
            Map<String, Object> request = Map.of("months", months, "revenue", revenues);
            Map<String, Object> response = restTemplate.postForObject(FASTAPI_URL + "/predict/growth", request, Map.class);
            
            response.put("historicalData", hist);
            response.put("recommendedAction", response.get("trend").equals("upward") ? 
                "Maintain stock levels, sales are growing!" : "Consider running a promotion, sales are downward.");
                
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            // Fast API might be down, return default
            return ResponseEntity.ok(Map.of(
                "trend", "?", "predictedIncrease", "?",
                "recommendedAction", "Start Python FastAPI server for predictions",
                "historicalData", hist
            ));
        }
    }

    @GetMapping("/insights")
    public ResponseEntity<Map<String, Object>> getInsights() {
        List<Sale> sales = saleRepository.findAll();
        List<String> products = new ArrayList<>();
        List<Integer> quantities = new ArrayList<>();

        for (Sale sale : sales) {
            for (SaleItem item : sale.getItems()) {
                products.add(item.getProduct().getName());
                quantities.add(item.getQuantity());
            }
        }
        
        if (products.isEmpty()) {
            return ResponseEntity.ok(Map.of("insights", List.of("Awaiting customer orders to calculate intelligence.")));
        }

        try {
            Map<String, Object> request = Map.of("product_names", products, "quantities", quantities);
            Map<String, Object> response = restTemplate.postForObject(FASTAPI_URL + "/predict/insights", request, Map.class);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.ok(Map.of("insights", List.of("Start Python FastAPI server for deep insights")));
        }
    }
}
