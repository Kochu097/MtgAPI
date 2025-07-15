package com.kochu.MTG_API;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.kochu.MTG_API.DTO.AutocompleteDto;
import com.kochu.MTG_API.DTO.HealthDto;
import com.kochu.MTG_API.DTO.MtgCardDto;
import com.kochu.MTG_API.DTO.SetDto;
import com.kochu.MTG_API.Exceptions.CardNotFoundException;
import com.kochu.MTG_API.Exceptions.SetNotFoundException;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;

import java.util.Arrays;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public class MtgControllerIntegrationTest {

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    @MockitoBean
    private MtgService mtgService;

    @Test
    public void testGetCardByName_Success() {
        // Given
        MtgCardDto mockCard = createMockCard("Lightning Bolt");
        when(mtgService.getCardByName("Lightning Bolt")).thenReturn(mockCard);

        // When
        String url = "http://localhost:" + port + "/api/getCardByName?name=Lightning Bolt";
        ResponseEntity<MtgCardDto> response = restTemplate.getForEntity(url, MtgCardDto.class);

        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getName()).isEqualTo("Lightning Bolt");
        assertThat(response.getBody().getManaCost()).isEqualTo("{R}");
        assertThat(response.getBody().getTypeLine()).isEqualTo("Instant");
    }

    @Test
    public void testGetCardByName_NotFound() {
        // Given
        when(mtgService.getCardByName("NonExistentCard"))
                .thenThrow(new CardNotFoundException("Card not found: NonExistentCard"));

        // When
        String url = "http://localhost:" + port + "/api/getCardByName?name=NonExistentCard";
        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);

        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    public void testGetCardByName_MissingParameter() {
        // When
        String url = "http://localhost:" + port + "/api/getCardByName";
        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);

        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    public void testGetCardByExactName_Success() {
        // Given
        MtgCardDto mockCard = createMockCard("Lightning Bolt");
        when(mtgService.getCardByExactName("Lightning Bolt")).thenReturn(mockCard);

        // When
        String url = "http://localhost:" + port + "/api/getCardByExactName?exactName=Lightning+Bolt";
        ResponseEntity<MtgCardDto> response = restTemplate.getForEntity(url, MtgCardDto.class);

        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getName()).isEqualTo("Lightning Bolt");
    }

    @Test
    public void testGetCardByExactName_NotFound() {
        // Given
        when(mtgService.getCardByExactName("Lightning Bol"))
                .thenThrow(new CardNotFoundException("Card not found: Lightning Bol"));

        // When
        String url = "http://localhost:" + port + "/api/getCardByExactName?exactName=Lightning Bol";
        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);

        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    public void testGetSetByCode_Success() {
        // Given
        SetDto mockSet = createMockSet("M21", "Core Set 2021");
        when(mtgService.getSetByCode("M21")).thenReturn(mockSet);

        // When
        String url = "http://localhost:" + port + "/api/getSetByCode?code=M21";
        ResponseEntity<SetDto> response = restTemplate.getForEntity(url, SetDto.class);

        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getCode()).isEqualTo("M21");
        assertThat(response.getBody().getName()).isEqualTo("Core Set 2021");
    }

    @Test
    public void testGetSetByCode_NotFound() {
        // Given
        when(mtgService.getSetByCode("XXX"))
                .thenThrow(new SetNotFoundException("Set not found under a code: XXX"));

        // When
        String url = "http://localhost:" + port + "/api/getSetByCode?code=XXX";
        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);

        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    public void testGetCardsBySet_Success() {
        // Given
        List<MtgCardDto> mockCards = Arrays.asList(
                createMockCard("Lightning Bolt"),
                createMockCard("Counterspell")
        );
        when(mtgService.getCardsBySetCode("M21")).thenReturn(mockCards);

        // When
        String url = "http://localhost:" + port + "/api/getCardsBySet?setcode=M21";
        ResponseEntity<List> response = restTemplate.getForEntity(url, List.class);

        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().size()).isEqualTo(2);
    }

    @Test
    public void testGetCardsBySet_EmptySet() {
        // Given
        when(mtgService.getCardsBySetCode("EMPTY"))
                .thenThrow(new SetNotFoundException("Set not found under a code: EMPTY"));

        // When
        String url = "http://localhost:" + port + "/api/getCardsBySet?setcode=EMPTY";
        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);

        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    public void testGetRandomCard_Success() {
        // Given
        MtgCardDto mockCard = createMockCard("Random Card");
        when(mtgService.getRandomCard()).thenReturn(mockCard);

        // When
        String url = "http://localhost:" + port + "/api/getRandomCard";
        ResponseEntity<MtgCardDto> response = restTemplate.getForEntity(url, MtgCardDto.class);

        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getName()).isEqualTo("Random Card");
    }

    @Test
    public void testGetRandomCard_ServiceError() {
        // Given
        when(mtgService.getRandomCard())
                .thenThrow(new RuntimeException("Service temporarily unavailable"));

        // When
        String url = "http://localhost:" + port + "/api/getRandomCard";
        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);

        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Test
    public void testAutocomplete_Success() {
        // Given
        AutocompleteDto mockAutocomplete = createMockAutocomplete("Lightning");
        when(mtgService.autocomplete("Lightning")).thenReturn(mockAutocomplete);

        // When
        String url = "http://localhost:" + port + "/api/autocomplete?name=Lightning";
        ResponseEntity<AutocompleteDto> response = restTemplate.getForEntity(url, AutocompleteDto.class);

        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getTotalValues()).isEqualTo(3);
        assertThat(response.getBody().getData()).contains("Lightning Bolt");
    }

    @Test
    public void testAutocomplete_NoResults() {
        // Given
        when(mtgService.autocomplete("xyz"))
                .thenThrow(new SetNotFoundException("Autocomplete not found for: xyz"));

        // When
        String url = "http://localhost:" + port + "/api/autocomplete?name=xyz";
        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);

        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    public void testGetCardImageByName_Success() {
        // Given
        MtgCardDto.ImageUris mockImageUris = createMockImageUris();
        when(mtgService.getCardImageByName("Lightning Bolt")).thenReturn(mockImageUris);

        // When
        String url = "http://localhost:" + port + "/api/getCardImageByName?name=Lightning Bolt";
        ResponseEntity<MtgCardDto.ImageUris> response = restTemplate.getForEntity(url, MtgCardDto.ImageUris.class);

        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getNormal()).isEqualTo("https://example.com/normal.jpg");
        assertThat(response.getBody().getLarge()).isEqualTo("https://example.com/large.jpg");
    }

    @Test
    public void testGetCardImageByName_NotFound() {
        // Given
        when(mtgService.getCardImageByName("NonExistentCard"))
                .thenThrow(new CardNotFoundException("Card not found: NonExistentCard"));

        // When
        String url = "http://localhost:" + port + "/api/getCardImageByName?name=NonExistentCard";
        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);

        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    @Test
    public void testGetAllSets_Success() {
        // Given
        List<SetDto> mockSets = Arrays.asList(
                createMockSet("M21", "Core Set 2021"),
                createMockSet("ZNR", "Zendikar Rising"),
                createMockSet("KHM", "Kaldheim")
        );
        when(mtgService.getAllSets()).thenReturn(mockSets);

        // When
        String url = "http://localhost:" + port + "/api/getAllSets";
        ResponseEntity<List> response = restTemplate.getForEntity(url, List.class);

        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().size()).isEqualTo(3);
    }

    @Test
    public void testGetAllSets_ServiceError() {
        // Given
        when(mtgService.getAllSets())
                .thenThrow(new RuntimeException("Failed to fetch sets"));

        // When
        String url = "http://localhost:" + port + "/api/getAllSets";
        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);

        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @Test
    public void testGetHealth_Success() {
        // When
        String url = "http://localhost:" + port + "/api/health";
        ResponseEntity<HealthDto> response = restTemplate.getForEntity(url, HealthDto.class);

        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getStatus()).isEqualTo("OK");
        assertThat(response.getBody().getTimestamp()).isNotNull();
    }

    @Test
    public void testContentTypeHeaders() {
        // When
        String url = "http://localhost:" + port + "/api/health";
        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);

        // Then
        assertThat(response.getHeaders().getContentType().toString())
                .contains("application/json");
    }

    @Test
    public void testSpecialCharactersInCardName() {
        // Given
        MtgCardDto mockCard = createMockCard("Æther Vial");
        when(mtgService.getCardByName("Æther Vial")).thenReturn(mockCard);

        // When
        String url = "http://localhost:" + port + "/api/getCardByName?name=Æther Vial";
        ResponseEntity<MtgCardDto> response = restTemplate.getForEntity(url, MtgCardDto.class);

        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody().getName()).isEqualTo("Æther Vial");
    }

    @Test
    public void testUrlEncodingInSetCode() {
        // Given
        SetDto mockSet = createMockSet("M21", "Core Set 2021");
        when(mtgService.getSetByCode("M21")).thenReturn(mockSet);

        // When
        String url = "http://localhost:" + port + "/api/getSetByCode?code=M21";
        ResponseEntity<SetDto> response = restTemplate.getForEntity(url, SetDto.class);

        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody().getCode()).isEqualTo("M21");
    }

    // Helper methods for creating mock objects
    private MtgCardDto createMockCard(String name) {
        MtgCardDto card = new MtgCardDto();
        card.setName(name);
        card.setManaCost("{R}");
        card.setTypeLine("Instant");
        card.setOracleText("Lightning Bolt deals 3 damage to any target.");
        card.setSetName("Alpha");
        card.setSet("LEA");
        card.setCollectorNumber("161");
        card.setRarity("common");
        card.setFlavorText("The sparks flew...");

        // Set up prices
        MtgCardDto.Prices prices = new MtgCardDto.Prices();
        prices.usd = "0.50";
        prices.eur = "0.45";
        card.setPrices(prices);

        // Set up image URIs
        card.setImageUris(createMockImageUris());

        return card;
    }

    private MtgCardDto.ImageUris createMockImageUris() {
        MtgCardDto.ImageUris imageUris = new MtgCardDto.ImageUris();
        imageUris.small = "https://example.com/small.jpg";
        imageUris.normal = "https://example.com/normal.jpg";
        imageUris.large = "https://example.com/large.jpg";
        imageUris.png = "https://example.com/card.png";
        imageUris.artCrop = "https://example.com/art.jpg";
        imageUris.borderCrop = "https://example.com/border.jpg";
        return imageUris;
    }

    private SetDto createMockSet(String code, String name) {
        SetDto set = new SetDto();
        set.setCode(code);
        set.setName(name);
        set.setReleasedAt("2021-07-16");
        set.setSetType("core");
        set.setCardCount(274);
        set.setIsDigital(false);
        set.setNonFoilOnly(false);
        set.setFoilOnly(false);
        set.setBlockCode(null);
        set.setBlock(null);
        set.setIconUrl("https://example.com/icon.svg");
        return set;
    }

    private AutocompleteDto createMockAutocomplete(String query) {
        AutocompleteDto autocomplete = new AutocompleteDto();
        autocomplete.setTotalValues(3);
        autocomplete.setData(Arrays.asList(
                "Lightning Bolt",
                "Lightning Strike",
                "Lightning Helix"
        ));
        return autocomplete;
    }
}