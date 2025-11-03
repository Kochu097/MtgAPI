package com.kochu.MTG_API.API.AI.Response;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.kochu.MTG_API.API.DTO.CardDto;

import java.util.List;

public record NewDeckResponse (
        @JsonProperty
        List<CardDto> deck,
        @JsonProperty
        Integer tokensRemaining
) {
}
