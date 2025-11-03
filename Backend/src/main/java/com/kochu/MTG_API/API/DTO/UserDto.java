package com.kochu.MTG_API.API.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.Instant;

@Data
@AllArgsConstructor
public class UserDto {

    private String userID;
    private Integer tokens;
    private Instant createdAt;
    private Instant updatedAt;
}
