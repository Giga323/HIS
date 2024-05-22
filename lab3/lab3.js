/*
3я лабораторная работа
Выполнена студентом группы 121702 Нагла Никитой
 */

let TOKENS = ['!', '|', '&', ')', '(']

function deleteSpaces(str) {
    return str.split(' ').join('')
}

//Разбиение строки на массив символов
function decomposition(str, expr) {
    expr = str.split('')
    return expr
}

function pasteVariable(expr_arr, i) {
    while (!TOKENS.includes(expr_arr[i])) {
        if (expr_arr[i - 1] === '!') {
            expr_arr[i] = expr_arr[i - 1] + expr_arr[i] + expr_arr[i + 1]
        } else {
            expr_arr[i] += expr_arr[i + 1]
        }
        expr_arr.splice(i + 1, 1)
        i++
    }
}

function pasteTogether(expr_arr){
    for (let i = 0; i < expr_arr.length; i++) {
        if (!TOKENS.includes(expr_arr[i]) || expr_arr[i] === '!') {
            pasteVariable(expr_arr, i)
        }
    }
}

function fillRows(expr_table, expr_arr) {
    let bracketNumber = 0
    let row = []
    for (let i = 0; i < expr_arr.length; i++) {
        if (expr_arr[i] === '(') {
            bracketNumber++
            continue
        } else if (expr_arr[i] === ')') {
            bracketNumber--
        } else if (!TOKENS.includes(expr_arr[i])) {
            row.push(expr_arr[i])
        }
        if (bracketNumber === 0) {
            expr_table.push(row)
            row = []
            i++
        }
    }
}

function buildTable(expr_arr) {
    let expr_table = []
    fillRows(expr_table, expr_arr)
    return expr_table
}

function implicantDifference(implicant, equal_elements) {
    let copy_implicant = implicant.slice()
    for (let i = 0; i < equal_elements.length; i++) {
        if (copy_implicant.includes(equal_elements[i])) {
            copy_implicant.splice(copy_implicant.indexOf(equal_elements[i]), 1)
        }
    }
    return copy_implicant[0]
}

function checkLastElement(first_implicant, second_implicant, equal_elements) {
    let last_element_first = implicantDifference(first_implicant, equal_elements)
    let last_element_second = implicantDifference(second_implicant, equal_elements)
    if ((last_element_first === '!' + last_element_second) || (last_element_second === '!' + last_element_first)) {
        return true
    }
    return false
}

function compareElements(first_implicant, second_implicant) {
    let equal_elements = []
    for (let i = 0; i < first_implicant.length; i++) { //Проверяем все элементы импликанты
        for (let j = 0; j < second_implicant.length; j++) {
            if (first_implicant[i] === second_implicant[j])  {
                equal_elements.push(first_implicant[i])
                if (equal_elements.length === first_implicant.length - 1
                    && checkLastElement(first_implicant, second_implicant, equal_elements)) {
                    return equal_elements
                }
            }
        }
    }
}

function transformations(delete_implicant, copy_table, result_table) {
    for (let i = 0; i < delete_implicant.length; i++) {
        if (copy_table.includes(delete_implicant[i])) {
            copy_table.splice(copy_table.indexOf(delete_implicant[i]), 1)
        }
    }
    for (let i = 0; i < copy_table.length; i++) {
        result_table.push(copy_table[i])
    }
}

function pastingTerms(table) {
    let copy_table = table.slice()
    let result_table = []
    let delete_implicant = []
    for (let i = 0; i < table.length; i++) { //Проверяем все элементы СДНФ
        for (let j = i; j < table.length; j++) { // Проверяем все оставшиеся элементы СДНФ
            if (table[i].length === copy_table[j].length && i !== j) {
                let result_implicant = []
                result_implicant = compareElements(table[i], copy_table[j])
                if (result_implicant !== undefined) {
                    result_table.push(result_implicant)
                    delete_implicant.push(table[i], copy_table[j])
                }
            }
            else
                continue
        }
    }
    transformations(delete_implicant, copy_table, result_table)
    if (result_table.length !== copy_table.length) {
        result_table = pastingTerms(result_table)
    }
    return result_table
}

function defineValuesPDNF(term) {
    let copy_term = term.slice()
    let values = {}
    for (let i = 0; i < term.length; i++) {
        if (copy_term[i].includes('!')) {
            values[copy_term[i]] = 1
            copy_term[i] = copy_term[i].replace('!', '')
            values[copy_term[i]] = 0
        } else {
            values[copy_term[i]] = 1
            copy_term[i] = '!' + copy_term[i]
            values[copy_term[i]] = 0
        }
    }
    return values
}

function defineValuesPCNF(term) {
    let copy_term = term.slice()
    let values = {}
    for (let i = 0; i < term.length; i++) {
        if (copy_term[i].includes('!')) {
            values[copy_term[i]] = 0
            copy_term[i] = copy_term[i].replace('!', '')
            values[copy_term[i]] = 1
        } else {
            values[copy_term[i]] = 0
            copy_term[i] = '!' + copy_term[i]
            values[copy_term[i]] = 1
        }
    }
    return values
}

function checkElementsPDNF(first_implicant, second_implicant) {
    for (let i = 0; i < first_implicant.length; i++) {
        if (second_implicant.includes('!' + first_implicant[i]) ||
            first_implicant.includes('!' + second_implicant[i])) {
            continue
        } else
            return false
    }
    return true
}

function sumValuesPDNF(result_values) {
    let copy_values = result_values.slice()
    for (let i = 0; i < result_values.length; i++) {
        for (let j = 0; j < result_values.length; j++) {
            if (result_values[i].length === result_values[j].length) {
                let first_implicant = result_values[i]
                let second_implicant = result_values[j]
                if (checkElementsPDNF(first_implicant, second_implicant)){
                    copy_values.splice(copy_values.indexOf(first_implicant), 1)
                    copy_values.splice(copy_values.indexOf(second_implicant), 1)
                }
            }
        }
    }
    return copy_values
}

function valueSubstitutionPDNF(terms, implicant_values) {
    let result = []
    for (let i = 0; i < terms.length; i++) { //Импликанты
        let count_zero = 0
        let temp_implicant = []
        for (let j = 0; j < terms[i].length; j++) { //Элементы импликант
            if (implicant_values[terms[i][j]] === undefined) {
                temp_implicant.push(terms[i][j])
            } else if (implicant_values[terms[i][j]] === 0) {
                count_zero++
                break
            }
        }
        if (temp_implicant.length !== 0 && count_zero === 0) {
            result.push(temp_implicant)
        }
    }
    return result
}

function checkExtraImplicantPDNF(terms) {
    let extra_implicant = []
    for (let i = 0; i < terms.length; i++) {
        let implicant_values = defineValuesPDNF(terms[i])
        let copy_terms = terms.slice()
        copy_terms.splice(i, 1)
        let result_substitution = valueSubstitutionPDNF(copy_terms, implicant_values)
        if (sumValuesPDNF(result_substitution).length === 0) {
            extra_implicant.push(terms[i])
        }
    }
    return extra_implicant
}

function compare(extra_implicant1, extra_implicant2) {
    if (extra_implicant1.length > extra_implicant2.length) {
        return extra_implicant1
    } else
        return extra_implicant2
}

function findExtraImplicant(extra_implicants) {
    let indexOfMaxElement = undefined
    for (let i = 0; i < extra_implicants.length; i++) {
        if (extra_implicants.length === 1 || i === extra_implicants.length - 1) {
            break
        } else if (extra_implicants[i].length === extra_implicants[i + 1].length) {
            indexOfMaxElement = extra_implicants.indexOf(extra_implicants[i])
        } else {
            let extra_implicant = compare(extra_implicants[i], extra_implicants[i + 1])
            indexOfMaxElement = extra_implicants.indexOf(extra_implicant)
        }
    }
    return extra_implicants[indexOfMaxElement]
}

function defineFunction(expression) {
    let diff = 0
    for (let i = 0; i  < expression.length; i++) {
        if (expression[i] === '|') {
            diff--
        } else if (expression[i] === '&') {
            diff++
        }
    }
    if (diff < 0) {
        return 'PCNF'
    } else return 'PDNF'
}

function valueSubstitutionPCNF(terms, implicant_values) {
    let result = []
    for (let i = 0; i < terms.length; i++) { //Импликанты
        let count_zero = 0
        let temp_implicant = []
        for (let j = 0; j < terms[i].length; j++) { //Элементы импликант
            if (implicant_values[terms[i][j]] === undefined) {
                temp_implicant.push(terms[i][j])
            } else if (implicant_values[terms[i][j]] === 0) {
                count_zero++
            }
        }
        if (temp_implicant.length !== 0 && count_zero !== terms.length) {
            result.push(temp_implicant)
        }
    }
    return result
}

function checkElementsPCNF(first_implicant, second_implicant){
    for (let i = 0; i < first_implicant.length; i++) {
        if (second_implicant.includes('!' + first_implicant[i]) ||
            first_implicant.includes('!' + second_implicant[i])) {
            continue
        } else
            return false
    }
    return true
}

function sumValuesPCNF(result_values) {
    let copy_values = result_values.slice()
    for (let i = 0; i < result_values.length; i++) {
        for (let j = 0; j < result_values.length; j++) {
            if (result_values[i].length === result_values[j].length) {
                let first_implicant = result_values[i]
                let second_implicant = result_values[j]
                if (checkElementsPCNF(first_implicant, second_implicant)){
                    copy_values.splice(copy_values.indexOf(first_implicant), 1)
                    copy_values.splice(copy_values.indexOf(second_implicant), 1)
                }
            }
        }
    }
    return copy_values
}

function checkExtraImplicantPCNF(terms) {
    let extra_implicant = []
    for (let i = 0; i < terms.length; i++) {
        let implicant_values = defineValuesPCNF(terms[i])
        let copy_terms = terms.slice()
        copy_terms.splice(i, 1)
        let result_substitution = valueSubstitutionPCNF(copy_terms, implicant_values)
        if (sumValuesPCNF(result_substitution).length === 0 && result_substitution.length !== 0) {
            extra_implicant.push(terms[i])
        }
    }
    return extra_implicant
}

function findEqualImplicants(terms) {
    for (let i = 0; i < terms.length; i++) {
        for (let j = 0; j < terms.length; j++) {
            let first = terms[i].toString()
            let second = terms[j].toString()
            if (first === second && i !== j) {
                terms.splice(terms.indexOf(terms[i]), 1)
                i--
                break
            }
        }
    }
}

function calculationMethod(terms, expression){
    let extra_implicants
    let variant = defineFunction(expression)
    if (variant === 'PCNF') {
        extra_implicants = checkExtraImplicantPCNF(terms)
    } else {
        extra_implicants = checkExtraImplicantPDNF(terms)
    }
    if (extra_implicants.length === 1) {
        terms.splice(terms.indexOf(extra_implicants) - 1, 1)
    } else if (extra_implicants.length > 1) {
        let extra_implicant = findExtraImplicant(extra_implicants)
        if (extra_implicant !== undefined) {
            terms.splice(terms.indexOf(extra_implicant), 1)
        }
    }
    findEqualImplicants(terms)
    return terms
}

function outputMinFunctionPDNF(terms){
    let out = ''
    for (let i = 0; i < terms.length; i++) {
        if (i !== 0) {
            out += '|('
        } else out += '('
        for (let j = 0; j < terms[i].length; j++) {
            if (j !== 0) {
                out += '&'
            }
            out += terms[i][j]
            if (j === terms[i].length - 1) {
                out += ')'
            }
        }
    }
    return 'TDNF is ' + out
}

function outputMinFunctionPCNF(terms){
    let out = ''
    for (let i = 0; i < terms.length; i++) {
        if (i !== 0) {
            out += '&('
        } else out += '('
        for (let j = 0; j < terms[i].length; j++) {
            if (j !== 0) {
                out += '|'
            }
            out += terms[i][j]
            if (j === terms[i].length - 1) {
                out += ')'
            }
        }
    }
    return 'TCNF is ' + out
}

function calculateMinTerms(PDNF_PCNF) {
    let copy_of_PDNF_PCNF = this.copyPDNF_PCNF(PDNF_PCNF)

    let single_parts = []
    while (this.countVars(copy_of_PDNF_PCNF[0]) > 1) {
        let parts = []
        for (let i = 0; i < copy_of_PDNF_PCNF.length; i++) {
            this.check(i, parts, copy_of_PDNF_PCNF, single_parts)
        }
        copy_of_PDNF_PCNF = parts
        if (parts.length === 0) {
            break;
        }
    }
    let result = []
    for (let i = 0; i < copy_of_PDNF_PCNF.length; i++) {
        if (!this.isEqual(result, copy_of_PDNF_PCNF[i])) {
            result.push(copy_of_PDNF_PCNF[i])
        }
    }
    for (let i = 0; i < single_parts.length; i++) {
        result.push(single_parts[i])
    }
    return result
}

function countVars(term) {
    let sch = 0
    for (let variable of term) {
        if (variable !== "-") {
            sch++
        }
    }
    return sch
}

function copyPDNF_PCNF(PDNF_PCNF) {
    let copy = []
    for (let i = 0; i < PDNF_PCNF.length; i++) {
        copy.push([...PDNF_PCNF[i]])
    }
    return copy
}

function isEqual(result, part_of_PDNF) {
    let chk
    if (result.length === 0) {
        return false
    }
    for (let i = 0; i < result.length; i++) {
        chk = true
        for (let j = 0; j < result[i].length; j++) {
            if (result[i][j] !== part_of_PDNF[j]) {
                chk = false
            }
        }
        if (chk) {
            return true
        }
    }
    return false
}

function check(index, result, reduce_parts, single_parts) {
    let neighbours = false
    for (let i = 0; i < reduce_parts.length; i++) {
        if (this.comparing(reduce_parts[index], reduce_parts[i]) && index !== i) {
            let reducedCombination = []
            for (let variable of reduce_parts[index]) {
                if (reduce_parts[i].includes(variable)) {
                    reducedCombination.push(variable)
                } else {
                    reducedCombination.push('-')
                }
            }
            if (countVars(reducedCombination) === countVars(reduce_parts[index]) - 1) {
                if (!isEqual(result, reducedCombination)) {
                    result.push(reducedCombination)
                }
                neighbours = true
            }
        }
    }
    if (!neighbours && !isEqual(single_parts, reduce_parts[index])) {
        single_parts.push(reduce_parts[index])
    }
}

function QuineMcClusckyMethod(terms, expression) {
    let extra_implicants
    let variant = defineFunction(expression)
    if (variant === 'PCNF') {
        extra_implicants = checkExtraImplicantPCNF(terms)
    } else {
        extra_implicants = checkExtraImplicantPDNF(terms)
    }
    if (extra_implicants.length === 1) {
        terms.splice(terms.indexOf(extra_implicants) - 1, 1)
    } else if (extra_implicants.length > 1) {
        let extra_implicant = findExtraImplicant(extra_implicants)
        if (extra_implicant !== undefined) {
            terms.splice(terms.indexOf(extra_implicant), 1)
        }
    }
    findEqualImplicants(terms)
    return terms
}

function comparing(first_term, second_term) {
    let count = 0
    for (let i = 0; i < first_term.length; i++) {
        if (first_term[i] === second_term[i]) {
        } else if (!first_term[i].includes(second_term[i]) && !second_term[i].includes(first_term[i])) {
            return false
        } else {
            count++
            if (count > 1) {
                return false
            }
        }
    }
    return true
}

function buildQuineTable(PDNF_PCNF) {
    let table = []
    let reducedTerms = calculateMinTerms(PDNF_PCNF)
    let fullTerms = copyPDNF_PCNF(PDNF_PCNF)
    for (let i = 0; i < reducedTerms.length; i++) {
        let row = []
        for (let j = 0; j < fullTerms.length; j++) {
            row.push(isContain(reducedTerms[i], fullTerms[j]))
        }
        table.push(row)
    }
    return table
}

function isContain(reducedTerms, fullTerms) {
    for (let i = 0; i < fullTerms.length; i++) {
        if (reducedTerms[i] !== fullTerms[i] && reducedTerms[i] !== '-') {
            return false
        }
    }
    return true
}


function getTerms(PDNF_PCNF) {
    let coreTerms = []
    let table = buildQuineTable(PDNF_PCNF)
    let reducedTerms = calculateMinTerms(PDNF_PCNF)
    for (let i = 0; i < table[0].length; i++) {
        let count = 0, index = 0
        for (let j = 0; j < table.length; j++) {
            if (table[j][i]) {
                count++
                index = j
            }
        }
        if (count === 1 && !isEqual(coreTerms, reducedTerms[index])) {
            coreTerms.push([reducedTerms[index]])
        }
    }
    return this.minimizeCoreTerms(coreTerms)
}

function getStringSDNF(PDNF_PCNF) {
    let terms = getTerms(PDNF_PCNF)
    let strTerms = []
}

function minimizeCoreTerms(coreTerms) {
    let minimizedCoreTerms = []
    for (let term of coreTerms) {
        if (!this.checkArrayIncludeArray(minimizedCoreTerms, term)) {
            minimizedCoreTerms.push(term)
        }
    }
    return minimizedCoreTerms
}

function checkArrayIncludeArray(chosenArray, checkedArray) {
    for (let i = 0; i < chosenArray.length; i++) {
        if (this.compareArrays(chosenArray[i], checkedArray)) {
            return true
        }
    }
    return false
}

function compareFunctions(function1, function2) {
    let count = 0
    for (let i = 0; i < function2.length; i++) {
        if (func[i] === function2[i]) {
            count++
        }
    }
    let res = count === function2.length
    return res
}

function initKarnaughTable(table, mode) {
    let count_rows = Math.floor(table[0].length / 2)
    let count_columns = (table[0].length - count_rows) * 2
    count_rows *= 2
    let karnaughTable = []
    for (let i = 0; i < count_rows; i++) {
        let row = []
        for (let j = 0; j < count_columns; j++) {
            if (mode === 'PCNF') {
                row.push(1)
            } else
                row.push(0)
        }
        karnaughTable.push(row)
    }
    return karnaughTable
}

function modePCNF(table, karnaughTable) {
    for (let i = 0; i < table.length; i++) {
        if (table[i][0].includes('!')) {
            if (table[i][1].includes('!')) {
                if (table[i][2].includes('!')) {
                    karnaughTable[1][0] = 0
                } else {
                    karnaughTable[1][1] = 0
                }
            } else {
                if (table[i][2].includes('!')) {
                    karnaughTable[1][3] = 0
                } else {
                    karnaughTable[1][2] = 0
                }
            }
        } else {
            if (table[i][1].includes('!')) {
                if (table[i][2].includes('!')) {
                    karnaughTable[0][0] = 0
                } else {
                    karnaughTable[0][1] = 0
                }
            } else {
                if (table[i][2].includes('!')) {
                    karnaughTable[0][3] = 0
                } else {
                    karnaughTable[0][2] = 0
                }
            }
        }
    }
}

function modePDNF(table, karnaughTable) {
    for (let i = 0; i < table.length; i++) {
        if (!table[i][0].includes('!')) {
            if (!table[i][1].includes('!')) {
                if (!table[i][2].includes('!')) {
                    karnaughTable[0][2] = 1
                } else {
                    karnaughTable[0][3] = 1
                }
            } else {
                if (!table[i][2].includes('!')) {
                    karnaughTable[0][1] = 1
                } else {
                    karnaughTable[0][0] = 1
                }
            }
        } else {
            if (!table[i][1].includes('!')) {
                if (!table[i][2].includes('!')) {
                    karnaughTable[1][2] = 1
                } else {
                    karnaughTable[1][3] = 1
                }
            } else {
                if (!table[i][2].includes('!')) {
                    karnaughTable[1][1] = 1
                } else {
                    karnaughTable[1][0] = 1
                }
            }
        }
    }
}

function buildKarnaughTable(table, mode) {
    let karnaughTable = initKarnaughTable(table, mode)
    if (mode === 'PCNF') {
        modePCNF(table, karnaughTable)
    } else {
        modePDNF(table, karnaughTable)
    }
    return karnaughTable
}

function outputKarnaughTable(karnaughTable) {
    console.log('Karnaugh map is: ')
    for (let i = 0; i < karnaughTable.length; i++) {
        let row = karnaughTable[i].join(' ')
        console.log(row)
    }
}

function KarnaughMapMethod(terms, expression, table, mode) {
    karnaughTable = buildKarnaughTable(table, mode)
    outputKarnaughTable(karnaughTable)
    let extra_implicants
    let variant = defineFunction(expression)
    if (variant === 'PCNF') {
        extra_implicants = checkExtraImplicantPCNF(terms)
    } else {
        extra_implicants = checkExtraImplicantPDNF(terms)
    }
    if (extra_implicants.length === 1) {
        terms.splice(terms.indexOf(extra_implicants) - 1, 1)
    } else if (extra_implicants.length > 1) {
        let extra_implicant = findExtraImplicant(extra_implicants)
        if (extra_implicant !== undefined) {
            terms.splice(terms.indexOf(extra_implicant), 1)
        }
    }
    findEqualImplicants(terms)
    return terms
}

/* ____TESTS____
    PDNF
    (!x1&!x2&x3)|(!x1&x2&!x3)|(!x1&x2&x3)|(x1&x2&!x3)
    (!x1&x2&x3&!x4)|(x1&x2&x3&!x4)
    (!x1&x2&x3&!x4)|(x1&x2&x3&!x4)|(!x1&x2&x3)|(!x1&!x2&x3)
    (!x1&x2&x3&!x4)|(x1&x2&x3&!x4)|(!x1&x2)|(!x2&x3&!x4)
    (!x1&!x2&!x3)|(!x1&!x2&x3)|(!x1&x2&!x3)|(x1&x2&!x3)|(x1&x2&x3)

    PCNF
    (x1|x2|x3)&(!x1|x2|x3)&(!x1|x2|!x3)&(!x1|!x2|!x3)
    (!x1|!x2|!x3)&(!x1|!x2|x3)&(!x1|x2|!x3)&(x1|x2|!x3)&(x1|x2|x3)
    (x1|x2|x3|x4)&(x1|!x2|x3|x4)&(x1|!x2|!x3|x4)&(!x1|x2|x3|x4)&(!x1|!x2|x3|x4)&(!x1|!x2|!x3|x4)

*/

function outputMinFunctionsPCNF(result1, result2, result3) {
    console.log(`Result of calculation method is: ${outputMinFunctionPCNF(result1)}`)
    console.log(`Result of Quine-McCluscky method is: ${outputMinFunctionPCNF(result2)}`)
    console.log(`Result of Karnaugh method is: ${outputMinFunctionPCNF(result3)}`)
}

function outputMinFunctionsPDNF(result1, result2, result3) {
    console.log(`Result of calculation method is: ${outputMinFunctionPDNF(result1)}`)
    console.log(`Result of Quine-McCluscky method is: ${outputMinFunctionPDNF(result2)}`)
    console.log(`Result of Karnaugh method is: ${outputMinFunctionPDNF(result3)}`)
}

function minimization(expression) {
    let mode = defineFunction(expression)
    let table = buildTable(expression)
    let terms = pastingTerms(table)
    let result_CM = calculationMethod(JSON.parse(JSON.stringify(terms)), JSON.parse(JSON.stringify(expression)))
    let result_QM = QuineMcClusckyMethod(JSON.parse(JSON.stringify(terms)), JSON.parse(JSON.stringify(expression)))
    let result_KM = KarnaughMapMethod(JSON.parse(JSON.stringify(terms)), JSON.parse(JSON.stringify(expression)), table, mode)
    if (defineFunction(expression) === 'PCNF') {
       outputMinFunctionsPCNF(result_CM, result_QM, result_KM)
    } else
        outputMinFunctionsPDNF(result_CM, result_QM, result_KM)
    return result_CM
}

function main() {
    /*Входные функции ялвяются уже СДНФ либо СКНФ, т.е их достаточно минимизировать*/
    let input = '(x1|x2|!x3)&(!x1|x2|!x3)'
    console.log(`Input: ${input}`)
    input = deleteSpaces(input)
    let expression = []
    expression = decomposition(input, expression)
    pasteTogether(expression)
    minimization(expression)
}

main()