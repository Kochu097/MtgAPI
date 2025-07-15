package com.kochu.MTG_API.DTO;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class SetDto {
    private String code;

    @JsonProperty("mtgo_code")
    private String mtgoCode;

    private String name;

    @JsonProperty("released_at")
    private String releasedAt;

    @JsonProperty("set_type")
    private String setType;

    @JsonProperty("card_count")
    private Integer cardCount;

    @JsonProperty("digital")
    private Boolean isDigital;

    @JsonProperty("nonfoil_only")
    private Boolean nonFoilOnly;

    @JsonProperty("foil_only")
    private Boolean foilOnly;

    @JsonProperty("block_code")
    private String blockCode;

    @JsonProperty("block")
    private String block;

    @JsonProperty("icon_svg_uri")
    private String iconUrl;


}
