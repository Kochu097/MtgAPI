package com.kochu.MTG_API.Services.OpenAi.Request;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum Roles {
    @JsonProperty("system")
    SYSTEM,
    @JsonProperty("user")
    USER
}
