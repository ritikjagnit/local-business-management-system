package com.business.growthsystem.controllers;

import com.business.growthsystem.models.Sale;
import com.business.growthsystem.services.SaleService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/api/sales", "/sales"})
public class SaleController {
    private final SaleService service;

    public SaleController(SaleService service) {
        this.service = service;
    }

    @GetMapping
    public List<Sale> getAll() { return service.getAllSales(); }

    @GetMapping("/{id}")
    public Sale get(@PathVariable Long id) { return service.getSale(id); }

    @PostMapping
    public Sale create(@RequestBody Sale sale) { return service.createSale(sale); }
}
