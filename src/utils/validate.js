const validateEmail = (email) => {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(email);
};

// This class is used to validate and format Thai ID cards
class IdCard {
  static isValidIdCard(idCard) {
    const cleanedIdCard = idCard.replace(/\D/g, '');

    if (cleanedIdCard.length !== 13) {
      return false;
    }

    let sum = 0;
    for (let i = 0; i < 12; i++) {
      sum += parseInt(cleanedIdCard[i], 10) * (13 - i);
    }

    const checkDigit = (11 - (sum % 11)) % 10;
    return checkDigit === parseInt(cleanedIdCard[12], 10);
  }

  static formattedIdCardTyping(idCard) {
    const cleanedIdCard = idCard.replace(/\D/g, '');

    let formattedIdCard = '';
    if (cleanedIdCard.length > 0) {
      formattedIdCard += cleanedIdCard.charAt(0);
    }
    if (cleanedIdCard.length >= 2) {
      formattedIdCard += '-' + cleanedIdCard.substring(1, 5);
    }
    if (cleanedIdCard.length >= 6) {
      formattedIdCard += '-' + cleanedIdCard.substring(5, 10);
    }
    if (cleanedIdCard.length >= 11) {
      formattedIdCard += '-' + cleanedIdCard.substring(10, 12);
    }
    if (cleanedIdCard.length === 13) {
      formattedIdCard += '-' + cleanedIdCard.charAt(12);
    }

    return formattedIdCard;
  }

  static formatIdCard(idCard) {
    const cleanedIdCard = idCard.replace(/\D/g, '');

    if (cleanedIdCard.length !== 13) {
      return '';
    }

    return cleanedIdCard.replace(/(\d{1})(\d{4})(\d{5})(\d{1})/, '$1-$2-$3-$4');
  }

  static removeSpecialCharacters(idCard) {
    const isValid = this.isValidIdCard(idCard);
    if (!isValid) {
      throw new Error('Invalid ID card number');
    }
    return idCard.replace(/\D/g, '');
  }
}

class Phone {
  static isValidPhone(phoneNumber) {
    const cleanedPhone = phoneNumber.replace(/\D/g, '');

    const pattern = /^0[689]\d{8}$/;
    if (!pattern.test(cleanedPhone)) {
      return false;
    }
    return cleanedPhone.length === 10;
  }

  static formattedPhoneTyping(phoneNumber) {
    const cleanedPhone = phoneNumber.replace(/\D/g, '');
    let formattedPhoneNumber = '';
    if (cleanedPhone.length > 0) {
      formattedPhoneNumber += cleanedPhone.substring(0, 3); // First 3 digits
    }
    if (cleanedPhone.length >= 4) {
      formattedPhoneNumber += '-' + cleanedPhone.substring(3, 6); // Next 3 digits
    }
    if (cleanedPhone.length >= 7) {
      formattedPhoneNumber += '-' + cleanedPhone.substring(6, 10); // Last 4 digits
    }
    return formattedPhoneNumber;
  }

  static formatPhone(phoneNumber) {
    const cleanedPhone = phoneNumber.replace(/\D/g, '');
    if (cleanedPhone.length !== 10) {
      return '';
    }
    return cleanedPhone.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
  }

  static removeSpecialCharacters(phoneNumber) {
    const isValid = this.isValidPhone(phoneNumber);
    if (!isValid) {
      throw new Error('Invalid phone number');
    }
    return phoneNumber.replace(/\D/g, '');
  }
}

const filterOutSpecialCharacters = (input) => {
  const regex = /[^\u0E00-\u0E7F\u0041-\u005A\u0061-\u007A\s]/g; // Matches any character that is not Thai, English, or whitespace
  return input.replace(regex, '');
};

const filterOnlyDigits = (input) => {
  const regex = /\D/g; // Matches any character that is not a digit
  return input.replace(regex, '');
};

const filterOnlyNumberAndOneSlash = (input) => {
  const regex = /[^0-9/]/g; // Matches any character that is not a digit or a slash
  return input.replace(regex, '');
};

const filterThaiRoad = (input) => {
  const regex = /[^a-zA-Z0-9\s/-]|(\/{2,})|(-{2,})|(\s{2,})/g; // Matches invalid characters, double slashes, double dashes, or double spaces
  return input.replace(regex, '');
};

const filterOutSpecialCharactersAndAllowNumericSlashDashSpace = (input) => {
  const cleaned = input
    .replace(/[^A-Za-z0-9\u0E00-\u0E7F\/\-. ]/g, '')
    .replace(/\s+/g, ' ')
    .trimStart();

  return cleaned;
};

export {
  validateEmail,
  IdCard,
  Phone,
  filterOutSpecialCharacters,
  filterOnlyDigits,
  filterOnlyNumberAndOneSlash,
  filterThaiRoad,
  filterOutSpecialCharactersAndAllowNumericSlashDashSpace
};
