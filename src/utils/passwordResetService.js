const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_BASE_URL = `${BASE_URL}/api/auth/password-reset`;

class PasswordResetService {
  /**
   * Send OTP to email for password reset
   * @param {string} email - User's email address
   * @returns {Promise<Object>} API response
   */
  static async sendOTP(email) {
    try {
      const response = await fetch(`${API_BASE_URL}/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error sending OTP:', error);
      return {
        success: false,
        error: 'Network error. Please try again.'
      };
    }
  }

  /**
   * Verify OTP for password reset
   * @param {string} email - User's email address
   * @param {string} otp - 6-digit OTP
   * @returns {Promise<Object>} API response
   */
  static async verifyOTP(email, otp) {
    try {
      const response = await fetch(`${API_BASE_URL}/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, otp })
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error verifying OTP:', error);
      return {
        success: false,
        error: 'Network error. Please try again.'
      };
    }
  }

  /**
   * Reset password with verified OTP
   * @param {string} email - User's email address
   * @param {string} otp - Verified OTP
   * @param {string} newPassword - New password
   * @returns {Promise<Object>} API response
   */
  static async resetPassword(email, otp, newPassword) {
    try {
      const response = await fetch(`${API_BASE_URL}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, otp, newPassword })
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error resetting password:', error);
      return {
        success: false,
        error: 'Network error. Please try again.'
      };
    }
  }

  /**
   * Check password reset status
   * @param {string} email - User's email address
   * @returns {Promise<Object>} API response
   */
  static async checkStatus(email) {
    try {
      const response = await fetch(`${API_BASE_URL}/status?email=${encodeURIComponent(email)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error checking password reset status:', error);
      return {
        success: false,
        error: 'Network error. Please try again.'
      };
    }
  }

  /**
   * Validate password strength
   * @param {string} password - Password to validate
   * @returns {Object} Validation result
   */
  static validatePassword(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const isValid = password.length >= minLength && 
                   hasUpperCase && 
                   hasLowerCase && 
                   hasNumbers && 
                   hasSpecialChar;

    return {
      isValid,
      errors: {
        minLength: password.length < minLength,
        hasUpperCase: !hasUpperCase,
        hasLowerCase: !hasLowerCase,
        hasNumbers: !hasNumbers,
        hasSpecialChar: !hasSpecialChar
      }
    };
  }

  /**
   * Calculate time remaining for OTP expiry
   * @param {string} expiresAt - ISO timestamp
   * @returns {Object} Time remaining information
   */
  static getTimeRemaining(expiresAt) {
    if (!expiresAt) return { expired: true, minutes: 0, seconds: 0 };

    const now = new Date().getTime();
    const expiry = new Date(expiresAt).getTime();
    const difference = expiry - now;

    if (difference <= 0) {
      return { expired: true, minutes: 0, seconds: 0 };
    }

    const minutes = Math.floor(difference / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return { expired: false, minutes, seconds };
  }
}

export default PasswordResetService;
