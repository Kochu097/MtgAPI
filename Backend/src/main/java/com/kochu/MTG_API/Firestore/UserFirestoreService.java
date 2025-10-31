package com.kochu.MTG_API.Firestore;

import com.kochu.MTG_API.Firestore.DTO.UserFirestoreDto;
import org.springframework.stereotype.Service;

@Service
public class UserFirestoreService {

    private static final String COLLECTION_NAME = "users";

    private final FirebaseService firebaseService;

    public UserFirestoreService(FirebaseService firebaseService) {
        this.firebaseService = firebaseService;
    }

    public void saveUser(UserFirestoreDto userFirestoreDto) throws FirebaseConnectionException {
        firebaseService.writeDocument(COLLECTION_NAME, userFirestoreDto.userID(), userFirestoreDto);
    }

    public UserFirestoreDto getUser(String userID) throws FirebaseConnectionException {
        var document = firebaseService.getDocument(COLLECTION_NAME, userID);
        return document.toObject(UserFirestoreDto.class);
    }
}
