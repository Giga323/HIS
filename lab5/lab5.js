import {minimization, outputMinFunctionPCNF, outputMinFunctionPDNF} from './lab3.js'

let RANK_COUNTER = 16
let INPUTS = ['q4*', 'q3*', 'q2*', 'q1*', 'V']
let ROWS_NAMES = ['q4*', 'q3*', 'q2*', 'q1*', '_V_', 'q_4', 'q_3', 'q_2', 'q_1', 'h_4', 'h_3', 'h_2', 'h_1']
let QUANTITY = 4
let ROW_STATE_MACHINE = 5
let ROW_STATE_EXCITATION = 10

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

function binToNum(value){
    let num = 0
    for (let i = 0; i < value.length; i++) {
        num += value[i] * 2 ** (value.length - i - 1)
    }
    return num
}

function initColumnsAndRows(table) {
    for (let i = 0; i < ROWS_NAMES.length; i++) {
        let row = []
        row.push(ROWS_NAMES[i])
        table.push(row)
    }
}

function initInputs(table){
    for (let i = 0; i < RANK_COUNTER; i++) {
        let column = numToBin(i, QUANTITY)
        for (let j = 0; j < QUANTITY; j++) {
            table[j].push(column[j], column[j])
        }
    }
}

function initStateMachine(table) {
    for (let i = 0; i < RANK_COUNTER; i++) {
        table[ROW_STATE_MACHINE - 1].push(0, 1)
    }
}

function fillInputColumn(table, number_of_column) {
    let column = []
    for (let i = 0; i < QUANTITY; i++) {
        column.push(table[i][number_of_column])
    }
    return column
}

function fillOutputColumn(table, number_of_column) {
    let column = []
    for (let i = ROW_STATE_MACHINE; i < ROW_STATE_EXCITATION - 1; i++) {
        column.push(table[i][number_of_column])
    }
    return column
}

function fillOutput(table, values) {
    for (let i = 0; i < QUANTITY; i++) {
        table[ROW_STATE_MACHINE + i].push(values[i])
    }
}

function initOutputs(table) {
    for (let i = 1; i < RANK_COUNTER * 2 + 1; i++) {
        let column = fillInputColumn(table, i)
        if (!column.includes(1) && table[ROW_STATE_MACHINE - 1][i] === 1) {
            column = [1, 1, 1, 1]
        } else if (column.includes(1) && table[ROW_STATE_MACHINE - 1][i] === 1) {
            column = numToBin(binToNum(column) - 1, QUANTITY)
        }
        fillOutput(table, column)
    }
}

function fillExcitationColumn(table, values) {
    for (let i = 0; i < QUANTITY; i++) {
        table[ROW_STATE_EXCITATION + i - 1].push(values[i])
    }
}

function initExcitation(table) {
    for (let i = 1; i < RANK_COUNTER * 2 + 1; i++) {
        let input_column = fillInputColumn(table, i)
        let output_column = fillOutputColumn(table, i)
        let result = []
        for (let j = 0; j < QUANTITY; j++) {
            if (input_column[j] === output_column[j]) {
                result.push(0)
            } else {
                result.push(1)
            }
        }
        fillExcitationColumn(table, result)
    }
}

function buildTruthTable() {
    let table = []
    initColumnsAndRows(table)
    initInputs(table)
    initStateMachine(table)
    initOutputs(table)
    initExcitation(table)
    return table
}

function outputTable(table) {
    console.log('-------------------------------------------------------------------')
    for (let i = 0; i < ROWS_NAMES.length; i++) {
        if (i === 4 || i === 5 || i === 9) {
            console.log('-------------------------------------------------------------------')
        }
        let row = ''
        for (let j = 0; j < table[i].length; j++) {
            row += (table[i][j] + ' ').toString()
        }
        console.log(row)
    }
    console.log('-------------------------------------------------------------------')
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

function fillValuesPCNF(truth_table, PCNF, row) {
    PCNF.push([])
    for (let i = 0; i < QUANTITY + 1; i++) {
        PCNF[PCNF.length - 1].push(truth_table[i][row])
    }
}

function substituteValuesPCNF(PCNF) {
    for (let i = 0; i < PCNF.length; i++) {
        for (let j = 0; j < PCNF[0].length; j++) {
            if (PCNF[i][j] === 0) {
                PCNF[i][j] = INPUTS[j]
            } else {
                PCNF[i][j] = '!' + INPUTS[j]
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

function fillValuesPDNF(truth_table, PDNF, row) {
    PDNF.push([])
    for (let i = 0; i < QUANTITY + 1; i++) {
        PDNF[PDNF.length - 1].push(truth_table[i][row])
    }
}

function substituteValuesPDNF(PDNF) {
    for (let i = 0; i < PDNF.length; i++) {
        for (let j = 0; j < PDNF[0].length; j++) {
            if (PDNF[i][j] === 1) {
                PDNF[i][j] = INPUTS[j]
            } else {
                PDNF[i][j] = '!' + INPUTS[j]
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

function redefineValue(truth_table, number_of_column) {
    let PCNF = buildPCNF(truth_table, number_of_column + ROW_STATE_EXCITATION - 1)
    let PDNF = buildPDNF(truth_table, number_of_column + ROW_STATE_EXCITATION - 1)
    let expression_PCNF = ''
    let expression_PDNF = ''
    expression_PCNF = makeExpressionPCNF(PCNF)
    expression_PDNF = makeExpressionPDNF(PDNF)
    PCNF = minimization(expression_PCNF)
    PDNF = minimization(expression_PDNF)
    if (PCNF.length > PDNF.length) {
        return [PCNF, 'PCNF']
    } else {
        return [PDNF, 'PDNF']
    }
}

function redefineValues(truth_table){
    let minimized_values = []
    for (let i = 0; i < QUANTITY ; i++) {
        minimized_values.push(redefineValue(truth_table, i))
    }
    return minimized_values
}

function findMinFunctions(table){
    let min_values = redefineValues(table)
    outputMinFunctions(min_values)
}

function main() {
    let table = buildTruthTable()
    outputTable(table)
    findMinFunctions(table)
}

main()