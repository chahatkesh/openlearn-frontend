// Email Verification Service for V2 Migration
// Handles email verification flow with OTP

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_BASE_URL = `${BASE_URL}/api/auth/email-verification`;

class EmailVerificationService {
  /**
   * Check email verification status
   * @returns {Promise<Object>} Verification status
   */
  static async checkVerificationStatus() {
    try {
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        throw new Error('No access token found');
      }

      const response = await fetch(`${API_BASE_URL}/verification-status`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to check verification status');
      }
      // Handle different response structures
      // Based on backend test, the response is direct (no .data wrapper)
      if (result.emailVerified !== undefined) {
        return result;
      } else if (result.data && result.data.emailVerified !== undefined) {
        return result.data;
      } else {
        // Default fallback
        return { emailVerified: false };
      }
    } catch (error) {
      console.error('Error checking verification status:', error);
      throw error;
    }
  }

  /**
   * Send OTP to user's email
   * @returns {Promise<Object>} Send OTP result
   */
  static async sendVerificationOTP() {
    try {
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        throw new Error('No access token found');
      }

      const response = await fetch(`${API_BASE_URL}/send-verification-otp`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send OTP');
      }

      // Based on backend test, the response is direct (no .data wrapper)
      return result;
    } catch (error) {
      console.error('Error sending OTP:', error);
      throw error;
    }
  }

  /**
   * Verify OTP entered by user
   * @param {string} otp - OTP entered by user
   * @returns {Promise<Object>} Verification result
   */
  static async verifyOTP(otp) {
    try {
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        throw new Error('No access token found');
      }

      const response = await fetch(`${API_BASE_URL}/verify-email-otp`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ otp })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'OTP verification failed');
      }

      // Based on backend test, the response is direct (no .data wrapper)
      return result;
    } catch (error) {
      console.error('Error verifying OTP:', error);
      throw error;
    }
  }

  /**
   * Validate OTP format
   * @param {string} otp - OTP to validate
   * @returns {Object} Validation result
   */
  static validateOTP(otp) {
    const errors = {};

    if (!otp || otp.trim() === '') {
      errors.otp = 'OTP is required';
    } else if (!/^\d{6}$/.test(otp.trim())) {
      errors.otp = 'OTP must be 6 digits';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  /**
   * Format time remaining for OTP expiry
   * @param {number} seconds - Seconds remaining
   * @returns {string} Formatted time string
   */
  static formatTimeRemaining(seconds) {
    if (seconds <= 0) return '00:00';
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  /**
   * Start countdown timer for OTP expiry
   * @param {number} duration - Duration in seconds
   * @param {Function} onTick - Callback for each second
   * @param {Function} onComplete - Callback when timer completes
   * @returns {Function} Function to clear the timer
   */
  static startTimer(duration, onTick, onComplete) {
    let timeRemaining = duration;
    
    const interval = setInterval(() => {
      timeRemaining -= 1;
      onTick(timeRemaining);
      
      if (timeRemaining <= 0) {
        clearInterval(interval);
        onComplete();
      }
    }, 1000);

    // Initial call
    onTick(timeRemaining);

    // Return cleanup function
    return () => clearInterval(interval);
  }
}

export default EmailVerificationService;
