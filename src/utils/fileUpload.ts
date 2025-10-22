// Utility functions for handling file uploads and image management
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export interface UploadedFile {
  file: File;
  preview: string;
  name: string;
}

/**
 * Sanitizes a product name to be used as a filename
 * Removes special characters and converts to lowercase
 */
export const sanitizeProductName = (productName: string): string => {
  return productName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters except spaces
    .replace(/\s+/g, "_") // Replace spaces with underscores
    .replace(/_{2,}/g, "_") // Replace multiple underscores
    .replace(/^_|_$/g, ""); // Trim underscores
};

/**
 * Generates a filename for a product image
 * Format: {sanitized_product_name}_image{number}.{extension}
 */
export const generateImageFilename = (
  productName: string,
  imageIndex: number,
  originalFilename: string
): string => {
  const sanitizedName = sanitizeProductName(productName);
  const extension = originalFilename.split(".").pop()?.toLowerCase() || "jpg";
  return `${sanitizedName}_image${imageIndex + 1}_${Date.now()}.${extension}`;
};

/**
 * Validates uploaded image files
 */
export const validateImageFile = (
  file: File
): { valid: boolean; error?: string } => {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: "Only JPEG, PNG, and WebP images are allowed" };
  }
  if (file.size > maxSize) {
    return { valid: false, error: "Image size must be less than 5MB" };
  }

  return { valid: true };
};

/**
 * Creates a preview URL for an uploaded file
 */
export const createFilePreview = (file: File): string => {
  return URL.createObjectURL(file);
};

/**
 * Revokes a preview URL to free up memory
 */
export const revokeFilePreview = (previewUrl: string): void => {
  URL.revokeObjectURL(previewUrl);
};

/**
 * Handles multiple file selection and validation
 */
export const handleFileSelection = (
  files: FileList | null,
  productName: string,
  maxFiles = 4
): { files: UploadedFile[]; errors: string[] } => {
  const uploadedFiles: UploadedFile[] = [];
  const errors: string[] = [];

  if (!files || files.length === 0) {
    return { files: uploadedFiles, errors: ["No files selected"] };
  }

  if (files.length > maxFiles) {
    errors.push(`You can only upload up to ${maxFiles} images`);
    return { files: uploadedFiles, errors };
  }

  if (!productName.trim()) {
    errors.push("Please enter a product name first");
    return { files: uploadedFiles, errors };
  }

  Array.from(files).forEach((file, index) => {
    const validation = validateImageFile(file);

    if (!validation.valid) {
      errors.push(`${file.name}: ${validation.error}`);
      return;
    }

    const filename = generateImageFilename(productName, index, file.name);
    const preview = createFilePreview(file);

    uploadedFiles.push({ file, preview, name: filename });
  });

  return { files: uploadedFiles, errors };
};

/**
 * Uploads file to Firebase Storage and returns public download URL
 */
export const uploadFileToAssets = async (
  file: File,
  filename: string
): Promise<{ success: boolean; path?: string; error?: string }> => {
  try {
    const storage = getStorage(); 
    const fileRef = ref(storage, `productImages/${filename}`);

    // Upload file to Firebase Storage
    const snapshot = await uploadBytes(fileRef, file);

    // Get public download URL
    const downloadURL = await getDownloadURL(snapshot.ref);

    return { success: true, path: downloadURL };
  } catch (error) {
    console.error("Firebase upload error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Upload failed",
    };
  }
};
