'use strict';

const uniq = require('lodash.uniq');

module.exports = class Cipher {
  constructor(alphabet) {
    this.alphabet = this.validateAlphabet(alphabet);
    this.alphabetLength = this.alphabet.length;
  }

  // Any duplicates create exponential collisions. Remove them so someone doesn't create a stupid alphabet
  validateAlphabet(alphabet) {
    return uniq(alphabet.split('')).join('');
  }

  fromNumber(number) {
    if (isNaN(Number(number)) || number === null ||
      number === Number.POSITIVE_INFINITY)
      throw "The input is not valid";
    if (number < 0)
      throw "Can't represent negative numbers now";

    var rixit; // like 'digit', only in some non-decimal radix
    var residual = Math.floor(number);
    var result = '';
    while (true) {
      rixit = residual % this.alphabetLength
      result = this.alphabet.charAt(rixit) + result;
      residual = Math.floor(residual / this.alphabetLength);

      if (residual == 0)
        break;
      }
    return result;
  }

  toNumber(rixits) {
    var result = 0;
    rixits = rixits.split('');
    for (var e = 0; e < rixits.length; e++) {
      result = (result * this.alphabetLength) + this.alphabet.indexOf(rixits[e]);
    }
    return result;
  }

  reverse(str) {
    return str.split('').reverse().join('');
  }

  encode(id) {
    id = this.fromNumber(id);
    // console.log('fromNumber', id);
    id = this.reverse(id);
    // console.log('reverse', id);
    id = this.shift(id, this.getEncodeIndex);
    // console.log('shift', id);
    return id;
  }

  decode(str) {
    str = this.shift(str, this.getDecodeIndex)
    // console.log('shift', str);
    str = this.reverse(str);
    // console.log('reverse', str);
    str = this.toNumber(str);
    // console.log('toNumber', str);
    return str;
  }

  determineShift(char) {
    return alphabet.indexOf(char);
  }

  getEncodeIndex(shift, char) {
    let idx = this.alphabet.indexOf(char) + shift;
    if (idx >= this.alphabetLength) idx -= this.alphabetLength;
    return idx;
  }

  getDecodeIndex(shift, char) {
    let idx = this.alphabet.indexOf(char) - shift;
    if (idx < 0) idx += this.alphabetLength;
    return idx;
  }

  shift(input, getIndex) {
    if (typeof input === 'string') input = input.split('');
    let shift = this.alphabet.indexOf(input[0]);
    let fn = getIndex.bind(this, shift);
    // console.log('shift', input, shift);
    return input
      .map((char, idx) => {
        if (!idx) return char;
        // console.log(char, fn(char));
        return this.alphabet.charAt(
          fn(char)
        );
      })
      .join('')
  }
}

