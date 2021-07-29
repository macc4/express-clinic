class StringFormatter {
  constructor(string) {
    this.string = string;
  }

  removeChars() {
    return this.string
      .split('')
      .filter(function (x, n, s) {
        return s.indexOf(x) == n;
      })
      .join('');
  }
}

class DeleteDigitsFromString extends StringFormatter {
  constructor(string) {
    super(string);
  }

  removeChars() {
    return this.string.replace(/[0-9]/g, '');
  }
}

class DeleteDatesFromString extends StringFormatter {
  constructor(string) {
    super(string);
  }

  removeChars() {
    return this.string.replace(
      /(0?[1-9]|[12][0-9]|3[01])[\/\-\.](0?[1-9]|1[012])[\/\-\.]\d{4}/g,
      ''
    );
  }
}

class ApplyRegexSearchToString extends StringFormatter {
  constructor(string, { regex, replacement }) {
    super(string);
    this.regex = regex;
    this.replacement = replacement;
  }

  removeChars() {
    return this.string.replace(this.regex, this.replacement);
  }
}

let input = 'Hello, world!1123 30-10-1975 20.02.2205';

let formatter = new StringFormatter(input);
let digitsFormatter = new DeleteDigitsFromString(input);
let datesFormatter = new DeleteDatesFromString(input);
let regExpFormatter = new ApplyRegexSearchToString(input, /[0-9]/g, 'bobbody');

console.log(formatter.removeChars());
console.log(digitsFormatter.removeChars());
console.log(datesFormatter.removeChars());
console.log(regExpFormatter.removeChars());
