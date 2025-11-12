package com.kochu.MTG_API.API.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.kochu.MTG_API.API.AI.Requests.DeckRequest;
import com.kochu.MTG_API.API.DTO.CardDto;
import com.kochu.MTG_API.API.DTO.UserDto;
import com.kochu.MTG_API.API.Enums.MtgColor;
import com.kochu.MTG_API.Services.Firestore.FirebaseConnectionException;
import com.kochu.MTG_API.Services.OpenAi.OpenAiService;
import com.kochu.MTG_API.Services.Scryfall.ScryfallService;
import com.kochu.MTG_API.Services.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
public class MTGAIService {

    private final ObjectMapper objectMapper;
    private final UserService userService;
    private final OpenAiService openAiService;
    private final ScryfallService scryfallService;

    private final static Integer NEW_DECK_COST = 1;

    public MTGAIService(ObjectMapper objectMapper, UserService userService, OpenAiService openAiService, ScryfallService scryfallService) {
        this.objectMapper = objectMapper;
        this.userService = userService;
        this.openAiService = openAiService;
        this.scryfallService = scryfallService;
    }

    /**
     * Generates a deck using OpenAI -> returns strict JSON list of card names,
     * then resolves those names from Scryfall into CardDto objects.
     */
    public List<CardDto> createNewDeck(DeckRequest request, UserDto user) throws FirebaseConnectionException, IOException, InterruptedException {

        userService.deductTokens(user, NEW_DECK_COST);

        var cards = getListOfCardsFromAI(request);

        if (cards.isEmpty()) {
            return List.of();
        }

        return scryfallService.fetchCardsFromScryfall(cards);

    }

    private List<String> getListOfCardsFromAI(DeckRequest request) throws IOException, InterruptedException {
        var prompt = buildPrompt(request);
        var context = "You are an expert Magic: The Gathering deck builder. You must reply with strict JSON only, no extra text.";

        var result = openAiService.callOpenAI(context, prompt);

        // Parse JSON object: { "cards": [ ... ] }
        String content = result.trim();

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
        return names;
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
}