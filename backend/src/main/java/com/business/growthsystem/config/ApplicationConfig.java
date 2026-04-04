package com.business.growthsystem.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;

import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class ApplicationConfig {

    @Bean
    public UserDetailsService userDetailsService() {
        return username -> {
             if ("ritikjagnit@gmail.com".equals(username) || "admin@gmail.com".equals(username)) {
                 return new com.business.growthsystem.models.AppUser(
                         username,
                         passwordEncoder().encode("Admin@123"),
                         com.business.growthsystem.models.Role.ADMIN
                 );
             } else if ("staff@gmail.com".equals(username)) {
                 return new com.business.growthsystem.models.AppUser(
                         "staff@gmail.com",
                         passwordEncoder().encode("Staff@123"),
                         com.business.growthsystem.models.Role.STAFF
                 );
             }
             throw new UsernameNotFoundException("User not found: try admin@gmail.com or staff@gmail.com.");
        };
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        org.springframework.security.authentication.dao.DaoAuthenticationProvider authProvider = 
            new org.springframework.security.authentication.dao.DaoAuthenticationProvider(userDetailsService());
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
