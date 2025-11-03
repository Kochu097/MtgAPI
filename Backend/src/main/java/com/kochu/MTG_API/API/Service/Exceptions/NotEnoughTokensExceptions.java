package com.kochu.MTG_API.API.Service.Exceptions;

public class NotEnoughTokensExceptions extends RuntimeException {
    public NotEnoughTokensExceptions(String message) {
        super(message);
    }
}
