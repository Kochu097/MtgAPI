package com.kochu.MTG_API.Services.OpenAi.Request;

import com.fasterxml.jackson.annotation.JsonProperty;

public record ResponseFormat (
        @JsonProperty
        String type
) {
}
