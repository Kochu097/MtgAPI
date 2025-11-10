package com.kochu.MTG_API.API;

import com.kochu.MTG_API.API.DTO.UserDto;
import com.kochu.MTG_API.Services.Firestore.DTO.UserFirestoreDto;
import org.springframework.stereotype.Service;

@Service
public class UserDtoMapper {

    public UserDto map(UserFirestoreDto userFirestoreDto) {
        if(userFirestoreDto == null) return null;

        return new UserDto(
                userFirestoreDto.userID(),
                userFirestoreDto.tokens(),
                userFirestoreDto.createdAt(),
                userFirestoreDto.updatedAt()
        );
    }

    public UserFirestoreDto map(UserDto userDto) {
        if(userDto == null) return null;

        return new UserFirestoreDto(
                userDto.getUserID(),
                userDto.getTokens(),
                userDto.getCreatedAt(),
                userDto.getUpdatedAt()
        );
    }
}
