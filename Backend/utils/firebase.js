import { initializeApp } from "firebase/app";
import { generateApiKey } from "generate-api-key";
import {
  getStorage,
  ref,
  uploadBytes,
  getMetadata,
  updateMetadata,
  getDownloadURL,
} from "firebase/storage";
import { promises as fsPromises } from "fs";

const firebaseConfig = {
  apiKey: "AIzaSyClOj_dv1Su1CflWArQZp7ngm3lrGVXmGA",
  authDomain: "myclone-3cf2a.firebaseapp.com",
  projectId: "myclone-3cf2a",
  storageBucket: "myclone-3cf2a.appspot.com",
  messagingSenderId: "887923668337",
  appId: "1:887923668337:web:dc4aceacf6d78af47af2d0",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export const uploadImgOnFireBase = async (path) => {
  try {
    // Create a reference to the storage bucket
    const storageRef = ref(storage, "images/" + path);

    // Read the image file from the specified path
    const imageFile = await fsPromises.readFile(path);

    // Upload the image to Firebase Storage
    await uploadBytes(storageRef, imageFile);

    // Get the existing metadata (if any)
    const existingMetadata = await getMetadata(storageRef);

    // Set or update the content type metadata to image/gif (adjust as needed)
    const updatedMetadata = {
      contentType: "image/video/gif", // Change this to the appropriate content type
      ...existingMetadata, // Preserve other existing metadata
    };

    await updateMetadata(storageRef, updatedMetadata);

    // Get the public URL of the uploaded image
    const downloadURL = await getDownloadURL(storageRef);

    // Delete the local image file from the public folder
    await fsPromises.unlink(path);

    return downloadURL;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};
export const uploadVideoOnFireBase = async (path) => {
  try {
    // Create a reference to the storage bucket
    const storageRef = ref(storage, "videos/" + path); // Use an appropriate folder for videos

    // Read the video file from the specified path
    const videoFile = await fsPromises.readFile(path);

    // Upload the video to Firebase Storage
    await uploadBytes(storageRef, videoFile, {
      contentType: "video/mp4", // Set the correct content type
    });

    // Get the existing metadata (if any)
    const existingMetadata = await getMetadata(storageRef);

    // Update the content type metadata
    const updatedMetadata = {
      contentType: "video/mp4", // Change this to the appropriate content type
      ...existingMetadata, // Preserve other existing metadata
    };

    await updateMetadata(storageRef, updatedMetadata);

    // Get the public URL of the uploaded video
    const downloadURL = await getDownloadURL(storageRef);

    // Delete the local video file from the public folder
    await fsPromises.unlink(path);

    return downloadURL;
  } catch (error) {
    console.error("Error uploading video:", error);
    throw error;
  }
};
