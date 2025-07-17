package com.kochu.MTG_API.Exceptions;

import com.kochu.MTG_API.DTO.ApiErrorDto;
import jakarta.validation.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(CardNotFoundException.class)
    public ResponseEntity<ApiErrorDto> handleCardNotFound(CardNotFoundException ex) {
        return buildErrorResponse("Not found"+ex.getMessage(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(SetNotFoundException.class)
    public ResponseEntity<ApiErrorDto> handleSetNotFound(SetNotFoundException ex) {
        return buildErrorResponse("Not found: "+ex.getMessage(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler({
            MethodArgumentNotValidException.class,
            MissingServletRequestParameterException.class,
            ConstraintViolationException.class,
            HttpMessageNotReadableException.class
    })
    public ResponseEntity<ApiErrorDto> handleInvalidInput(Exception ex) {
        return buildErrorResponse("Invalid request parameters.", HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorDto> handleGeneralError(Exception ex) {
        return buildErrorResponse("General Error.", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    private ResponseEntity<ApiErrorDto> buildErrorResponse(String message, HttpStatus status) {
        ApiErrorDto error = new ApiErrorDto(message, status.value());
        return ResponseEntity.status(status).body(error);
    }

}
