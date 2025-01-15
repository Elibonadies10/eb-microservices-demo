package com.example.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class JavaController {

    @GetMapping("/generate-error")
    public ResponseEntity<String> generateError() {
        throw new RuntimeException("This is a generated error from the Java service!");
    }
}
