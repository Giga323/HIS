let WORDS_LENGTH = 3
let QUANTITY_OF_WORDS = 10
let LETTERS = '01'

function fillValuesProcessor(processor){
    for (let i = 0; i < QUANTITY_OF_WORDS; i++) {
        let word = ''
        while (word.length < WORDS_LENGTH) {
            word += LETTERS[Math.floor(Math.random() * LETTERS.length)]
        }
        processor.push(word)
    }
}

function initProcessor() {
    let processor = []
    fillValuesProcessor(processor)
    return processor
}

function checkFlags(processor, word, requireWord) {
    let g = false;
    let l = false;
    for (let i = 0; i < WORDS_LENGTH; i++) {
        let wordDigit = Boolean(Number(word[i]));
        let requireWordDigit = Boolean(Number(requireWord[i]));
        let nextG = g || (!requireWordDigit && wordDigit && !l);
        let nextL = l || (requireWordDigit && !wordDigit && !g);
        g = nextG;
        l = nextL;
    }
    return {g, l};
}

function compareWords(processor, memory_word, search_word) {
    let comparedFlags = checkFlags(processor, memory_word, search_word);
    if (!comparedFlags['g'] && !comparedFlags['l']) {
        return 0;
    } else if (comparedFlags['g'] && !comparedFlags['l']) {
        return 1;
    } else if (!comparedFlags['g'] && comparedFlags['l']) {
        return -1;
    }
}

function findLower(processor, greater) {
    let lower = greater[0]
    for(let i = 1; i < greater.length; i++) {
        if(compareWords(processor, lower, greater[i]) === 1) {
            lower = greater[i]
        }
    }
    return lower
}

function findBigger(processor, smaller) {
    let biggest = smaller[0]
    for(let i = 1; i < smaller.length; i++) {
        if(compareWords(processor, biggest, smaller[i]) === -1) {
            biggest = smaller[i]
        }
    }
    return biggest
}

function nearestValue(processor, word) {
    let greater = []
    let lower = []
    for(let i = 0; i < processor.length; i++) {
        if(compareWords(processor, processor[i], word) === 1) {
            greater.push(processor[i])
        } else if(compareWords(processor, processor[i], word) === -1) {
            lower.push(processor[i])
        }
    }
    let lowerInGreater = findLower(processor, greater)
    let greaterInLower = findBigger(processor, lower)

    console.log(`Nearest greater word is ${lowerInGreater}`)
    console.log(`Nearest lower word is ${greaterInLower}`)

}

function outputValues(processor) {
    let values = processor.join(' ')
    console.log('Values is ' + values)
}

function searchWithGivenRange(processor, lower_bound, upper_bound) {
    let search_words_lower = []
    for( let i = 0; i < processor.length; i++) {
        if(compareWords(processor, processor[i], upper_bound) === -1) {
            search_words_lower.push(processor[i])
        }
    }
    let search_words = []
    for(let i = 0; i < search_words_lower.length; i++) {
        if(compareWords(search_words_lower, search_words_lower[i], lower_bound) === 1) {
            search_words.push(search_words_lower[i])
        }
    }
    return search_words
}

function main() {
    let processor = initProcessor()
    outputValues(processor)
    nearestValue(processor, '010')
    let values = searchWithGivenRange(processor, '001', '100')
    outputValues(values)
}

main()
