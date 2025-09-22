package com.kochu.MTG_API.Services;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.kochu.MTG_API.Properties.AiProperties;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
public class AIService {


    @Autowired
    private AiProperties properties;
    private final HttpClient httpClient;
    private final ObjectMapper mapper;

    public AIService() {
        this(HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(15)).build(),
            new ObjectMapper());
    }

    public AIService(HttpClient httpClient, ObjectMapper mapper) {
        this.httpClient = httpClient;
        this.mapper = mapper;
    }

    public String callAI(String content, String prompt) throws Exception {
        Map<String, Object> body = new HashMap<>();
        body.put("model", properties.getModel());
        body.put("temperature", 0.7);

        // Chat messages
        List<Map<String, String>> messages = List.of(
                Map.of(
                        "role", "system",
                        "content", content
                ),
                Map.of(
                        "role", "user",
                        "content", prompt
                )
        );
        body.put("messages", messages);

        String json = mapper.writeValueAsString(body);

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://api.openai.com/v1/chat/completions"))
                .timeout(Duration.ofSeconds(60))
                .header("Authorization", "Bearer " + properties.getApiKey())
                .header("Content-Type", "application/json; charset=utf-8")
                .POST(HttpRequest.BodyPublishers.ofString(json, StandardCharsets.UTF_8))
                .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString(StandardCharsets.UTF_8));

        if (response.statusCode() / 100 != 2) {
            throw new IllegalStateException("OpenAI API error: " + response.statusCode() + " - " + response.body());
        }

        JsonNode root = mapper.readTree(response.body());
        JsonNode choices = root.path("choices");
        if (!choices.isArray() || choices.isEmpty()) {
            throw new IllegalStateException("OpenAI returned no choices.");
        }
        JsonNode contentNode = choices.get(0).path("message").path("content");
        String responseContent = contentNode.isTextual() ? contentNode.asText() : contentNode.toString();
        return responseContent == null || responseContent.isBlank() ? "(No content in response was returned)" : responseContent.trim();

    }

}
