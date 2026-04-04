package com.business.growthsystem.services;

import com.business.growthsystem.models.Sale;
import com.business.growthsystem.models.SaleItem;
import com.business.growthsystem.models.Product;
import com.business.growthsystem.repositories.SaleRepository;
import com.business.growthsystem.repositories.ProductRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class SaleService {
    private final SaleRepository repository;
    private final ProductRepository productRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public SaleService(SaleRepository repository, ProductRepository productRepository, SimpMessagingTemplate messagingTemplate) {
        this.repository = repository;
        this.productRepository = productRepository;
        this.messagingTemplate = messagingTemplate;
    }

    public List<Sale> getAllSales() { return repository.findAll(); }
    public Sale getSale(Long id) { return repository.findById(id).orElseThrow(); }
    
    @Transactional
    public Sale createSale(Sale sale) {
        if (sale.getDate() == null) {
            sale.setDate(LocalDateTime.now());
        }
        
        double aggregatedTax = 0.0;

        if (sale.getItems() != null) {
            for (com.business.growthsystem.models.SaleItem item : sale.getItems()) {
                item.setSale(sale);
                // Deduct stock
                Product p = productRepository.findById(item.getProduct().getId()).orElseThrow();
                if (p.getStockQuantity() >= item.getQuantity()) {
                    p.setStockQuantity(p.getStockQuantity() - item.getQuantity());
                    productRepository.save(p);
                } else {
                    throw new RuntimeException("Insufficient stock for product " + p.getName());
                }

                // Calculate GST Tax
                double gstPercent = p.getGstPercentage() != null ? p.getGstPercentage() : 0.0;
                double itemTax = (item.getPriceAtSale() * item.getQuantity()) * (gstPercent / 100.0);
                item.setTaxAmountAtSale(itemTax);
                aggregatedTax += itemTax;
            }
        }
        
        sale.setTotalTax(aggregatedTax);
        Sale savedSale = repository.save(sale);
        
        // Broadcast event automatically to frontend
        messagingTemplate.convertAndSend("/topic/sales", savedSale);
        
        return savedSale;
    }
}
