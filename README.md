# MTG Card Info API

A simple REST API that returns Magic: The Gathering card data and pricing info.

## Endpoint

### `GET /api/card?name=CardName`

**Query Parameter**:  
`name` — exact name of the MTG card.

**Returns**:  
Card name, oracle text, type line, and pricing.

## Example

```bash
curl "http://localhost:8080/api/card?name=Lightning%20Bolt"
