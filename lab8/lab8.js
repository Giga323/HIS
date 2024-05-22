let QUANTITY_OF_BITS = 16
let LETTERS = [0, 1]
let IS_MEMORY_DIAGONALIZED = false

function fillValuesMemory(memory) {
    for (let i = 0; i < QUANTITY_OF_BITS; i++) {
        let row = []
        for (let j = 0; j < QUANTITY_OF_BITS; j++) {
            row.push(0)
        }
        memory.push(row)
    }
}

function initMemory() {
    let memory = []
    fillValuesMemory(memory)
    return memory
}

function transposeMemoryTable(memory) {
    memory = memory[0].map((value, i) =>
        memory.map(row => row[i])
    )
}

function wordShift(word, shift) {
    let sh = 0
    if(shift === -0) {
        shift = 0
    } else {
        shift = sh - shift
    }
    let newWord = word.slice(-shift).concat(word.slice(0, -shift));
    return newWord
}

function reverseDiagAdress(memory) {
    if (!IS_MEMORY_DIAGONALIZED) {
        return
    }
    let newMemory = []
    fillValuesMemory(newMemory)
    transposeMemoryTable(memory)
    for (let i = 0; i < QUANTITY_OF_BITS; i++) {
        newMemory[i] = wordShift(memory[i], -i)
    }
    memory = newMemory[0].map((value, i) =>
        newMemory.map(row => row[i]))
    IS_MEMORY_DIAGONALIZED = false
    return memory
}

function generateWords() {
    let words = []
    for (let i = 0; i < QUANTITY_OF_BITS; i++) {
        let word = []
        while (word.length < QUANTITY_OF_BITS) {
            word.push(LETTERS[Math.floor(Math.random() * LETTERS.length)])
        }
        words.push(word)
    }
    return words
}

function shiftW(index, word) {
    let shift = (word.length - index)
    let firstPart = word.slice(0, shift)
    let secondPart = word.slice(shift)

    return secondPart.concat(firstPart)
}

function initEntry(memory, word, index) {
    let shiftWord = shiftW(index, word)
    for(let i = 0; i < memory.length; i++) {
        memory[i][index] = shiftWord[i]
    }
}

function outputTable(memory) {
    const copy_memory = Array.from(memory)
    console.log('------------------------------------------------')
    for (let i = 0; i < QUANTITY_OF_BITS; i++) {
        let word = ''
        word = copy_memory[i].join('  ')
        console.log(word)
    }
    console.log('------------------------------------------------')
}

function chosenWord(memory, index) {
    let shiftedWord = memory.map(word => word[index]);
    let word = shiftedWord.slice(index).concat(shiftedWord.slice(0, index));
    return word
}

function checkFlags(processor, word, requireWord) {
    let g = false;
    let l = false;
    for (let i = 0; i < QUANTITY_OF_BITS; i++) {
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

function searchWithGivenRange(memory, lower_bound, upper_bound) {
    let search_words_lower = []
    for( let i = 0; i < memory.length; i++) {
        if(compareWords(memory.join(''), memory[i].join(''), upper_bound) === -1) {
            search_words_lower.push(memory[i].join(''))
        }
    }
    let search_words = []
    for(let i = 0; i < search_words_lower.length; i++) {
        if(compareWords(search_words_lower.join(''), search_words_lower[i], lower_bound) === 1) {
            search_words.push(search_words_lower[i])
        }
    }
    return search_words
}

function implication(word) {
    let copy_word = []
    for (let i = 0; i < word.length; i++) {
        copy_word[i] = Math.abs(word[i] - 1)
    }
    return copy_word
}

function f2(word1, word2) {
    let result = []
    let copy_word2 = implication(word2)
    for (let i = 0; i < word1.length; i++) {
        result.push(word1[i] && copy_word2[i])
    }
    return result
}

function f7(word1, word2) {
    let result = []
    for (let i = 0; i < word1.length; i++) {
        result.push(word1[i] || word2[i])
    }
    return result
}

function f8(word1, word2) {
    let result = []
    for (let i = 0; i < word1.length; i++) {
        result.push(Math.abs((word1[i] || word2[i]) - 1))
    }
    return result
}

function f13(word1, word2) {
    let result = []
    let copy_word1 = implication(word1)
    for (let i = 0; i < word2.length; i++) {
        result.push(copy_word1[i] || word2[i])
    }
    return result
}

function getWords(memory) {
    let words = []
    for(let i = 0; i < QUANTITY_OF_BITS; i++) {
        words.push(chosenWord(memory, i))
    }

    return words
}

function arithmeticFunction(memory, V) {
    let result = [];
    let all_words = getWords(memory);
    let suitable_words = all_words.filter(x => x.slice(0, 3).join('') === V.join(''));
    for (let word of suitable_words) {
        let A = word.slice(3, 7);
        let B = word.slice(7, 11);
        result.push(word.slice(0, 11).concat(sumPartsOfWords(A, B)));
    }

    let enumerated_result = {};
    for (let i = 0; i < result.length; i++) {
        enumerated_result[i] = result[i];
    }

    return enumerated_result;
}

function sumPartsOfWords(word1, word2) {
    let el1 = word1.map(x => parseInt(x));
    let el2 = word2.map(x => parseInt(x));
    let result = '';
    let carry = 0;

    while (el1.length && el2.length) {
        let digit1 = el1.pop();
        let digit2 = el2.pop();
        let res = digit1 ^ digit2 ^ carry;
        result = res.toString() + result;
        carry = (digit1 && digit2) || (digit1 ^ digit2) && carry;
    }

    result = carry.toString() + result;
    return result.split('').map(x => parseInt(x));
}

function diagonalAddressing(memory) {
    if (IS_MEMORY_DIAGONALIZED) {
        return
    }
    let newMemory = initMemory()
    for (let i = 0; i < QUANTITY_OF_BITS; i++) {
        let newWord = []
        for (let word of memory) {
            newWord.push(word[i]);
        }
        newWord = wordShift(newWord, i)
        newMemory[i] = newWord
    }
    memory = newMemory.map(row => [...row])
    IS_MEMORY_DIAGONALIZED = true
    return memory
}

function writeWord(memory, wordIndex, word) {
    if (word.length !== QUANTITY_OF_BITS) {
        console.log("Word must be equal to 16")
        return
    }
    if (!IS_MEMORY_DIAGONALIZED) {
        diagonalAddressing(memory)
    }
    let optimizedWord = word.split("")
    for (let i = 0; i < optimizedWord.length; i++) {
        optimizedWord[i] = Number(optimizedWord[i])
    }
    let optimizedTable = []
    for (let i = 0; i < memory.length; i++) {
        optimizedTable.push([...memory[i]])
    }
    for (let i = 0; i < QUANTITY_OF_BITS; i++) {
        optimizedTable[i][(wordIndex + i) % QUANTITY_OF_BITS] = optimizedWord[i]
    }

    memory = optimizedTable[0].map((_, colIndex)=> optimizedTable.map(row => row[colIndex]))
}

function readWord(memory, wordIndex) {
    if (!IS_MEMORY_DIAGONALIZED) {
        diagonalAddressing(memory)
    }

    let optimizedTable = [];
    for (let i = 0; i < memory[0].length; i++) {
        optimizedTable.push(memory.map(row => row[i]));
    }

    let resultWord = optimizedTable.map((row, i) => row[(wordIndex + i) % QUANTITY_OF_BITS].toString()).join('');

    return resultWord
}

function fillWords(memory) {
    let words = generateWords()
    for (let i = 0; i < QUANTITY_OF_BITS; i++) {
        initEntry(memory, words[i], i)
    }
}

function fillWriteWord(memory) {
    let word = Array.from({length: QUANTITY_OF_BITS},
        () => Math.floor(Math.random() * 2)).join('')
    console.log(`[${0}] ${word}`)
    writeWord(memory, 0, word)
}

function shift() {
    let word1 = Array.from({length: QUANTITY_OF_BITS},
        () => Math.floor(Math.random() * 2)).join('')
    console.log(word1)
    console.log(wordShift(word1, -1))
}

function main() {
    let memory = initMemory()
    fillWords(memory)
    fillWriteWord(memory)
    console.log('Shift:')
    shift()
    console.log(`Readed word: ${readWord(memory, 0)}`)
    console.log('Memory: ')
    outputTable(memory)
    console.log('Diagonal adressing: ')
    memory = reverseDiagAdress(memory)
    outputTable(memory)
    console.log('Reverse diagonal adressing: ')
    memory = diagonalAddressing(memory)
    outputTable(memory)
    console.log(chosenWord(memory, 1))
    console.log(searchWithGivenRange(memory, '0000000000000001', '1000000000000001'))
    console.log(`First word ${readWord(memory, 0)}`)
    console.log(`Second word ${readWord(memory, 1)}`)
    console.log('Logical function f2: ', f2(memory[0], memory[1]).join())
    console.log('Logical function f7: ', f7(memory[0], memory[1]).join())
    console.log('Logical function f8: ', f8(memory[0], memory[1]).join())
    console.log('Logical function f13: ', f13(memory[0], memory[1]).join())
    console.log('Sum is ', arithmeticFunction(memory, [1,0,0]))
}

main()
