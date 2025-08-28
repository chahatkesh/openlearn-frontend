// Migration Service for V2 Migration
// Handles user migration from V1 to V2 with additional fields

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_BASE_URL = `${BASE_URL}/api`;

class MigrationService {
  /**
   * Check if user requires migration to V2
   * @returns {Promise<Object>} Migration status
   */
  static async checkMigrationStatus() {
    try {
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        throw new Error('No access token found');
      }

      const response = await fetch(`${API_BASE_URL}/migration/status`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to check migration status');
      }

      // Handle different response structures
      if (result.data) {
        // Backend returns nested data structure
        const data = result.data;
        return {
          requiresMigration: data.needsMigration || data.requiresMigration || false,
          needsMigration: data.needsMigration || false,
          isV2User: data.isV2User || (data.migratedToV2 === true) || false,
          migratedToV2: data.migratedToV2,
          isOldUser: data.isOldUser || false,
          hasOLID: data.hasOLID || false,
          emailVerified: data.emailVerified || false,
          userSince: data.userSince
        };
      } else if (result.requiresMigration !== undefined || result.needsMigration !== undefined) {
        return result;
      } else {
        // Default fallback for V2 users
        return { requiresMigration: false, isV2User: true };
      }
    } catch (error) {
      console.error('Error checking migration status:', error);
      throw error;
    }
  }

  /**
   * Migrate user to V2 with additional details
   * @param {Object} migrationData - Additional user details for V2
   * @returns {Promise<Object>} Migration result
   */
  static async migrateToV2(migrationData) {
    try {
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        throw new Error('No access token found');
      }

      console.log('📤 Sending migration data to API:', migrationData);

      const response = await fetch(`${API_BASE_URL}/migration/migrate-to-v2`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(migrationData)
      });

      const result = await response.json();
      console.log('📥 Migration API response:', result);

      if (!response.ok) {
        console.error('❌ Migration API error:', result);
        throw new Error(result.error || 'Migration failed');
      }
      return result.data;
    } catch (error) {
      console.error('Error during migration:', error);
      throw error;
    }
  }

  /**
   * Validate migration data before submission
   * @param {Object} data - Migration data to validate
   * @returns {Object} Validation result
   */
  static validateMigrationData(data) {
    const errors = {};
    const requiredFields = [
      'institute',
      'department', 
      'graduationYear',
      'phoneNumber',
      'studentId'
    ];

    // Check required fields
    requiredFields.forEach(field => {
      if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
        const fieldName = field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
        errors[field] = `${fieldName} is required`;
      }
    });

    // Validate graduation year
    if (data.graduationYear) {
      const currentYear = new Date().getFullYear();
      const year = parseInt(data.graduationYear);
      if (isNaN(year) || year < currentYear || year > currentYear + 10) {
        errors.graduationYear = 'Please enter a valid graduation year';
      }
    }

    // Validate phone number
    if (data.phoneNumber) {
      const phoneRegex = /^[+]?[\d\s\-()]{10,15}$/;
      if (!phoneRegex.test(data.phoneNumber)) {
        errors.phoneNumber = 'Please enter a valid phone number';
      }
    }

    // Validate URLs if provided
    if (data.portfolioUrl && data.portfolioUrl.trim()) {
      try {
        new URL(data.portfolioUrl);
      } catch {
        errors.portfolioUrl = 'Please enter a valid portfolio URL';
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  /**
   * Get departments list for dropdown
   * @returns {Array} List of departments
   */
  static getDepartments() {
    return [
      'Information Technology',
      'Instrumentation and Control Engineering',
      'Computer Science and Engineering',
      'Electronics and Communication Engineering',
      'Data Science Engineering',
      'Electrical Engineering',
      'Mechanical Engineering',
      'Civil Engineering',
      'Chemical Engineering',
      'Biotechnology',
      'Mathematics and Computing',
      'Data Science and Engineering',
      'Artificial Intelligence and Machine Learning',
      'Cyber Security',
      'Industrial and Production Engineering',
      'Textile Technology',
      'Other'
    ];
  }
}

export default MigrationService;
