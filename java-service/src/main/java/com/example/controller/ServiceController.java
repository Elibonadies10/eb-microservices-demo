package com.example.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import java.util.Map;

@RestController
public class ServiceController {

    @Autowired
    private WebClient.Builder webClientBuilder;

    private static final String PYTHON_SERVICE_URL = System.getenv().getOrDefault("PYTHON_SERVICE_URL", "http://localhost:5000");

    @GetMapping("/api/java/hello")
    public Map<String, String> hello() {
        return Map.of("message", "Hello from Java Service!");
    }

    @GetMapping("/api/java/call-python")
    public Mono<Object> callPython() {
        return webClientBuilder.build()
                .get()
                .uri(PYTHON_SERVICE_URL + "/api/python/hello")
                .retrieve()
                .bodyToMono(Object.class);
    }
}
