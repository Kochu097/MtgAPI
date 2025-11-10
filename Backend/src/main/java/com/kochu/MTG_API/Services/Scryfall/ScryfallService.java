package com.kochu.MTG_API.Services.Scryfall;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.kochu.MTG_API.API.DTO.CardDto;
import com.kochu.MTG_API.Services.Scryfall.Properties.ScryfallProperties;
import com.kochu.MTG_API.Services.Scryfall.Request.ScryfallIdentifier;
import com.kochu.MTG_API.Services.Scryfall.Request.ScryfallRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Slf4j
@Service
public class ScryfallService {

    private final ScryfallProperties properties;
    private final ObjectMapper objectMapper;
    private final HttpClient httpClient;

    public ScryfallService(ScryfallProperties properties, ObjectMapper objectMapper) {
        this.properties = properties;
        this.objectMapper = objectMapper;
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(15))
                .build();
    }

    public List<CardDto> fetchCardsFromScryfall(List<String> cardNames) throws IOException, InterruptedException {
        List<CardDto> result = new ArrayList<>();

        // Scryfall /cards/collection supports up to 75 identifiers per request
        List<List<String>> chunks = chunk(cardNames);

        for (List<String> chunk : chunks) {
            var identifiers = chunk.stream()
                    .map(ScryfallIdentifier::new)
                    .collect(Collectors.toList());

            var body = new ScryfallRequest(identifiers);

            String json = objectMapper.writeValueAsString(body);

            HttpRequest req = HttpRequest.newBuilder()
                    .uri(URI.create(properties.getUrl() + "/cards/collection"))
                    .timeout(Duration.ofSeconds(30))
                    .header("Content-Type", "application/json; charset=utf-8")
                    .POST(HttpRequest.BodyPublishers.ofString(json, StandardCharsets.UTF_8))
                    .build();

            HttpResponse<String> resp = httpClient.send(req, HttpResponse.BodyHandlers.ofString(StandardCharsets.UTF_8));
            if (resp.statusCode() / 100 != 2) {
                throw new IllegalStateException("Scryfall error: " + resp.statusCode() + " - " + resp.body());
            }

            JsonNode root = objectMapper.readTree(resp.body());
            JsonNode data = root.path("data");
            if (data.isArray()) {
                List<CardDto> cards = objectMapper.readValue(
                        data.toString(),
                        new TypeReference<>() {}
                );
                result.addAll(cards);
            }

            JsonNode notFound = root.path("not_found");
            if (notFound.isArray() && !notFound.isEmpty()) {
                List<String> missing = new ArrayList<>();
                for (JsonNode nf : notFound) {
                    String name = nf.path("name").asText(null);
                    if (name != null) missing.add(name);
                }
                if (!missing.isEmpty()) {
                    log.warn("Scryfall could not find {} card(s): {}", missing.size(), missing);
                }
            }
        }

        return result;
    }

    private static <T> List<List<T>> chunk(List<T> list) {
        if (list == null || list.isEmpty()) return List.of();
        int size = 75;
        int chunks = (list.size() + size - 1) / size;
        return IntStream.range(0, chunks)
                .mapToObj(i -> list.subList(i * size, Math.min(list.size(), (i + 1) * size)))
                .collect(Collectors.toList());
    }
}
