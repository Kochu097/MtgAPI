package com.kochu.MTG_API.Services;

import com.kochu.MTG_API.API.DTO.UserDto;
import com.kochu.MTG_API.API.UserDtoMapper;
import com.kochu.MTG_API.Firestore.DTO.UserFirestoreDto;
import com.kochu.MTG_API.Firestore.FirebaseConnectionException;
import com.kochu.MTG_API.Firestore.UserFirestoreService;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class UserService {

    private final UserFirestoreService userFirestoreService;
    private final static Integer DEFAULT_AMOUNT_OF_TOKENS = 5;

    public UserService(UserFirestoreService userFirestoreService) {
        this.userFirestoreService = userFirestoreService;
    }

    public UserDto getUser(String userID) throws FirebaseConnectionException {
        return userFirestoreService.getUser(userID);
    }

    public UserDto createNewUser(String userId) throws FirebaseConnectionException {
        UserDto userDto = new UserDto(userId, DEFAULT_AMOUNT_OF_TOKENS, Instant.now(), Instant.now());
        userFirestoreService.saveUser(userDto);
        return userDto;
    }
}
