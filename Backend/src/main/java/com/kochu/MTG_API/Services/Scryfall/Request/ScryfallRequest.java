package com.kochu.MTG_API.Services.Scryfall.Request;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public record ScryfallRequest(
        @JsonProperty
         List<ScryfallIdentifier> identifiers
) {
}
