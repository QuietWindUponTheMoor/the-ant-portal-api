"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceBadWords = exports.stringContainsBadWord = void 0;
var Filter = require("bad-words");
function stringContainsBadWord(input) {
    // Clean and get bad word
    var cleaned_string = new Filter().clean(input);
    var has_bad_word = input !== cleaned_string;
    // Return data
    return {
        has_bad_word: has_bad_word,
        found_bad_word: has_bad_word ? cleaned_string : undefined
    };
}
exports.stringContainsBadWord = stringContainsBadWord;
function replaceBadWords(input) {
    return new Filter().clean(input);
}
exports.replaceBadWords = replaceBadWords;
