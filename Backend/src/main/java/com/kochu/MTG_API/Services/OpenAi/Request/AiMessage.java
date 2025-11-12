package com.kochu.MTG_API.Services.OpenAi.Request;

import com.fasterxml.jackson.annotation.JsonProperty;

public record AiMessage(
        @JsonProperty
        Roles role,
        @JsonProperty
        String content

) {
}
