package com.kochu.MTG_API.API.DTO;

import java.time.Instant;

public record UserDto(
        String userID,
        Integer tokens,
        Instant createdAt,
        Instant updatedAt
) {
}
