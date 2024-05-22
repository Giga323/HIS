let SIZE_OF_HASH_TABLE = 20

let cell = {
    key: 0,
    value: '',
};

function hashFunction1(key) {
    let hash = key % 23
    return hash
}

function hashFunction2(key) {
    let hash = key % 19 + 1
    return hash
}

function checkKeyWord(cell, hashTable) {
    for (let i = 0; i < SIZE_OF_HASH_TABLE; i++) {
        if (cell.value === hashTable[i].value) {
            console.log(`There is the same word ${cell.value} in the table `)
            return true
        }
    }
}

function addValue(cell, hashTable) {
    if (checkKeyWord(cell, hashTable))
        return
    let hash1 = hashFunction1(cell.key)
    let hash2 = hashFunction2(cell.key)
    for (let i = 0; i < SIZE_OF_HASH_TABLE; i++) {
        if (hashTable[hash1].value === '') {
            hashTable[hash1].key = cell.key
            hashTable[hash1].value = cell.value
            return
        }
        hash1 = (hash1 + hash2) % SIZE_OF_HASH_TABLE
    }
}

function findValue(key, hashTable) {
    let hash1 = hashFunction1(key)
    let hash2 = hashFunction2(key)
    for (let i = 0; i < SIZE_OF_HASH_TABLE; i++) {
        if (hashTable[hash1].key === key && hashTable[hash1].value !== '') {
            console.log(hashTable[hash1])
        }
        hash1 = (hash1 + hash2) % SIZE_OF_HASH_TABLE
    }
}

function deleteValue(cell, hashTable) {
    let hash1 = hashFunction1(cell.key)
    let hash2 = hashFunction2(cell.key)
    for (let i = 0; i < SIZE_OF_HASH_TABLE; i++) {
        if (hashTable[hash1].key === cell.key && hashTable[hash1].value === cell.value) {
            hashTable[hash1].key = 0
            hashTable[hash1].value = ''
            return
        }
        hash1 = (hash1 + hash2) % SIZE_OF_HASH_TABLE
    }
}

function fillHashTable(hashTable) {
    for (let i = 0; i < SIZE_OF_HASH_TABLE; i++) {
        let cell_copy = Object.assign({}, cell)
        hashTable.push(cell_copy)
    }
}

let hashTable = []
fillHashTable(hashTable)
let cell_copy = Object.assign({}, cell)
cell_copy.key = 1111
cell_copy.value = 'Geely'
addValue(cell_copy, hashTable)
cell_copy.key = 1251
cell_copy.value = 'Renault'
addValue(cell_copy, hashTable)
cell_copy.key = 1333
cell_copy.value = 'Renault'
addValue(cell_copy, hashTable)
cell_copy.key = 9000
cell_copy.value = 'Skoda'
addValue(cell_copy, hashTable)
cell_copy.key = 1251
cell_copy.value = 'Mercedes-Benz'
addValue(cell_copy, hashTable)
console.log(hashTable)
findValue(1251, hashTable)
deleteValue(cell_copy, hashTable)
console.log(hashTable)