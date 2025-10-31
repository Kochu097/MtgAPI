package com.kochu.MTG_API.Services.Exceptions;

public class SetNotFoundException extends RuntimeException {
    public SetNotFoundException(String message) {
        super(message);
    }
}
