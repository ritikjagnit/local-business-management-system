package com.business.growthsystem;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class BusinessGrowthSystemApplication {

	public static void main(String[] args) {
		SpringApplication.run(BusinessGrowthSystemApplication.class, args);
	}

}
