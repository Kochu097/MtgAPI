package com.kochu.MTG_API.API.AI;

import com.kochu.MTG_API.API.AI.Requests.DeckRequest;
import com.kochu.MTG_API.API.DTO.CardDto;
import com.kochu.MTG_API.Services.MTGAIService;
import com.kochu.MTG_API.Services.MtgService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/ai")
public class MtgAIController {

    @Autowired
    MTGAIService mtgAIService;

    @Autowired
    MtgService mtgService;

    @Operation(
            summary = "Generate MTG deck using AI",
            description = "Creates a deck based on format, colors, playstyle, and budget. Costs 1 token.",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @PostMapping(path = "/createNewDeck", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> createNewDeck(@RequestBody DeckRequest deckRequest) {
//        List<CardDto> cards = mtgAIService.createNewDeck(deckRequest);
        return ResponseEntity.ok(Map.of(
                "deck", List.of(mtgService.getCardByName("Lightning Bolt")),
                "tokensRemaining", 0
        ));
    }
}
