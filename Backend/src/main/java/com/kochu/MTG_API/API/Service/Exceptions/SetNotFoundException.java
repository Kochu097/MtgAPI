package com.kochu.MTG_API.API.Service.Exceptions;

public class SetNotFoundException extends RuntimeException {
    public SetNotFoundException(String message) {
        super(message);
    }
}
