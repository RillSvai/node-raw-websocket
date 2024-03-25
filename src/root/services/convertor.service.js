export class ConvertorService {
  constructor() {
    throw new Error(STATIC_CLASS);
  }

  static byteToBinaryString(value) {
    if (value >= 256) {
      throw new Error('Out of range (0 <= byte <= 255');
    }
    return value.toString(2).padStart(8, '0');
  }

  static binaryToChar(value) {
    return String.fromCharCode(parseInt(value, 2));
  }
}
