package com.kochu.MTG_API.Controllers;

import com.kochu.MTG_API.Controllers.Requests.DeckRequest;
import com.kochu.MTG_API.DTO.CardDto;
import com.kochu.MTG_API.Services.MTGAIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/ai")
public class MtgAIController {

    @Autowired
    MTGAIService mtgAIService;

    @GetMapping(path = "/createNewDeck", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<CardDto>> createNewDeck(@RequestBody DeckRequest deckRequest) {
        List<CardDto> cards = mtgAIService.createNewDeck(deckRequest);
        return ResponseEntity.ok(cards);
    }
}
