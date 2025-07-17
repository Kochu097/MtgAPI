package com.kochu.MTG_API.DTO;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ApiErrorDto {

    private LocalDateTime timestamp;
    private int status;
    private String message;

    public ApiErrorDto(String message, int status) {
        this.timestamp = LocalDateTime.now();
        this.status = status;
        this.message = message;
    }
}
