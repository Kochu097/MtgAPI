package com.kochu.MTG_API.API.AI.Requests;

import com.kochu.MTG_API.API.Enums.MtgColor;
import com.kochu.MTG_API.API.Enums.MtgDeckBudget;
import com.kochu.MTG_API.API.Enums.MtgPlayFormat;
import com.kochu.MTG_API.API.Enums.MtgPlaystyle;
import lombok.Data;

import java.util.List;

@Data
public class DeckRequest {
    private MtgPlayFormat format;
    private List<MtgColor> colors;
    private MtgPlaystyle playstyle;
    private MtgDeckBudget budget;

}
