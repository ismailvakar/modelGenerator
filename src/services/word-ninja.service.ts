/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable eqeqeq */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {/* inject, */ BindingScope, injectable} from '@loopback/core';
import * as fs from 'fs';
import * as path from 'path';
import {CaseQuery} from '../models/case-query.model';

@injectable({scope: BindingScope.TRANSIENT})
export class WordNinjaService {
  constructor(/* Add @inject to inject parameters */) {}

  /*
   * Add service methods here
   */

  splitRegex = new RegExp("[^a-zA-Z0-9']+", 'g');
  FILE_WORDS = path.join('..\\helper\\src\\words\\words-tr-gl.txt');
  maxWordLen = 0;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  wordCost = {} as any;
  maxCost = 9e999;

  /**
   * Load Dictionary
   * @return {Object} Objects of dictionary
   */
  async loadDictionary(sourceLanguage: string) {
    if (sourceLanguage === 'tr') {
      this.FILE_WORDS = path.join('..\\helper\\src\\words\\words-tr-gl.txt');
    } else {
      this.FILE_WORDS = path.join('..\\helper\\src\\words\\words-en.txt');
    }
    return new Promise(resolve => {
      fs.readFile(this.FILE_WORDS, 'utf8', (err: any, data: string) => {
        if (err) throw err;

        const words = data.split('\n');

        words.forEach((word: any, index: number) => {
          this.wordCost[word] = Math.log((index + 1) * Math.log(words.length));
          if (word.length > this.maxWordLen) this.maxWordLen = word.length;
          if (this.wordCost[word] < this.maxCost)
            this.maxCost = this.wordCost[word];
        });
        resolve(this.wordCost);
      });
    });
  }

  /**
   * @param {string} string - The string for split
   * @param {object} options - The Options
   * @param {CaseQuery} options.camelCaseSplitter - Split by Camel Case, Default false (optional)
   * @returns {Array|string} result - Split String
   */
  async splitSentence(string: string, caseQuery: CaseQuery) {
    const list: any[] = [];
    const camelCaseSplitter = caseQuery.camelCaseSplitter || false;
    const capitalizeFirstLetter = caseQuery.capitalizeFirstLetter || false;
    const joinWords = caseQuery.joinWords || false;
    if (camelCaseSplitter) string = this.camelCaseSplitter(string);
    string.split(this.splitRegex).forEach(async (sub: any) => {
      (await this.splitWords(sub)).forEach((word: any) => {
        word = capitalizeFirstLetter ? this.capitalizeFirstLetter(word) : word;
        list.push(word);
      });
    });
    if (joinWords) return list.join(' ');
    else return list;
  }

  /**
   * Add words to dictionary
   * @param {Array|string} words Word(s) to add dictionary
   * @return {void}
   */
  async addWords(words: string) {
    if (Array.isArray(words)) {
      for (const value of words) this.addWords(value);
    } else {
      const word = words.toLocaleLowerCase();
      this.wordCost[word] = this.maxCost;
      if (word.length > this.maxWordLen) this.maxWordLen = word.length;
    }
  }

  /**
   * Split Words
   * @private
   * @param {string} s Input String
   * @return {Array} Splited Words
   */
  async splitWords(s: string | unknown[]) {
    const cost = [0];

    const bestMatch = (i: number) => {
      const candidates = cost
        .slice(Math.max(0, i - this.maxWordLen), i)
        .reverse();
      let minPair = [Number.MAX_SAFE_INTEGER, 0];
      candidates.forEach((c, k) => {
        let ccost;
        if (
          this.wordCost[(s as string).substring(i - k - 1, i).toLowerCase()]
        ) {
          ccost =
            c +
            this.wordCost[(s as string).substring(i - k - 1, i).toLowerCase()];
        } else {
          ccost = Number.MAX_SAFE_INTEGER;
        }
        if (ccost < minPair[0]) {
          minPair = [ccost, k + 1];
        }
      });
      return minPair;
    };

    for (let i = 1; i < s.length + 1; i++) {
      cost.push(bestMatch(i)[0]);
    }

    const out: any[] = [];
    let i = s.length;
    while (i > 0) {
      const c = bestMatch(i)[0];
      const k = bestMatch(i)[1];
      //if (c == cost[i])
      //    console.log("Alert: " + c);
      if (k === 0) {
        console.log('could not find the', s);
        out.push(s);
        return out.reverse();
      }

      let newToken = true;
      if (s.slice(i - k, i) != "'") {
        if (out.length > 0) {
          if (
            out[-1] == "'s" ||
            (Number.isInteger(s[i - 1]) && Number.isInteger(out[-1][0]))
          ) {
            out[-1] = s.slice(i - k, i) + out[-1];
            newToken = false;
          }
        }
      }

      if (newToken) {
        out.push(s.slice(i - k, i));
      }

      i -= k;
    }

    return out.reverse();
  }

  /**
   * Camel Case Splitter
   * Based on 'split-camelcase-to-words' package, https://www.npmjs.com/package/split-camelcase-to-words
   * @private
   * @param {string} inputString
   * @return {string} String
   */
  camelCaseSplitter(inputString: string) {
    const notNullString = inputString || '';
    const trimmedString = notNullString.trim();
    const arrayOfStrings = trimmedString.split(' ');

    const splitStringsArray: any[] = [];
    arrayOfStrings.forEach((tempString: string) => {
      if (tempString != '') {
        const splitWords = tempString.split(/(?=[A-Z])/).join(' ');
        splitStringsArray.push(splitWords);
      }
    });

    return splitStringsArray.join(' ');
  }

  /**
   * Capitalize First Letter
   * @private
   * @param {string} string - String to Capitalize First Letter
   * @return {string} result
   */
  capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
}
