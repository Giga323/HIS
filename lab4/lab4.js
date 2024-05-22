import {minimization, outputMinFunctionPCNF, outputMinFunctionPDNF} from "./lab3.js"

let INPUTS = ['x1', 'x2', 'x3', 'S', 'P']
let QUANTITY_OF_INPUTS_SUMMATOR = 3
let INPUTS_OUTPUTS_TETRADS = ['x4', 'x3', 'x2', 'x1', 'y4', 'y3', 'y2', 'y1']
let QUANTITY_OF_COLUMNS_TETRADS = 16
let QUANTITY_OF_VARIABLES = 4
let QUANTITY_OF_DECIMAL_NUMBERS = 10
let SHIFT = 9
let MAX_NUMBER = 64
let EXCESS_VALUE = 6

function checkZeroOne(value, quantity){
    let result = []
    if (value === 0) {
        for (let i = 0; i < quantity; i++) {
            result.unshift(0)
        }
        return result
    } else if (value === 1) {
        result.unshift(1)
        for (let i = 1; i < quantity; i++) {
            result.unshift(0)
        }
    }
    return result
}

function numToBin(value, quantity) {
    let result = []
    if (value === 0 || value === 1) {
        return checkZeroOne(value, quantity)
    }
    else {
        while (value !== 1) {
            if (value % 2 === 0) {
                result.unshift(0)
            } else {
                result.unshift(1)
            }
            value = Math.floor(value / 2)
        }
        result.unshift(1)
        if (result.length < quantity) {
            while (result.length !== quantity) {
                result.unshift(0)
            }
        }
    }
    return result
}

function initColumns(truth_table) {
    for (let i = 0; i < INPUTS.length; i++) {
        truth_table.push([])
        truth_table[i].push(INPUTS[i])
    }
}

function initThreeColumns(truth_table) {
    for (let i = 0; i < 2**QUANTITY_OF_INPUTS_SUMMATOR; i++) {
        let row =  numToBin(i, QUANTITY_OF_INPUTS_SUMMATOR)
        for (let j = 0; j < row.length; j++) {
            truth_table[j].push(row[j])
        }
    }
}

function summa(sum) {
    return numToBin(sum, QUANTITY_OF_INPUTS_SUMMATOR - 1)
}

function initTwoColumns(truth_table) {
    for (let i = 1; i < truth_table[0].length; i++) {
        let sum = summa(truth_table[0][i] + truth_table[1][i] + truth_table[2][i])
        truth_table[3].push(sum[1])
        truth_table[4].push(sum[0])
    }
}

function buildTruthTableFT() {
    let truth_table = []
    initColumns(truth_table)
    initThreeColumns(truth_table)
    initTwoColumns(truth_table)
    return truth_table
}

function fillValuesPCNF(truth_table, PCNF, row) {
    PCNF.push([])
    if (truth_table.length === INPUTS.length) {
        for (let i = 0; i < QUANTITY_OF_INPUTS_SUMMATOR; i++) {
            PCNF[PCNF.length - 1].push(truth_table[i][row])
        }
    } else {
        for (let i = 0; i < QUANTITY_OF_VARIABLES; i++) {
            PCNF[PCNF.length - 1].push(truth_table[i][row])
        }
    }
}

function substituteValuesPCNF(PCNF) {
    if (PCNF.length === 4) {
        for (let i = 0; i < PCNF.length; i++) {
            for (let j = 0; j < PCNF[0].length; j++) {
                if (PCNF[i][j] === 0) {
                    PCNF[i][j] = INPUTS[j]
                } else {
                    PCNF[i][j] = '!' + INPUTS[j]
                }
            }
        }
    } else {
        for (let i = 0; i < PCNF.length; i++) {
            for (let j = 0; j < PCNF[0].length; j++) {
                if (PCNF[i][j] === 0) {
                    PCNF[i][j] = INPUTS_OUTPUTS_TETRADS[j]
                } else {
                    PCNF[i][j] = '!' + INPUTS_OUTPUTS_TETRADS[j]
                }
            }
        }
    }
}

function buildPCNF(truth_table, number_of_column) {
    let PCNF = []
    for (let i = 1; i < truth_table[0].length; i++) {
        if (truth_table[number_of_column][i] === 0) {
            fillValuesPCNF(truth_table, PCNF, i)
        }
    }
    substituteValuesPCNF(PCNF)
    return PCNF
}

function makeExpressionPCNF(PCNF) {
    let expression = []
    for (let i = 0; i < PCNF.length; i++) {
        expression.push('(')
        for (let j = 0; j < PCNF[i].length; j++) {
            expression.push(PCNF[i][j])
            if (j !== PCNF[i].length - 1) {
                expression.push('|')
            }
        }
        expression.push(')')
        if (i !== PCNF.length - 1) {
            expression.push('&')
        }
    }
    return expression
}

function outputPCNF(expression) {
    console.log('Form of PCNF is ' + expression.join(''))
}

function firstTask() {
    let truth_table = buildTruthTableFT()
    outputTable(truth_table)
    let PCNF1 = buildPCNF(truth_table, 4)
    let PCNF2 = buildPCNF(truth_table, 3)
    let expression_PCNF1 = ''
    let expression_PCNF2 = ''
    expression_PCNF1 = makeExpressionPCNF(PCNF1)
    expression_PCNF2 = makeExpressionPCNF(PCNF2)
    outputPCNF(expression_PCNF2)
    console.log(outputMinFunctionPCNF(minimization(expression_PCNF2)))
    outputPCNF(expression_PCNF1)
    console.log(outputMinFunctionPCNF(minimization(expression_PCNF1)))
}

function initColumnsST(truth_table){
    for (let i = 0; i < INPUTS_OUTPUTS_TETRADS.length; i++) {
        truth_table.push([])
        truth_table[i].push(INPUTS_OUTPUTS_TETRADS[i])
    }
}

function initFourColumnsST(truth_table) {
    for (let i = 0; i < QUANTITY_OF_COLUMNS_TETRADS; i++) {
        let column = numToBin(i, QUANTITY_OF_VARIABLES)
        for (let j = 0; j < QUANTITY_OF_VARIABLES; j++) {
            truth_table[j].push(column[j])
        }
    }
}

function shiftRow(row) {
    for (let i = 0; i < SHIFT; i++) {
        row.shift()
    }
}

function convertRow(row) {
    shiftRow(row)
    for (let i = row.length; i < QUANTITY_OF_DECIMAL_NUMBERS; i++) {
        row.push(0)
    }
    for (let i = row.length; i < QUANTITY_OF_COLUMNS_TETRADS; i++) {
        row.push('-')
    }
}

function addValues(truth_table, row, row_number) {
    for (let i = 0; i < row.length; i++) {
        truth_table[row_number].push(row[i])
    }
}

function initAnFourColumns(truth_table) {
    let copy_truth_table = JSON.parse(JSON.stringify(truth_table))
    for (let i = QUANTITY_OF_VARIABLES; i < INPUTS_OUTPUTS_TETRADS.length; i++) {
        copy_truth_table[i - QUANTITY_OF_VARIABLES].shift()
        let row = copy_truth_table[i - QUANTITY_OF_VARIABLES]
        convertRow(row)
        addValues(truth_table, row, i)
    }
}

function buildTruthTableST() {
    let truth_table = []
    initColumnsST(truth_table)
    initFourColumnsST(truth_table)
    initAnFourColumns(truth_table)
    return truth_table
}

function allowedValues() {
    let allowed_values = []
    for (let i = 0; i < MAX_NUMBER; i++) {
        allowed_values.push(numToBin(i, EXCESS_VALUE))
    }
    return allowed_values
}

function fillValuesPDNF(truth_table, PDNF, row) {
    PDNF.push([])
    if (truth_table === INPUTS.length) {
        for (let i = 0; i < QUANTITY_OF_INPUTS_SUMMATOR; i++) {
            PDNF[PDNF.length - 1].push(truth_table[i][row])
        }
    } else {
        for (let i = 0; i < QUANTITY_OF_VARIABLES; i++) {
            PDNF[PDNF.length - 1].push(truth_table[i][row])
        }
    }
}

function substituteValuesPDNF(PDNF) {
    if (PDNF.length === 4) {
        for (let i = 0; i < PDNF.length; i++) {
            for (let j = 0; j < PDNF[0].length; j++) {
                if (PDNF[i][j] === 1) {
                    PDNF[i][j] = INPUTS[j]
                } else {
                    PDNF[i][j] = '!' + INPUTS[j]
                }
            }
        }
    } else {
        for (let i = 0; i < PDNF.length; i++) {
            for (let j = 0; j < PDNF[0].length; j++) {
                if (PDNF[i][j] === 1) {
                    PDNF[i][j] = INPUTS_OUTPUTS_TETRADS[j]
                } else {
                    PDNF[i][j] = '!' + INPUTS_OUTPUTS_TETRADS[j]
                }
            }
        }
    }
}

function buildPDNF(truth_table, number_of_column) {
    let PDNF = []
    for (let i = 1; i < truth_table[0].length; i++) {
        if (truth_table[number_of_column][i] === 1) {
            fillValuesPDNF(truth_table, PDNF, i)
        }
    }
    substituteValuesPDNF(PDNF)
    return PDNF
}

function makeExpressionPDNF(PCNF) {
    let expression = []
    for (let i = 0; i < PCNF.length; i++) {
        expression.push('(')
        for (let j = 0; j < PCNF[i].length; j++) {
            expression.push(PCNF[i][j])
            if (j !== PCNF[i].length - 1) {
                expression.push('&')
            }
        }
        expression.push(')')
        if (i !== PCNF.length - 1) {
            expression.push('|')
        }
    }
    return expression
}

function fillExtraValues(allowed_value, truth_table) {
    for (let i = QUANTITY_OF_VARIABLES; i < truth_table.length; i++) {
        for (let j = QUANTITY_OF_DECIMAL_NUMBERS + 1; j < truth_table[0].length; j++) {
            truth_table[i][j] = allowed_value[j - QUANTITY_OF_DECIMAL_NUMBERS - 1]
        }
    }
}

function findMinimumLength(values) {
    let min = []
    for (let i = 0; i < values.length - 1; i++) {
        if (values[i].length < values[i + 1]) {
            min = values[i]
        } else {
            min = values[i + 1]
        }
    }
    return min
}

function redefineValue(allowed_values, truth_table, number_of_column) {
    let PDNFs = []
    let PCNFs = []
    for (let i = 0; i < allowed_values.length; i++) {
        fillExtraValues(allowed_values[i], truth_table)
        let PCNF = buildPCNF(truth_table, number_of_column + QUANTITY_OF_VARIABLES)
        let PDNF = buildPDNF(truth_table, number_of_column + QUANTITY_OF_VARIABLES)
        let expression_PCNF = ''
        let expression_PDNF = ''
        expression_PCNF = makeExpressionPCNF(PCNF)
        expression_PDNF = makeExpressionPDNF(PDNF)
        PCNFs.push(minimization(expression_PCNF))
        PDNFs.push(minimization(expression_PDNF))
    }
    let min_PDNF = findMinimumLength(PDNFs)
    let min_PCNF = findMinimumLength(PCNFs)
    if (min_PCNF.length < min_PDNF.length) {
        return [min_PCNF, 'PCNF']
    } else {
        return [min_PDNF, 'PDNF']
    }
}



function redefineValues(truth_table){
    let allowed_values = allowedValues()
    let minimized_values = []
    for (let i = 0; i < QUANTITY_OF_VARIABLES; i++) {
        minimized_values.push(redefineValue(allowed_values, truth_table, i))
    }
    return minimized_values
}

function outputTable(truth_table) {
    for (let i = 0; i < truth_table.length; i++) {
        let row = truth_table[i].join(' ')
        console.log(row)
    }
}

function outputMinFunctions(min_values) {
    for (let i = 0; i < min_values.length; i++) {
        if (min_values[i][1] === 'PCNF') {
            console.log(outputMinFunctionPCNF(min_values[i][0]))
        } else {
            console.log(outputMinFunctionPDNF(min_values[i][0]))
        }
    }
}

function secondTask(){
    let truth_table = buildTruthTableST()
    outputTable(truth_table)
    let min_values = redefineValues(truth_table)
    outputMinFunctions(min_values)
}

function main() {
    console.log('FIRST TASK')
    firstTask()
    console.log('                                 ')
    console.log('---------------------------------')
    console.log('                                 ')
    console.log('SECOND TASK')
    secondTask()
}

main()


