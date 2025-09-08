package com.kochu.MTG_API.Services;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
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

    private final String apiKey = System.getenv("OPENAI_API_KEY");
    private final String model = "gpt-3.5-turbo";

    private final HttpClient httpClient;
    private final ObjectMapper mapper;

    public AIService() {
        httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(15))
                .build();
        mapper = new ObjectMapper();
    }

    public AIService(HttpClient httpClient, ObjectMapper mapper) {
        this.httpClient = httpClient;
        this.mapper = mapper;
    }

    public String callAI(String prompt) throws Exception {
        Map<String, Object> body = new HashMap<>();
        body.put("model", model);
        body.put("temperature", 0.7);

        // Chat messages
        List<Map<String, String>> messages = List.of(
                Map.of(
                        "role", "system",
                        "content", "You are an expert Magic: The Gathering deck builder. Provide concise, well-structured decklists suitable for play."
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
                .header("Authorization", "Bearer " + apiKey)
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
        String content = contentNode.isTextual() ? contentNode.asText() : contentNode.toString();
        return content == null || content.isBlank() ? "(No content returned)" : content.trim();

    }

}
