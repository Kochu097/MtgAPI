package com.kochu.MTG_API.Services.Scryfall.Properties;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;
import org.springframework.validation.annotation.Validated;

@Component
@ConfigurationProperties(prefix = "scryfall")
@Validated
@Data
public class ScryfallProperties {
    @NotNull(message = "scryfall url must be set!")
    private String url;
}
