package com.business.growthsystem.controllers;

import com.business.growthsystem.models.Product;
import com.business.growthsystem.services.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/api/products", "/products"})
public class ProductController {
    private final ProductService service;

    public ProductController(ProductService service) {
        this.service = service;
    }

    @GetMapping
    public List<Product> getAll() { return service.getAllProducts(); }

    @GetMapping("/{id}")
    public Product get(@PathVariable Long id) { return service.getProduct(id); }

    @PostMapping
    public Product create(@RequestBody Product product) { return service.createProduct(product); }

    @PutMapping("/{id}")
    public Product update(@PathVariable Long id, @RequestBody Product product) { return service.updateProduct(id, product); }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.deleteProduct(id);
        return ResponseEntity.ok().build();
    }
}
