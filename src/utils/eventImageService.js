import { useState, useEffect } from 'react';

/**
 * Event Image Service
 * 
 * This service handles dynamic loading of event images from the public/events/[event_id] directory.
 * It automatically detects which images exist and filters out non-existent ones.
 */

/**
 * Check if an image exists by attempting to load it
 * @param {string} imagePath - Path to the image
 * @returns {Promise<boolean>} Promise that resolves to true if image exists
 */
const checkImageExists = (imagePath) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = imagePath;
  });
};

/**
 * Generate sequential image objects for an event (static version for eventsData.js)
 * @param {string} eventId - The event ID
 * @param {string} extension - Image extension (default: 'jpg')
 * @param {number} maxImages - Maximum number of images to check (default: 10)
 * @returns {Array} Array of image objects
 */
export const generateSequentialImages = (eventId, extension = 'jpg', maxImages = 10) => {
  const images = [];
  
  for (let i = 1; i <= maxImages; i++) {
    images.push({
      id: `${eventId}-${i}`,
      url: `/events/${eventId}/image-${i}.${extension}`,
      alt: `${eventId} image ${i}`
    });
  }
  
  return images;
};

/**
 * Get the thumbnail image path for an event
 * @param {string|object} event - The event ID string or event object with id property
 * @param {string} extension - Image extension (default: 'png')
 * @returns {string} Thumbnail image path
 */
export const getEventThumbnail = (event, extension = 'png') => {
  const eventId = typeof event === 'string' ? event : event.id;
  return `/events/thumbnail/${eventId}.${extension}`;
};

/**
 * React hook to get filtered existing images for an event
 * @param {Array} allImages - All potential images from eventsData
 * @returns {Object} { images: Array, loading: boolean }
 */
export const useFilteredImages = (allImages) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadImages = async () => {
      if (!allImages || allImages.length === 0) {
        setImages([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      const existingImages = [];

      for (const image of allImages) {
        try {
          const exists = await checkImageExists(image.url);
          if (exists) {
            existingImages.push(image);
          }
        } catch (error) {
          console.warn(`Failed to check image: ${image.url}`, error);
        }
      }

      setImages(existingImages);
      setLoading(false);
    };

    loadImages();
  }, [allImages]);

  return { images, loading };
};

export default {
  generateSequentialImages,
  getEventThumbnail,
  useFilteredImages
};