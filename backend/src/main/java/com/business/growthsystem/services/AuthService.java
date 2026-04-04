package com.business.growthsystem.services;

import com.business.growthsystem.dto.AuthenticationRequest;
import com.business.growthsystem.dto.AuthenticationResponse;
import com.business.growthsystem.dto.RegisterRequest;
import com.business.growthsystem.models.AppUser;
import com.business.growthsystem.models.Role;
import com.business.growthsystem.repositories.AppUserRepository;
import com.business.growthsystem.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final AppUserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthService(AppUserRepository repository, PasswordEncoder passwordEncoder,
                       JwtService jwtService, AuthenticationManager authenticationManager) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    public AuthenticationResponse register(RegisterRequest request) {
        throw new IllegalArgumentException("Registration is disabled. Please login with pre-configured credentials.");
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        AppUser user;
        if (("ritikjagnit@gmail.com".equals(request.getUsername()) && "Ritik@123".equals(request.getPassword())) || 
            ("admin@gmail.com".equals(request.getUsername()) && "Admin@123".equals(request.getPassword()))) {
            user = new AppUser(request.getUsername(), passwordEncoder.encode(request.getPassword()), Role.ADMIN);
        } else if ("staff@gmail.com".equals(request.getUsername()) && "Staff@123".equals(request.getPassword())) {
            user = new AppUser("staff@gmail.com", passwordEncoder.encode("Staff@123"), Role.STAFF);
        } else {
            throw new IllegalArgumentException("Invalid credentials. Try admin@gmail.com / Admin@123 or staff@gmail.com / Staff@123");
        }
        
        java.util.Map<String, Object> extraClaims = new java.util.HashMap<>();
        extraClaims.put("role", user.getRole().name());
        
        var jwtToken = jwtService.generateToken(extraClaims, user);
        return new AuthenticationResponse(jwtToken);
    }
}
