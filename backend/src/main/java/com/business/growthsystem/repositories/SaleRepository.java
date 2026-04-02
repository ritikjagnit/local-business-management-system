package com.business.growthsystem.repositories;

import com.business.growthsystem.models.Sale;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SaleRepository extends JpaRepository<Sale, Long> {
}
