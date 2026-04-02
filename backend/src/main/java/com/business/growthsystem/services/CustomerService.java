package com.business.growthsystem.services;

import com.business.growthsystem.models.Customer;
import com.business.growthsystem.repositories.CustomerRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CustomerService {
    private final CustomerRepository repository;

    public CustomerService(CustomerRepository repository) {
        this.repository = repository;
    }

    public List<Customer> getAllCustomers() { return repository.findAll(); }
    public Customer getCustomer(Long id) { return repository.findById(id).orElseThrow(); }
    public Customer createCustomer(Customer customer) { return repository.save(customer); }
    public Customer updateCustomer(Long id, Customer details) {
        Customer c = getCustomer(id);
        c.setName(details.getName());
        c.setEmail(details.getEmail());
        c.setPhone(details.getPhone());
        return repository.save(c);
    }
    public void deleteCustomer(Long id) { repository.deleteById(id); }
}
