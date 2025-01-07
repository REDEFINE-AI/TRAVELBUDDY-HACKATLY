export const validateField = (name: string, value: string) => {
  switch (name) {
    case 'name':
      return value.length >= 2 ? '' : 'Name must be at least 2 characters';
    case 'email':
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Invalid email address';
    case 'phone':
      return /^\+?[1-9]\d{9,11}$/.test(value) ? '' : 'Invalid phone number';
    case 'password':
      return value.length >= 8 ? '' : 'Password must be at least 8 characters';
    case 'otp':
      return /^\d{6}$/.test(value) ? '' : 'OTP must be 6 digits';
    default:
      return '';
  }
};