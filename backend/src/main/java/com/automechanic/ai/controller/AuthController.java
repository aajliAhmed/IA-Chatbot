package com.automechanic.ai.controller;

import com.automechanic.ai.dto.AuthRequest;
import com.automechanic.ai.dto.AuthResponse;
import com.automechanic.ai.dto.RegisterRequest;
import com.automechanic.ai.entity.User;
import com.automechanic.ai.repository.UserRepository;
import com.automechanic.ai.config.JwtTokenProvider;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody AuthRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()
                    )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = tokenProvider.generateToken(authentication);

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String role = userDetails.getAuthorities().stream()
                    .findFirst()
                    .map(item -> item.getAuthority())
                    .orElse("ROLE_USER");

            return ResponseEntity.ok(AuthResponse.builder()
                    .token(jwt)
                    .username(userDetails.getUsername())
                    .role(role)
                    .build());
        } catch (BadCredentialsException ex) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Identifiants incorrects. Veuillez réessayer.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "Le nom d'utilisateur est déjà utilisé !");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            Map<String, String> response = new HashMap<>();
            response.put("error", "L'adresse e-mail est déjà enregistrée !");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        User user = User.builder()
                .username(signUpRequest.getUsername())
                .email(signUpRequest.getEmail())
                .password(passwordEncoder.encode(signUpRequest.getPassword()))
                .role("ROLE_USER")
                .build();

        userRepository.save(user);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Utilisateur enregistré avec succès !");
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
