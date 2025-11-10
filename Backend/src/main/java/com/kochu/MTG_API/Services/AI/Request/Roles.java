package com.kochu.MTG_API.Services.AI.Request;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum Roles {
    @JsonProperty("system")
    SYSTEM,
    @JsonProperty("user")
    USER
}
