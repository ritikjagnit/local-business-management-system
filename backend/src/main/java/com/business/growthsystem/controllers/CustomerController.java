package com.business.growthsystem.controllers;

import com.business.growthsystem.models.Customer;
import com.business.growthsystem.services.CustomerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({"/api/customers", "/customers"})
public class CustomerController {
    private final CustomerService service;

    public CustomerController(CustomerService service) {
        this.service = service;
    }

    @GetMapping
    public List<Customer> getAll() { return service.getAllCustomers(); }

    @GetMapping("/{id}")
    public Customer get(@PathVariable Long id) { return service.getCustomer(id); }

    @PostMapping
    public Customer create(@RequestBody Customer customer) { return service.createCustomer(customer); }

    @PutMapping("/{id}")
    public Customer update(@PathVariable Long id, @RequestBody Customer customer) { return service.updateCustomer(id, customer); }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.deleteCustomer(id);
        return ResponseEntity.ok().build();
    }
}
