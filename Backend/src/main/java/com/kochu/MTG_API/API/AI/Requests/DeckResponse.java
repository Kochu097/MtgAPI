package com.kochu.MTG_API.API.AI.Requests;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DeckResponse {
    private String prompt;
    private String deckText;
}

