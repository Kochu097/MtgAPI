package com.kochu.MTG_API.Services.AI.Request;

import com.fasterxml.jackson.annotation.JsonProperty;

public record ResponseFormat (
        @JsonProperty
        String type
) {
}
