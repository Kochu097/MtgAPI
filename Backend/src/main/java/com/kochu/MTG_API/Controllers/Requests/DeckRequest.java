package com.kochu.MTG_API.Controllers.Requests;

import com.kochu.MTG_API.Enums.MtgColorsEnum;
import com.kochu.MTG_API.Enums.MtgDeckBudgetEnum;
import com.kochu.MTG_API.Enums.MtgPlayFormatEnum;
import com.kochu.MTG_API.Enums.MtgPlaystyleEnum;
import lombok.Data;

import java.util.List;

@Data
public class DeckRequest {
    private MtgPlayFormatEnum format;
    private List<MtgColorsEnum> colors;
    private MtgPlaystyleEnum playstyle;
    private MtgDeckBudgetEnum budget;

}
