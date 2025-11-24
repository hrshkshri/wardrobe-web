// Email validation
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation
export const isValidPassword = (password: string): boolean => {
  return password.length >= 8;
};

// URL validation
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Phone number validation (basic)
export const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^[\d\s\-+()]{10,}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

// Required field validation
export const isNotEmpty = (value: unknown): boolean => {
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return value !== null && value !== undefined;
};

// Min length validation
export const hasMinLength = (value: string, min: number): boolean => {
  return value.length >= min;
};

// Max length validation
export const hasMaxLength = (value: string, max: number): boolean => {
  return value.length <= max;
};

// Numeric validation
export const isNumeric = (value: string): boolean => {
  return /^-?\d+(\.\d+)?$/.test(value);
};

// Integer validation
export const isInteger = (value: string): boolean => {
  return /^-?\d+$/.test(value);
};
