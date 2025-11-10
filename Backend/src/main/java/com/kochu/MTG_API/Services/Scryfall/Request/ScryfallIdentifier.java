package com.kochu.MTG_API.Services.Scryfall.Request;

import com.fasterxml.jackson.annotation.JsonProperty;

public record ScryfallIdentifier(
        @JsonProperty
        String name
) {
}
