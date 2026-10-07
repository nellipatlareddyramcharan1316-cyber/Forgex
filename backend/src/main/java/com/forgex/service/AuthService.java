package com.forgex.service;

import com.forgex.dto.AuthRequest;
import com.forgex.dto.AuthResponse;
import com.forgex.dto.RegisterRequest;
import com.forgex.dto.UserProfileResponse;
import com.forgex.entity.Role;
import com.forgex.entity.User;
import com.forgex.repository.UserRepository;
import com.forgex.security.JwtTokenProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtTokenProvider jwtTokenProvider
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @Transactional
    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new IllegalArgumentException("Email is already registered: " + req.getEmail());
        }

        Role assignedRole = Role.fromString(req.getRole());
        String encodedPassword = passwordEncoder.encode(req.getPassword());

        User user = new User(req.getName(), req.getEmail(), encodedPassword, assignedRole);
        User saved = userRepository.save(user);

        String token = jwtTokenProvider.generateToken(saved);
        return new AuthResponse(token, saved.getId(), saved.getName(), saved.getEmail(), saved.getRole().name());
    }

    public AuthResponse login(AuthRequest req) {
        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new BadCredentialsException("Invalid email or password"));

        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Invalid email or password");
        }

        String token = jwtTokenProvider.generateToken(user);
        return new AuthResponse(token, user.getId(), user.getName(), user.getEmail(), user.getRole().name());
    }

    public UserProfileResponse getProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + email));

        return new UserProfileResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().name(),
                user.getCreatedAt()
        );
    }
}
