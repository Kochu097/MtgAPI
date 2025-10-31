package com.kochu.MTG_API.API.Public;

import com.kochu.MTG_API.API.DTO.AutocompleteDto;
import com.kochu.MTG_API.API.DTO.HealthDto;
import com.kochu.MTG_API.API.DTO.CardDto;
import com.kochu.MTG_API.API.DTO.SetDto;
import com.kochu.MTG_API.Firestore.UserFirestoreService;
import com.kochu.MTG_API.API.Enums.MtgColor;
import com.kochu.MTG_API.API.Enums.MtgDeckBudget;
import com.kochu.MTG_API.API.Enums.MtgPlayFormat;
import com.kochu.MTG_API.API.Enums.MtgPlaystyle;
import com.kochu.MTG_API.Services.MtgService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api")
public class MtgController {

    @Autowired
    MtgService mtgService;

    @Operation(summary = "Fetch MTG card by name", description = "Returns metadata and pricing info for a Magic: The Gathering card using a fuzzy name search (partial name allowed).")
    @GetMapping(path = "/getCardByName", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<CardDto> getCardByName(@RequestParam String name) {
        CardDto result = mtgService.getCardByName(name);
        return ResponseEntity.ok(result);
    }

    @Operation(summary = "Fetch MTG card by exact name", description = "Returns card data only if an exact name match is found.")
    @GetMapping(path = "/getCardByExactName", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<CardDto> getCardByExactName(@RequestParam String exactName) {
        CardDto result = mtgService.getCardByExactName(exactName);
        return ResponseEntity.ok(result);
    }

    @Operation(summary = "Fetch MTG set by code", description = "Returns metadata for a specific set using its official three-letter set code.")
    @GetMapping(path = "/getSetByCode", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<SetDto> getSetByCode(@RequestParam String code) {
        SetDto result = mtgService.getSetByCode(code);
        return ResponseEntity.ok(result);
    }

    @Operation(summary = "Fetch all cards from a set", description = "Returns a list of all cards available in the given set code.")
    @GetMapping(path = "/getCardsBySet", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<CardDto>> getCardsBySet(@RequestParam String setcode) {
        List<CardDto> result = mtgService.getCardsBySetCode(setcode);
        return ResponseEntity.ok(result);
    }

    @Operation(summary = "Fetch a random card", description = "Returns metadata for a randomly selected Magic: The Gathering card.")
    @GetMapping(path = "/getRandomCard", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<CardDto> getRandomCard() {
        CardDto result = mtgService.getRandomCard();
        return ResponseEntity.ok(result);
    }

    @Operation(summary = "Autocomplete card name", description = "Returns card name suggestions based on partial user input.")
    @GetMapping(path = "/autocomplete", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<AutocompleteDto> autocomplete(@RequestParam String name) {
        AutocompleteDto autocompleteDto = mtgService.autocomplete(name);
        return ResponseEntity.ok(autocompleteDto);
    }

    @Operation(summary = "Fetch card image by name", description = "Returns image URLs for a card using a fuzzy search on the name.")
    @GetMapping(path = "/getCardImageByName", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<CardDto.ImageUris> getCardImageByName(@RequestParam String name) {
        CardDto.ImageUris images = mtgService.getCardImageByName(name);
        return ResponseEntity.ok(images);
    }

    @Operation(summary = "Fetch all MTG sets", description = "Returns a list of all Magic: The Gathering sets.")
    @GetMapping(path = "/getAllSets", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<SetDto>> getAllSets() {
        List<SetDto> sets = mtgService.getAllSets();
        return ResponseEntity.ok(sets);
    }

    @GetMapping(path = "/getAvailableColors", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<MtgColor>> getAvailableColors() {
        List<MtgColor> availableColors = Arrays.stream(MtgColor.values()).toList();
        return ResponseEntity.ok(availableColors);
    }

    @GetMapping(path = "getAvailableBudgets", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<MtgDeckBudget>> getAvailableBudgets() {
        List<MtgDeckBudget> availableBudgets = Arrays.stream(MtgDeckBudget.values()).toList();
        return ResponseEntity.ok(availableBudgets);
    }

    @GetMapping(path = "getAvailablePlayFormats", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<MtgPlayFormat>> getAvailablePlayFormats() {
        List<MtgPlayFormat> availablePlayFormats = Arrays.stream(MtgPlayFormat.values()).toList();
        return ResponseEntity.ok(availablePlayFormats);
    }

    @GetMapping(path = "getAvailablePlaystyles", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<MtgPlaystyle>> getAvailablePlaystyles() {
        List<MtgPlaystyle> availablePlaystyles = Arrays.stream(MtgPlaystyle.values()).toList();
        return ResponseEntity.ok(availablePlaystyles);
    }

    @Operation(summary = "Health check", description = "Returns current server status and timestamp.")
    @GetMapping(path = "/health", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<HealthDto> getHealth() {
        return ResponseEntity.ok(new HealthDto());
    }
}
