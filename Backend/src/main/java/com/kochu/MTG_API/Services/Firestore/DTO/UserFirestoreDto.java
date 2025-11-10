package com.kochu.MTG_API.Services.Firestore.DTO;

import java.time.Instant;

public record UserFirestoreDto(
   String userID,
   Integer tokens,
   Instant createdAt,
   Instant updatedAt
) {}
