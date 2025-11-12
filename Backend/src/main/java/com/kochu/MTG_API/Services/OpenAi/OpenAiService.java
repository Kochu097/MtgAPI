package com.kochu.MTG_API.Services.OpenAi;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.kochu.MTG_API.Services.OpenAi.Properties.AiProperties;
import com.kochu.MTG_API.Services.OpenAi.Request.AiMessage;
import com.kochu.MTG_API.Services.OpenAi.Request.AiRequestBody;
import com.kochu.MTG_API.Services.OpenAi.Request.ResponseFormat;
import com.kochu.MTG_API.Services.OpenAi.Request.Roles;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.List;

@Slf4j
@Service
public class OpenAiService {

    private final AiProperties properties;
    private final HttpClient httpClient;
    private final ObjectMapper mapper;

    public OpenAiService(AiProperties properties, ObjectMapper mapper) {
        this.properties = properties;
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(15))
                .build();;
        this.mapper = mapper;
    }

    public String callOpenAI(String content, String prompt) throws IOException, InterruptedException {

        AiRequestBody requestBody = new AiRequestBody(
                properties.getModel(),
                0.7,
                new ResponseFormat("json_object"),
                List.of(
                        new AiMessage(Roles.SYSTEM, content),
                        new AiMessage(Roles.USER, prompt)
                )

        );

        String json = mapper.writeValueAsString(requestBody);

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(properties.getUrl()))
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
