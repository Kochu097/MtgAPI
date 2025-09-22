package com.kochu.MTG_API.Properties;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;
import org.springframework.validation.annotation.Validated;

@Component
@ConfigurationProperties(prefix = "ai")
@Validated
@Data
public class AiProperties {
    @NotNull(message = "API key must be set!")
    private String apiKey;

    @NotNull(message = "Model must be set!")
    private String model;
}
