package com.example;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.context.annotation.Bean;
import jakarta.annotation.PostConstruct;
import io.pyroscope.javaagent.PyroscopeAgent;
import io.pyroscope.javaagent.config.Config;
import io.pyroscope.javaagent.EventType;
import io.pyroscope.http.Format;

@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

    @Bean
    public WebClient.Builder webClientBuilder() {
        return WebClient.builder();
    }

    @PostConstruct
    public void init() {
        System.out.println("=====================================");
        System.out.println("PYROSCOPE CONFIGURATION DEBUG OUTPUT:");
        System.out.println("Application Name: " + System.getenv("PYROSCOPE_APPLICATION_NAME"));
        System.out.println("Server Address: " + System.getenv("PYROSCOPE_SERVER_ADDRESS"));
        System.out.println("Username: " + System.getenv("PYROSCOPE_USERNAME"));
        System.out.println("Password present: " + (System.getenv("PYROSCOPE_PASSWORD") != null));
        if (System.getenv("PYROSCOPE_PASSWORD") != null) {
            System.out.println("Password length: " + System.getenv("PYROSCOPE_PASSWORD").length());
        }
        System.out.println("=====================================");

        PyroscopeAgent.start(
            new Config.Builder()
                .setApplicationName(System.getenv("PYROSCOPE_APPLICATION_NAME"))
                .setProfilingEvent(EventType.ITIMER)
                .setFormat(Format.JFR)
                .setServerAddress(System.getenv("PYROSCOPE_SERVER_ADDRESS"))
                .setBasicAuthUser(System.getenv("PYROSCOPE_USERNAME"))
                .setBasicAuthPassword(System.getenv("PYROSCOPE_PASSWORD"))
                .build()
        );
    }
}
