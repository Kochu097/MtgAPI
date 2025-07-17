package com.kochu.MTG_API.DTO;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class HealthDto {

    private LocalDateTime timestamp;
    private String status;

    public HealthDto() {
        this.timestamp = LocalDateTime.now();
        this.status = "OK";
    }

}
