export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    return { valid: false, error: 'Email is required' };
  }
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Please enter a valid email address' };
  }
  return { valid: true };
};

export const validatePhone = (phone) => {
  const phoneRegex = /^[6-9]\d{9}$/;
  if (!phone) {
    return { valid: false, error: 'Phone number is required' };
  }
  const cleanPhone = phone.replace(/\D/g, '');
  if (!phoneRegex.test(cleanPhone)) {
    return { valid: false, error: 'Please enter a valid 10-digit Indian mobile number' };
  }
  return { valid: true };
};

export const validatePincode = (pincode, state = '') => {
  const pincodeRegex = /^\d{6}$/;
  if (!pincode) {
    return { valid: false, error: 'Pincode is required' };
  }
  if (!pincodeRegex.test(pincode)) {
    return { valid: false, error: 'Pincode must be 6 digits' };
  }

  const firstDigit = parseInt(pincode[0]);
  const stateFirstDigits = {
    'Tamil Nadu': [6],
    'Kerala': [6, 7],
    'Karnataka': [5, 6],
    'Andhra Pradesh': [5],
    'Telangana': [5],
    'Maharashtra': [4],
    'Gujarat': [3, 4],
    'Rajasthan': [3],
    'Delhi': [1],
    'Uttar Pradesh': [2, 3],
    'Madhya Pradesh': [4, 5],
    'West Bengal': [7],
    'Punjab': [1, 2],
    'Haryana': [1, 2],
    'Bihar': [8],
    'Odisha': [7],
    'Assam': [7, 8],
    'Jharkhand': [8],
    'Chhattisgarh': [4, 5],
    'Uttarakhand': [2]
  };

  if (state && stateFirstDigits[state]) {
    if (!stateFirstDigits[state].includes(firstDigit)) {
      return { valid: false, error: `Pincode doesn't match ${state}` };
    }
  }

  return { valid: true };
};

export const validateAddress = (address) => {
  if (!address || address.trim().length < 10) {
    return { valid: false, error: 'Address must be at least 10 characters' };
  }
  if (address.length > 200) {
    return { valid: false, error: 'Address is too long (max 200 characters)' };
  }
  return { valid: true };
};

export const validateState = (state) => {
  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
    'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
  ];

  if (!state) {
    return { valid: false, error: 'State is required' };
  }
  if (!indianStates.includes(state)) {
    return { valid: false, error: 'Please select a valid Indian state' };
  }
  return { valid: true };
};

export const validateName = (name) => {
  if (!name || name.trim().length < 2) {
    return { valid: false, error: 'Name must be at least 2 characters' };
  }
  if (name.length > 50) {
    return { valid: false, error: 'Name is too long (max 50 characters)' };
  }
  const nameRegex = /^[a-zA-Z\s.]+$/;
  if (!nameRegex.test(name)) {
    return { valid: false, error: 'Name can only contain letters and spaces' };
  }
  return { valid: true };
};

export const validateCity = (city) => {
  if (!city || city.trim().length < 2) {
    return { valid: false, error: 'City is required' };
  }
  if (city.length > 50) {
    return { valid: false, error: 'City name is too long' };
  }
  return { valid: true };
};

export const indianStates = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
];
