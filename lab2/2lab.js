/*
Лабораторная работа №2
Выполнена студентом группы 121702 Нагла Никитой
*/
//Константы
tokens = ['(', ')', '!', '&', '|', '->', '~']

//Инверсия
function inversion(element) {
    return Math.abs(element - 1)
}

//Конъюнкция
function conjunction(element1, element2) {
    return (element1 + element2 === 2) ? 1 : 0
}

//Дизъюнкция
function disjunction(element1, element2) {
    return (element1 + element2 === 0) ? 0 : 1
}

//Импликация
function implication(element1, element2) {
    return (element2 - element1 >= 0) ? 1 : 0
}

//Эквиваленция
function equivalence(element1, element2) {
    return (element1 === element2) ? 1 : 0
}

//Функция для проверки на 0 и 1
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

//Перевод из десятичного числа в двоичное
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


//Удаление пробелов в строке
function deleteSpaces(str) {
    return str.split(' ').join('')
}

//Разбиение строки на массив символов
function decomposition(str, expr) {
    expr = str.split('')
    for (let i = 0; i < expr.length; i++) {
        if (expr[i] === '-' && expr[i + 1] === '>') {
            expr[i] = '->'
            expr.splice(i + 1, 1)
        }
    }
    return expr
}

//Считает количество переменных
function findVariables(arr) {
    let variables = []
    for (let i = 0; i < arr.length; i++) {
        if (!tokens.includes(arr[i]) && !variables.includes(arr[i])) {
            variables.push(arr[i])
        }
    }
    return variables
}

//Заполняет таблицу истинности нужным количеством строк
function initTableRows(table, variable){
    for (let i = 0; i < (2 ** variable.length) + 1; i++) {
        table[i] = []
    }
    return table
}

//Заполняет первую строку для красоты литералами
function initFirstRow(table, variable, stackOperand){
    for (let i = 0; i < variable.length; i++) {
        table[0].push(variable[i])
    }
    for (let i = stackOperand.length - 1; i >= 0; i--) {
        table[0].push(stackOperand[i])
    }
    return table
}

function findExpression(table, strExpr) {
    let values = []
    for (let i = 0; i < table[0].length; i++) {
        if (table[0][i] === strExpr) {
            for (let j = 1; j < table.length; j++) {
                values.push(table[j][i])
            }
        }
    }
    return values
}

function addValues(table, values) {
    for (let i = 0; i < values.length; i++) {
        table[i + 1].push(values[i])
    }
}

function fillValue(table, values, numberOfColumn){
    let row = []
    for (let i = 1; i < table.length; i++) {
        row.push(table[i][numberOfColumn])
    }
    values.push(row)
}

function findValue(element1, element2, token) {
    switch (token) {
        case '&':
            return conjunction(element1, element2)
            break
        case '|':
            return disjunction(element1, element2)
            break
        case '->':
            return implication(element1, element2)
            break
        case '~':
            return equivalence(element1, element2)
            break
    }
}

function

findValuesBinaryFunctions(table, values, token){
    for (let i = 0; i < values[0].length; i++) {
        let value = findValue(values[0][i], values[1][i], token)
        table[i + 1].push(value)
    }
}

function defineToken(strExpr){
    for (let i = 0; i < strExpr.length; i++) {
        if (strExpr[i] === '-') {
            return strExpr[i] + '>'
        }
        if (tokens.includes(strExpr[i]) && strExpr[i] !== '(' && strExpr[i] !== ')') {
            return strExpr[i]
        }
    }
}

function solveExpressions(table, numberOfStartExpression) {
    for (let i = numberOfStartExpression; i < table[0].length; i++) {
        let expression = table[0][i].split('')
        let strExpr = expression.join('')
        if (expression[0] === '(' || expression[0] !== '(' && expression[0] !== '!') {
            let values = []
            let indexes = []
            for (let j = table[0].length - 1; j >= 0; j--) {
                if (strExpr.includes(table[0][j]) && strExpr !== table[0][j]) {
                    strExpr = strExpr.replace(table[0][j], '')
                    fillValue(table, values, j)
                    indexes.push(j)
                }
                if (values.length === 2) {
                    if (indexes[0] > indexes[1]) {
                        [values[0], values[1]] = [values[1], values[0]]
                    }
                    let token = defineToken(strExpr)
                    findValuesBinaryFunctions(table, values, token)
                    break
                }
            }
        } else if (expression[0] === '!') {
            expression.splice(0,1)
            if (expression[0] === '(') {
                expression.splice(0,1)
                expression.splice(expression.length - 1, 1)
            }
            let strExpr = expression.join('')
            let values = findExpression(table, strExpr)
            for (let j = 0; j < values.length; j++) {
                values[j] = inversion(values[j])
            }
            addValues(table, values)
        }
    }
}

//Заполняет таблицу значениями
function fillTableValues(table, variable) {
    for (let i = 0; i < (2 ** variable.length); i++) {
        let row = numToBin(i, variable.length)
        for (let j = 0; j < variable.length; j++) {
            table[i + 1].push(row[j])
        }
    }
    let numberOfStartExpression = variable.length

    solveExpressions(table, numberOfStartExpression)
    return table
}

function setRightOrder(variables){
    for (let i = 0; i < variables.length; i++) {
        for (let j = 0; j < variables.length; j++) {
            if (variables[i] < variables[j]) {
                [variables[i], variables[j]] = [variables[j], variables[i]]
            }
        }
    }
}

//Построение таблицы истинности
function buildTruthTable(expr, stackOperand){
    let variable = findVariables(expr)
    setRightOrder(variable)
    let table = []
    table = initTableRows(table, variable)
    table = initFirstRow(table, variable, stackOperand)
    table = fillTableValues(table, variable)
    return table
}

//Соединяет вместе переменные
function pasteTogether(arr){
    for (let i = 0; i < arr.length; i++) {
        if (!tokens.includes(arr[i])) {
            while (!tokens.includes(arr[i])) {
                arr[i] = arr[i] + arr[i+1]
                arr.splice(i + 1, 1)
                i++
            }
        }
    }
}

function checkOpenBracket(expression) {
    while (expression[0] !== '(' && expression.length !== 0) {
        expression.splice(0, 1)
    }
    return
}

function checkFormula(expression) {
    for (let i = 0; i < expression.length; i++) {
        if (tokens.includes(expression[i])) {
            return false
        }
    }
    return true
}

function findCloseBracket(expression) {
    let bracketNumber = 0
    let i = 0
    while(i < expression.length) {
        if (expression[i] === '(') {
            bracketNumber++
        } else if (expression[i] === ')') {
            bracketNumber--
            if (bracketNumber === 0) {
                return i
            }
        }
        i++
    }
}

function checkSubExpression(subExpression) {
    if (tokens.includes(subExpression[0]) && subExpression[0] !== '!' && subExpression !== '(' && subExpression !== ')') {
        subExpression.splice(0, 1)
    }
}

function cutFormula(expression, indexOpenBracket, indexCloseBracket, stackOperand) {
    let subExpression = []
    expression.splice(0, 1)
    expression.splice(indexCloseBracket - 1, 1)
    let i = indexCloseBracket - 1
    while (i !== expression.length) {
        subExpression.push(expression[i])
        i++
    }
    expression.splice(indexCloseBracket - 1, expression.length - indexCloseBracket + 1)
    checkSubExpression(subExpression)
    parseExpression(subExpression, stackOperand)
}

function changeExpression(expression, stackOperand){
    checkOpenBracket(expression)
    if (checkFormula(expression)) {
        return
    }
    let indexCloseBracket = findCloseBracket(expression)
    cutFormula(expression, 0, indexCloseBracket, stackOperand)
}

function deleteAtomExpr(stackOperand) {
    for (let i = 0; i < stackOperand.length; i++) {
        let operand = stackOperand[i].split('')
        if (checkFormula(operand)) {
            stackOperand.splice(i, 1)
            i--
        }
    }
}

function deleteEqualExpr(stackOperand) {
    for (let i = 0; i < stackOperand.length; i++) {
        for (let j = 0; j < stackOperand.length; j++) {
            if ((stackOperand[i] === stackOperand[j] || stackOperand[i] === '(' + stackOperand[j] + ')') && i !== j) {
                stackOperand.splice(i, 1)
            }
        }
    }
}

function parseExpression(expression, stackOperand) {
    if (expression.length === 0) {
        return
    }
    else {
        stackOperand.push(expression.join(''))
        changeExpression(expression, stackOperand)
        parseExpression(expression, stackOperand)
        deleteAtomExpr(stackOperand)
    }
}

function fillVariables(table) {
    let variables = []
    for (let i = 0; i < Math.log2(table.length - 1); i++) {
        variables.push(table[0][i])
    }
    return variables
}

function fillValuesForNF(table, row, numberOfRow) {
    for (let i = 0; i < Math.log2(table.length - 1); i++) {
        row.push(table[numberOfRow][i])
    }
}

function outputPDNF(tablePDNF) {
    let PDNF = ""
    for (let i = 1; i < tablePDNF.length; i++) {
        PDNF += '('
        for (let j = 0; j < tablePDNF[i].length; j++) {
            if (tablePDNF[i][j] === 1) {
                PDNF += tablePDNF[0][j]
            }
            else {
                PDNF += '(!' + tablePDNF[0][j] + ')'
            }
            if (j !== tablePDNF[i].length - 1) {
                PDNF += '&'
            }
        }
        PDNF += ')'
        if (i !== tablePDNF.length - 1) {
            PDNF += '|'
        }
    }
    return PDNF
}

function numFormPDNF(table){
    let strOut = '('
    for (let i = 1; i < table.length; i++) {
        if (table[i][table[0].length - 1] === 1) {
            strOut += ' ' + String(i - 1)
        }
    }
    return strOut += ' )'
}

function buildPDNF(table) {
    let tablePDNF = []
    tablePDNF.push(fillVariables(table))
    for (let i = 1; i < table.length; i++) {
        if (table[i][table[0].length - 1] === 1) {
            let row = []
            fillValuesForNF(table, row, i)
            tablePDNF.push(row)
        }
    }
    return 'PDNF is ' + outputPDNF(tablePDNF) + '\nNumeric form of PDNF is ' + numFormPDNF(table) + '\n'
}

function outputPCNF(tablePCNF) {
    let PCNF = ""
    for (let i = 1; i < tablePCNF.length; i++) {
        PCNF += '('
        for (let j = 0; j < tablePCNF[i].length; j++) {
            if (tablePCNF[i][j] === 0) {
                PCNF += tablePCNF[0][j]
            }
            else {
                PCNF += '(!' + tablePCNF[0][j] + ')'
            }
            if (j !== tablePCNF[i].length - 1) {
                PCNF += '|'
            }
        }
        PCNF += ')'
        if (i !== tablePCNF.length - 1) {
            PCNF += '&'
        }
    }
    return PCNF
}

function numFormPCNF(table){
    let strOut = '('
    for (let i = 1; i < table.length; i++) {
        if (table[i][table[0].length - 1] === 0) {
            strOut += ' ' + String(i - 1)
        }
    }
    return strOut += ' )'
}

function buildPCNF(table) {
    let tablePCNF = []
    tablePCNF.push(fillVariables(table))
    for (let i = 1; i < table.length; i++) {
        if (table[i][table[0].length - 1] === 0) {
            let row = []
            fillValuesForNF(table, row, i)
            tablePCNF.push(row)
        }
    }
    return 'PCNF is ' + outputPCNF(tablePCNF) + '\nNumeric form of PCNF is ' + numFormPCNF(table)
}

function iterForm(table) {
    let value = []
    for (let i = 1; i < table.length; i++) {
        value.push(table[i][table[0].length - 1])
    }
    return '\nIterative form is ' + String(binToNum(value))
}

function outputTruthTable(table) {
    console.log('Truth table')
    for (let i = 1; i < table.length; i++) {
        let row = table[i].join(' ')
        console.log(row)
    }
}

/*Tests
* (x1->((!x2)&x3)&x1)
* ((x1|x2)&(!x3))
* ((x1|x2)&x3)
* ((x1|x2)->(!x3))
* (x1->x2)
* */

function main() {
    let input = "((x1|x2)&(!x3))"
    let expression = []
    let stackOperand = []
    console.log(input)
    expression = decomposition(deleteSpaces(input), expression)
    pasteTogether(expression)
    let copy_expression = expression.slice()
    parseExpression(copy_expression, stackOperand)
    deleteEqualExpr(stackOperand)
    console.log(stackOperand)
    let table = buildTruthTable(expression, stackOperand)
    outputTruthTable(table)
    console.log(buildPDNF(table))
    console.log(buildPCNF(table))
    console.log(iterForm(table))
}

main()