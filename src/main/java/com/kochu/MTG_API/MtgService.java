package com.kochu.MTG_API;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.kochu.MTG_API.DTO.AutocompleteDto;
import com.kochu.MTG_API.DTO.MtgCardDto;
import com.kochu.MTG_API.DTO.SetDto;
import com.kochu.MTG_API.Exceptions.CardNotFoundException;
import com.kochu.MTG_API.Exceptions.SetNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

@Service
public class MtgService {

    private final RestTemplate restTemplate;

    private static final Logger logger = LoggerFactory.getLogger(MtgService.class);

    ObjectMapper mapper;

    MtgService(){
        this.mapper = new ObjectMapper();
        this.restTemplate = new RestTemplate();
    }

    MtgService(ObjectMapper mapper, RestTemplate restTemplate){
        this.mapper = mapper;
        this.restTemplate = restTemplate;
    }

    @Cacheable("cardsTheName")
    public MtgCardDto getCardByName(String name) {
        try {
            String url = "https://api.scryfall.com/cards/named?fuzzy=" + URLEncoder.encode(name, StandardCharsets.UTF_8);
            ResponseEntity<String> response = this.restTemplate.getForEntity(url, String.class);
            return mapper.readValue(response.getBody(), MtgCardDto.class);

        } catch (HttpClientErrorException.NotFound e) {
            logger.error("Card not found under a name: {} {}", name, e.getMessage());
            throw new CardNotFoundException("Card not found: " + name);
        } catch (Exception e) {
            logger.error("Failed to parse card data: {}", e.getMessage());
            throw new RuntimeException("Failed to parse card data");
        }
    }

    @Cacheable("cardsImagesByName")
    public MtgCardDto.ImageUris getCardImageByName(String name) {
        return getCardByName(name).getImageUris();
    }

    @Cacheable("cardsByExactName")
    public MtgCardDto getCardByExactName(String name) {
        try {
            String url = "https://api.scryfall.com/cards/named?exact=" + URLEncoder.encode(name, StandardCharsets.UTF_8);
            ResponseEntity<String> response = this.restTemplate.getForEntity(url, String.class);
            return mapper.readValue(response.getBody(), MtgCardDto.class);

        } catch (HttpClientErrorException.NotFound e) {
            logger.error("Card not found under a name: {} {}", name, e.getMessage());
            throw new CardNotFoundException("Card not found: " + name);
        } catch (Exception e) {
            logger.error("Failed to parse card data: {}", e.getMessage());
            throw new RuntimeException("Failed to parse card data", e);
        }
    }

    @Cacheable("setsByCode")
    public SetDto getSetByCode(String code) {
        try {
            String url = "https://api.scryfall.com/sets/" + URLEncoder.encode(code, StandardCharsets.UTF_8);
            ResponseEntity<String> response = this.restTemplate.getForEntity(url, String.class);

            return mapper.readValue(response.getBody(), SetDto.class);

        } catch (HttpClientErrorException.NotFound e) {
            logger.error("Set not found under a code: {} {}", code, e.getMessage());
            throw new SetNotFoundException("Set not found under a code: " + code);
        } catch (Exception e) {
            logger.error("Failed to parse set data: {}", e.getMessage());
            throw new RuntimeException("Failed to parse set data", e);
        }
    }

    @Cacheable("autocomplete")
    public AutocompleteDto autocomplete(String name) {
        try {
            String url = "https://api.scryfall.com/cards/autocomplete?q=" + URLEncoder.encode(name, StandardCharsets.UTF_8);
            ResponseEntity<String> response = this.restTemplate.getForEntity(url, String.class);
            return mapper.readValue(response.getBody(), AutocompleteDto.class);

        } catch (HttpClientErrorException.NotFound e) {
            logger.error("Autocomplete not found for: {} {}", name, e.getMessage());
            throw new SetNotFoundException("Autocomplete not found for: "+name);
        } catch (Exception e) {
            logger.error("Failed to parse autocomplete data: {}", e.getMessage());
            throw new RuntimeException("Failed to parse autocomplete data: ", e);
        }
    }

    public MtgCardDto getRandomCard() {
        try {
            String url = "https://api.scryfall.com/cards/random";
            ResponseEntity<String> response = this.restTemplate.getForEntity(url, String.class);
            return mapper.readValue(response.getBody(), MtgCardDto.class);

        } catch (HttpClientErrorException.NotFound e) {
            logger.error("Random Card not found: {}", e.getMessage());
            throw new CardNotFoundException("Random Card not found");
        } catch (Exception e) {
            logger.error("Failed to parse card data: {}", e.getMessage());
            throw new RuntimeException("Failed to parse card data", e);
        }
    }

    @Cacheable("allSets")
    public List<SetDto> getAllSets() {
        try {
            String url = "https://api.scryfall.com/sets";
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);

            JsonNode root = mapper.readTree(response.getBody());
            JsonNode dataNode = root.get("data");

            if (dataNode == null || !dataNode.isArray()) {
                throw new RuntimeException("Unexpected response format: 'data' field not found or is not an array");
            }

            List<SetDto> sets = new ArrayList<>();
            for (JsonNode cardNode : dataNode) {
                SetDto setDto = mapper.treeToValue(cardNode, SetDto.class);
                sets.add(setDto);
            }

            return sets;

        } catch (HttpClientErrorException.NotFound e) {
            throw new SetNotFoundException("No sets found");
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse set data", e);
        }
    }

    @Cacheable("cardsByCode")
    public List<MtgCardDto> getCardsBySetCode(String setcode) {
        try {
            String url = UriComponentsBuilder.fromUriString("https://api.scryfall.com/cards/search")
                    .queryParam("q", "set:"+setcode)
                    .encode()
                    .toUriString();
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);

            JsonNode root = mapper.readTree(response.getBody());
            JsonNode dataNode = root.get("data");

            if (dataNode == null || !dataNode.isArray()) {
                throw new RuntimeException("Unexpected response format: 'data' field not found or is not an array");
            }

            List<MtgCardDto> cards = new ArrayList<>();
            for (JsonNode cardNode : dataNode) {
                MtgCardDto card = mapper.treeToValue(cardNode, MtgCardDto.class);
                cards.add(card);
            }

            return cards;

        } catch (HttpClientErrorException.NotFound e) {
            throw new SetNotFoundException("Set not found under a code: " + setcode);
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse set data", e);
        }
    }





}
