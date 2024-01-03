const Filter = require("bad-words");

export function stringContainsBadWord(input: string): {has_bad_word: boolean, found_bad_word?: string} {
    // Clean and get bad word
    const cleaned_string: string = new Filter().clean(input);
    const has_bad_word: boolean = input !== cleaned_string;

    // Return data
    return {
        has_bad_word,
        found_bad_word: has_bad_word ? cleaned_string : undefined
    }
}

export function replaceBadWords(input: string): string {
    return new Filter().clean(input);
}