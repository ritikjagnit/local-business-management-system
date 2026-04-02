package com.business.growthsystem.repositories;

import com.business.growthsystem.models.AnalyticsLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AnalyticsLogRepository extends JpaRepository<AnalyticsLog, Long> {
}
