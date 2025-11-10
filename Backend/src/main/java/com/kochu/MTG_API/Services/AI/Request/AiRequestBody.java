package com.kochu.MTG_API.Services.AI.Request;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public record AiRequestBody(
        @JsonProperty
        String model,
        @JsonProperty
        Double temperature,
        @JsonProperty(namespace = "response_format")
        ResponseFormat responseFormat,
        @JsonProperty
        List<AiMessage> messages

) {
}
