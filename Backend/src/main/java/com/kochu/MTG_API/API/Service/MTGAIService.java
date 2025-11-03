package com.kochu.MTG_API.API.Service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.kochu.MTG_API.API.AI.Requests.DeckRequest;
import com.kochu.MTG_API.API.DTO.CardDto;
import com.kochu.MTG_API.API.DTO.UserDto;
import com.kochu.MTG_API.API.Enums.MtgColor;
import com.kochu.MTG_API.API.Service.Exceptions.NotEnoughTokensExceptions;
import com.kochu.MTG_API.Firestore.FirebaseConnectionException;
import com.kochu.MTG_API.Firestore.UserFirestoreService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Slf4j
@Service
public class MTGAIService {

    private final ObjectMapper objectMapper;
    private final HttpClient httpClient;
    private final UserFirestoreService userFirestoreService;
    private final MtgService mtgService;

    @Value("${openai.apiKey:#{null}}")
    private String openAiApiKey;

    @Value("${openai.model:gpt-4o-mini}")
    private String openAiModel;

    private final static Integer NEW_DECK_COST = 1;

    public MTGAIService(ObjectMapper objectMapper, UserFirestoreService userFirestoreService, MtgService mtgService) {
        this.objectMapper = objectMapper;
        this.userFirestoreService = userFirestoreService;
        this.mtgService = mtgService;
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(15))
                .build();
    }

    /**
     * Generates a deck using OpenAI -> returns strict JSON list of card names,
     * then resolves those names from Scryfall into CardDto objects.
     */
    public List<CardDto> createNewDeck(DeckRequest request, UserDto user) throws FirebaseConnectionException {

        user.setTokens(user.getTokens() - NEW_DECK_COST);
        if(user.getTokens() < 0) {
            throw new NotEnoughTokensExceptions("Not enough tokens");
        }

        userFirestoreService.saveUser(user);

        var cards = List.of(mtgService.getRandomCard());

        return cards;
//        String prompt = buildPrompt(request);
//
//        List<String> cardNames;
//        try {
//            cardNames = callOpenAIForCardNames(prompt);
//        } catch (Exception e) {
//            log.error("OpenAI call failed", e);
//            return List.of();
//        }
//
//        if (cardNames.isEmpty()) {
//            return List.of();
//        }
//
//        try {
//            return fetchCardsFromScryfall(cardNames);
//        } catch (Exception e) {
//            log.error("Scryfall fetch failed", e);
//            return List.of();
//        }
    }

    private String buildPrompt(DeckRequest req) {
        String format = req.getFormat() != null ? req.getFormat().name() : "Standard";
        String colors = (req.getColors() == null || req.getColors().isEmpty())
                ? "Colorless"
                : req.getColors().stream().map(MtgColor::name).collect(Collectors.joining(", "));
        String playstyle = (req.getPlaystyle() == null)
                ? "Creator's choice"
                : req.getPlaystyle().name();
        String budget = req.getBudget() != null ? req.getBudget().name() : "Budget";


        // Determine deck size based on format
        int mainboardSize;
        int sideboardSize;
        boolean isCommanderFormat = "Commander".equalsIgnoreCase(format);

        if (isCommanderFormat) {
            mainboardSize = 100; // 1 commander + 99 cards
            sideboardSize = 0;   // Commander has no sideboard
        } else {
            mainboardSize = 60;  // Standard, Modern, Legacy, Vintage, Pioneer
            sideboardSize = 15;  // Typical sideboard size
        }

        int totalCards = mainboardSize + sideboardSize;

        // Build format-specific instructions
        String deckSizeInstructions = isCommanderFormat
                ? """
                - Provide exactly 100 unique card names (including 1 legendary creature as commander).
                - No sideboard for Commander format.
                - All cards except basic lands must be singleton (only one copy)."""
                : "- Provide a " + mainboardSize + "-card mainboard and a " + sideboardSize + "-card sideboard.\n" +
                "- Total of " + totalCards + " unique card names.\n" +
                "- Consider typical deck ratios: ~24 lands, ~24 creatures/threats, ~12 spells/interaction.";

        return "Create a Magic: The Gathering deck with these parameters:\n" +
                "- Format: " + format + "\n" +
                "- Colors: " + colors + "\n" +
                "- Playstyle: " + playstyle + "\n" +
                "- Budget: " + budget + "\n\n" +
                "Return ONLY strict JSON with this shape (no extra text):\n" +
                "{ \"cards\": [\"Card Name 1\", \"Card Name 2\", \"Card Name 3\", ... ] }\n\n" +
                "Rules:\n" +
                "- Use real, correctly spelled English card names that can be resolved on Scryfall.\n" +
                deckSizeInstructions + "\n" +
                "- Do not include counts or annotations; names only.\n" +
                "- Ensure the deck is legal and competitive for " + format + " format.";
    }

    private List<String> callOpenAIForCardNames(String prompt) throws Exception {
        Map<String, Object> body = new HashMap<>();
        body.put("model", openAiModel);
        body.put("temperature", 0.3);
        // Ask for JSON object; supported by modern models
        Map<String, String> responseFormat = new HashMap<>();
        responseFormat.put("type", "json_object");
        body.put("response_format", responseFormat);

        List<Map<String, String>> messages = List.of(
                Map.of("role", "system",
                        "content", "You are an expert Magic: The Gathering deck builder. You must reply with strict JSON only, no extra text."),
                Map.of("role", "user", "content", prompt)
        );
        body.put("messages", messages);

        String json = objectMapper.writeValueAsString(body);

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("https://api.openai.com/v1/chat/completions"))
                .timeout(Duration.ofSeconds(60))
                .header("Authorization", "Bearer " + openAiApiKey)
                .header("Content-Type", "application/json; charset=utf-8")
                .POST(HttpRequest.BodyPublishers.ofString(json, StandardCharsets.UTF_8))
                .build();

        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString(StandardCharsets.UTF_8));
        if (response.statusCode() / 100 != 2) {
            throw new IllegalStateException("OpenAI API error: " + response.statusCode() + " - " + response.body());
        }

        JsonNode root = objectMapper.readTree(response.body());
        JsonNode contentNode = root.path("choices").get(0).path("message").path("content");
        if (!contentNode.isTextual()) {
            throw new IllegalStateException("Unexpected OpenAI response format.");
        }

        // Parse JSON object: { "cards": [ ... ] }
        String content = contentNode.asText().trim();

        // Be resilient to accidental code fences
        int firstBrace = content.indexOf('{');
        int lastBrace = content.lastIndexOf('}');
        if (firstBrace >= 0 && lastBrace > firstBrace) {
            content = content.substring(firstBrace, lastBrace + 1);
        }

        JsonNode jsonObj = objectMapper.readTree(content);
        JsonNode cardsNode = jsonObj.path("cards");
        if (!cardsNode.isArray()) {
            throw new IllegalStateException("AI did not return 'cards' array.");
        }

        List<String> names = new ArrayList<>();
        for (JsonNode n : cardsNode) {
            if (n.isTextual()) {
                String name = n.asText().trim();
                if (!name.isBlank()) {
                    names.add(name);
                }
            }
        }

        // Deduplicate while preserving order and cap to 75 (Scryfall collection limit)
        LinkedHashSet<String> set = new LinkedHashSet<>(names);
        return set.stream().limit(75).collect(Collectors.toList());
    }

    private List<CardDto> fetchCardsFromScryfall(List<String> cardNames) throws Exception {
        List<CardDto> result = new ArrayList<>();

        // Scryfall /cards/collection supports up to 75 identifiers per request
        List<List<String>> chunks = chunk(cardNames, 75);

        for (List<String> chunk : chunks) {
            Map<String, Object> body = new HashMap<>();
            List<Map<String, String>> identifiers = chunk.stream()
                    .map(n -> Map.of("name", n))
                    .collect(Collectors.toList());
            body.put("identifiers", identifiers);

            String json = objectMapper.writeValueAsString(body);

            HttpRequest req = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.scryfall.com/cards/collection"))
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

    private static <T> List<List<T>> chunk(List<T> list, int size) {
        if (list == null || list.isEmpty()) return List.of();
        int chunks = (list.size() + size - 1) / size;
        return IntStream.range(0, chunks)
                .mapToObj(i -> list.subList(i * size, Math.min(list.size(), (i + 1) * size)))
                .collect(Collectors.toList());
    }
}