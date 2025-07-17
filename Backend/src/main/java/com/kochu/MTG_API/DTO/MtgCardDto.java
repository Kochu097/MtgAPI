package com.kochu.MTG_API.DTO;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class MtgCardDto {
    @Schema(description = "Card name", example = "Lightning Bolt")
    private String name;

    @JsonProperty("mana_cost")
    private String manaCost;

    @JsonProperty("type_line")
    @Schema(description = "Card type line", example = "Instant")
    private String typeLine;

    @JsonProperty("oracle_text")
    @Schema(description = "Card rules text", example = "Deals 3 damage to any target.")
    private String oracleText;

    @JsonProperty("set_name")
    private String setName;

    @JsonProperty("set")
    private String set;

    @JsonProperty("collector_number")
    private String collectorNumber;

    private String rarity;

    @JsonProperty("flavor_text")
    private String flavorText;

    private Prices prices;

    @JsonProperty("image_uris")
    private ImageUris imageUris;

    public String getImageUrl() {
        return imageUris != null ? imageUris.normal : null;
    }

    public String getPriceUsd() {
        return prices != null ? prices.usd : null;
    }

    public String getPriceEur() {
        return prices != null ? prices.eur : null;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Prices {
        public String usd;
        public String eur;
    }

    @Data
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class ImageUris {
        public String small;
        public String normal;
        public String large;
        public String png;
        @JsonProperty("art_crop")
        public String artCrop;
        @JsonProperty("border_crop")
        public String borderCrop;
    }
}
