class Add {
  constructor(input1, input2) {
    this.input1 = input1;
    this.input2 = input2;
  }
  add() {
    return this.input1 + this.input2;
  }
}
class Subtract {
  constructor(input1, input2) {
    this.input1 = input1;
    this.input2 = input2;
  }
  subtract() {
    return this.input1 - this.input2;
  }
}
class Multiply {
  constructor(input1, input2) {
    this.input1 = input1;
    this.input2 = input2;
  }
  multiply() {
    return this.input1 * this.input2;
  }
}
class Divide {
  constructor(input1, input2) {
    this.input1 = input1;
    this.input2 = input2;
  }
  divide() {
    return this.input1 / this.input2;
  }
}

class Converter {
  constructor(number) {
    this.number = number;
  }

  convertToRomanNumbers() {
    if (isNaN(this.number)) return NaN;
    if (this.number === 0 || this.number < 0) {
      return 'There are no negative Roman Numerals, nor is there a Roman Numeral for zero.';
    }
    if (this.number > 3000000) {
      return 'This number will be unreadable.';
    }
    let digits = String(+this.number).split(''),
      key = [
        '',
        'C',
        'CC',
        'CCC',
        'CD',
        'D',
        'DC',
        'DCC',
        'DCCC',
        'CM',
        '',
        'X',
        'XX',
        'XXX',
        'XL',
        'L',
        'LX',
        'LXX',
        'LXXX',
        'XC',
        '',
        'I',
        'II',
        'III',
        'IV',
        'V',
        'VI',
        'VII',
        'VIII',
        'IX',
      ],
      roman = '',
      i = 3;
    while (i--) roman = (key[+digits.pop() + i * 10] || '') + roman;
    return Array(+digits.join('') + 1).join('M') + roman;
  }

  convertToArabicNumbers() {
    if (isNaN(this.number)) return NaN;
    let result = this.number.toString();
    if (this.number < 0) {
      result = result.substring(1) + '-';
    }
    let key = '٠١٢٣٤٥٦٧٨٩';
    return result.replace(/\d/g, (symbol) => key[symbol]);
  }

  convertToMorseCode() {
    if (isNaN(this.number)) return NaN;
    let result = this.number.toString();
    if (this.number < 0) {
      result = '_...._' + result.substring(1);
    }
    let key = [
      '-----',
      '.----',
      '..---',
      '...--',
      '....-',
      '.....',
      '-....',
      '--...',
      '---..',
      '----.',
    ];
    return result.replace(/\d/g, (symbol) => key[symbol]);
  }
}

let operation = new Subtract(26, 134);

let result = operation.subtract();

let converter = new Converter(result);
console.log(converter.convertToRomanNumbers());
console.log(converter.convertToArabicNumbers());
console.log(converter.convertToMorseCode());
