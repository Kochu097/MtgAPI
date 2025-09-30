
package com.kochu.MTG_API.Configuration;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.io.FileInputStream;
import java.io.IOException;

@Configuration
public class FirebaseConfig {
    private static final Logger logger = LoggerFactory.getLogger(FirebaseConfig.class);

    @Value("${firebase.service-account-file:}")
    private String serviceAccountFile;

    @PostConstruct
    public void initialize() {
        logger.info("Firebase service account file path: {}", serviceAccountFile);

        if (serviceAccountFile == null || serviceAccountFile.isEmpty()) {
            logger.error("Firebase service account file path is not set!");
            return;
        }

        try {
            // Check if Firebase is already initialized to prevent multiple initializations
            if (FirebaseApp.getApps().isEmpty()) {
                logger.info("Initializing Firebase with service account from: {}", serviceAccountFile);
                FileInputStream serviceAccount = new FileInputStream(serviceAccountFile);

                FirebaseOptions options = FirebaseOptions.builder()
                        .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                        .build();

                FirebaseApp.initializeApp(options);
                logger.info("Firebase initialization completed successfully");
            }
        } catch (IOException e) {
            logger.error("Error initializing Firebase: ", e);
            throw new RuntimeException("Error initializing Firebase", e);
        }
    }
}