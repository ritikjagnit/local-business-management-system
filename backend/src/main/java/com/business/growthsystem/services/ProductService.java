package com.business.growthsystem.services;

import com.business.growthsystem.models.Product;
import com.business.growthsystem.repositories.ProductRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ProductService {
    private final ProductRepository repository;

    public ProductService(ProductRepository repository) {
        this.repository = repository;
    }

    public List<Product> getAllProducts() { return repository.findAll(); }
    public Product getProduct(Long id) { return repository.findById(id).orElseThrow(); }
    public Product createProduct(Product product) { return repository.save(product); }
    public Product updateProduct(Long id, Product details) {
        Product p = getProduct(id);
        p.setName(details.getName());
        p.setCategory(details.getCategory());
        p.setPrice(details.getPrice());
        p.setCostPrice(details.getCostPrice());
        p.setStockQuantity(details.getStockQuantity());
        return repository.save(p);
    }
    public void deleteProduct(Long id) { repository.deleteById(id); }
}
