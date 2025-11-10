package com.kochu.MTG_API.API.AI;

import com.kochu.MTG_API.API.AI.Requests.DeckRequest;
import com.kochu.MTG_API.API.AI.Response.NewDeckResponse;
import com.kochu.MTG_API.API.DTO.CardDto;
import com.kochu.MTG_API.API.DTO.UserDto;
import com.kochu.MTG_API.API.Service.MTGAIService;
import com.kochu.MTG_API.Services.Firestore.FirebaseConnectionException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/ai")
@Tag(name = "MTG AI", description = "MTG AI API")
public class MtgAIController {

    MTGAIService mtgAIService;

    @Operation(
            summary = "Generate MTG deck using AI",
            description = "Creates a deck based on format, colors, playstyle, and budget. Costs 1 token.",
            security = @SecurityRequirement(name = "bearerAuth")
    )
    @SecurityRequirement(name = "Bearer Authentication")
    @PostMapping(path = "/createNewDeck", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<NewDeckResponse> createNewDeck(@RequestBody DeckRequest deckRequest) throws FirebaseConnectionException, IOException, InterruptedException {

        var user = (UserDto) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        List<CardDto> cards = mtgAIService.createNewDeck(deckRequest, user);
        var newDeckResponse = new NewDeckResponse(cards, user.getTokens());

        return ResponseEntity.ok(newDeckResponse);
    }
}
