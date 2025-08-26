import React, { useState, useRef, useEffect } from 'react';

const OTPInput = ({ 
  value, 
  onChange, 
  length = 6, 
  disabled = false,
  className = "",
  placeholder = "0"
}) => {
  const [otp, setOtp] = useState(value.split(''));
  const inputs = useRef([]);

  useEffect(() => {
    setOtp(value.split(''));
  }, [value]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);
    
    // Call parent onChange
    onChange(newOtp.join(''));

    // Focus next input
    if (element.value && index < length - 1) {
      inputs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    // Handle backspace
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        // If current input is empty, focus previous input
        inputs.current[index - 1].focus();
      } else {
        // Clear current input
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
        onChange(newOtp.join(''));
      }
    }
    
    // Handle arrow keys
    if (e.key === 'ArrowLeft' && index > 0) {
      inputs.current[index - 1].focus();
    }
    if (e.key === 'ArrowRight' && index < length - 1) {
      inputs.current[index + 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain');
    const pastedNumbers = pastedData.replace(/\D/g, '').slice(0, length);
    
    if (pastedNumbers) {
      const newOtp = pastedNumbers.split('');
      // Pad with empty strings if needed
      while (newOtp.length < length) {
        newOtp.push('');
      }
      setOtp(newOtp);
      onChange(pastedNumbers);
      
      // Focus the next empty input or the last input
      const nextEmptyIndex = Math.min(pastedNumbers.length, length - 1);
      inputs.current[nextEmptyIndex].focus();
    }
  };

  return (
    <div className={`flex space-x-2 justify-center ${className}`}>
      {Array.from({ length }, (_, index) => (
        <input
          key={index}
          ref={(ref) => (inputs.current[index] = ref)}
          type="text"
          inputMode="numeric"
          pattern="[0-9]"
          maxLength={1}
          value={otp[index] || ''}
          onChange={(e) => handleChange(e.target, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          disabled={disabled}
          className="w-12 h-12 text-center text-lg font-semibold border border-gray-300 rounded-md focus:ring-2 focus:ring-[#FFDE59] focus:border-[#FFDE59] outline-none disabled:bg-gray-100 disabled:text-gray-500"
          placeholder={placeholder}
        />
      ))}
    </div>
  );
};

export default OTPInput;
