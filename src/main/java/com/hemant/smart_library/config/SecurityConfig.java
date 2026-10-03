package com.hemant.smart_library.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration configuration) throws Exception {

        return configuration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http
                // REST API ke liye CSRF disabled
                .csrf(csrf -> csrf.disable())

                .authorizeHttpRequests(auth -> auth

                        .requestMatchers("/error")
                        .permitAll()

                        // All API endpoints
                        .requestMatchers("/api/**")
                        .permitAll()

                        // Frontend
                        .requestMatchers(
                                "/",
                                "/index.html",
                                "/dashboard.html",
                                "/admin-dashboard.html",
                                "/librarian-dashboard.html",
                                "/student-dashboard.html",
                                "/css/**",
                                "/js/**"
                        )
                        .permitAll()

                        .anyRequest()
                        .authenticated()
                );

        return http.build();
    }
}