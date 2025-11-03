package com.kochu.MTG_API.Firestore;

import com.kochu.MTG_API.API.DTO.UserDto;
import com.kochu.MTG_API.API.UserDtoMapper;
import com.kochu.MTG_API.Firestore.DTO.UserFirestoreDto;
import org.springframework.stereotype.Service;

@Service
public class UserFirestoreService {

    private static final String COLLECTION_NAME = "users";

    private final FirebaseService firebaseService;
    private final UserDtoMapper userDtoMapper;

    public UserFirestoreService(FirebaseService firebaseService, UserDtoMapper userDtoMapper) {
        this.firebaseService = firebaseService;
        this.userDtoMapper = userDtoMapper;
    }

    public void saveUser(UserDto userDto) throws FirebaseConnectionException {
        var userFirestoreDto = userDtoMapper.map(userDto);
        firebaseService.writeDocument(COLLECTION_NAME, userFirestoreDto.userID(), userFirestoreDto);
    }

    public UserDto getUser(String userID) throws FirebaseConnectionException {
        var document = firebaseService.getDocument(COLLECTION_NAME, userID);
        var userFirestoreDto = document.toObject(UserFirestoreDto.class);
        return userDtoMapper.map(userFirestoreDto);
    }
}
