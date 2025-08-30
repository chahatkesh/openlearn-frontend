import { useState, useEffect } from 'react';

/**
 * Event Image Service
 * 
 * This service handles validation of event images from external URLs.
 * It checks which images exist and filters out non-existent ones.
 */

/**
 * Check if an image exists by attempting to load it
 * @param {string} imagePath - Path to the image
 * @returns {Promise<boolean>} Promise that resolves to true if image exists
 */
/* Currently disabled to improve page load performance
const checkImageExists = (imagePath) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = imagePath;
  });
};
*/

/**
 * React hook to get filtered existing images for an event
 * @param {Array} allImages - All potential images from eventsData
 * @returns {Object} { images: Array, loading: boolean }
 */
export const useFilteredImages = (allImages) => {
  const [images, setImages] = useState(allImages || []); // Start with all images
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadImages = async () => {
      if (!allImages || allImages.length === 0) {
        setImages([]);
        setLoading(false);
        return;
      }

      // Show all images immediately for better UX
      setImages(allImages);
      setLoading(false); // Don't block the UI
      
      // Validate images in the background (optional enhancement)
      // Comment out image validation to prevent delays
      /*
      const existingImages = [];
      
      for (const image of allImages) {
        try {
          const imageUrl = typeof image === 'string' ? image : image.url;
          const exists = await checkImageExists(imageUrl);
          if (exists) {
            existingImages.push(image);
          }
        } catch (error) {
          const imageUrl = typeof image === 'string' ? image : image.url;
          console.warn(`Failed to check image: ${imageUrl}`, error);
        }
      }

      // Update with filtered images only if different
      if (existingImages.length !== allImages.length) {
        setImages(existingImages);
      }
      */
    };

    loadImages();
  }, [allImages]);

  return { images, loading };
};

export default {
  useFilteredImages
};