package com.kochu.MTG_API.Exceptions;

public class SetNotFoundException extends RuntimeException {
    public SetNotFoundException(String message) {
        super(message);
    }
}
