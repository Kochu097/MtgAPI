package com.kochu.MTG_API.Services.Firestore;

import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.DocumentReference;
import com.google.cloud.firestore.DocumentSnapshot;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.WriteResult;
import org.springframework.stereotype.Service;

import java.util.concurrent.ExecutionException;
import java.util.concurrent.Future;

@Service
public class FirebaseService {

    private final Firestore firestore;

    public FirebaseService(Firestore firestore) {
        this.firestore = firestore;
    }

    public DocumentSnapshot getDocument(String collectionName, String id) throws FirebaseConnectionException {
        DocumentReference docRef = firestore.collection(collectionName).document(id);
        Future<DocumentSnapshot> future = docRef.get();
        try {
            return future.get();
        } catch (InterruptedException | ExecutionException e){
            throw new FirebaseConnectionException("Error fetching document: " + e.getMessage());
        }
    }

    public void writeDocument(String collectionName, String id, Object data) throws FirebaseConnectionException {
        DocumentReference docRef = firestore.collection(collectionName).document(id);

        ApiFuture<WriteResult> result = docRef.set(data);
        try {
            result.get();
        } catch (InterruptedException | ExecutionException e) {
            throw new FirebaseConnectionException("Error writing to Firestore: " + e.getMessage());
        }
    }
}
