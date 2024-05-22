#include <iostream>
#include <string>
using namespace std;

int SIZE_OF_MANTISSA = 23;
int SIZE_OF_EXPONENT = 8;
int SHIFT_OF_EXPONENT = 127;

//Представляет двоичное число в обратном коде
string reverseCode(string value) {
    string result = "";
    char sign = value[0];
    value.erase(0, 1);
    for (int i = 0; i < value.size(); i++) {
        if (value[i] == '1') {
            result.push_back('0');
        }
        else if (value[i] == '0') {
            result.push_back('1');
        }
        else {
            result.push_back('.');
        }
    }
    result = sign + result;
    return result;
}

//Переводит из двоичного числа в целое
int binToInt(string value) {
    int result = 0;
    for (int i = 1; i < value.size(); i++) {
        if (value[i] == '1') {
            result += pow(2, value.size() - i - 1);
        }
    }
    if (value[0] == '1') {
        result = 0 - result;
    }
    return result;
}

//Переводит из целого числа в двоичное
string intToBin(int value) {
    string result = "";
    string sign = "0";
    if (value < 0) {
        sign = "1";
    }
    while (fabs(value) >= 1) {
        if (value % 2 == 0) {
            result = "0" + result;
        }
        else {
            result = "1" + result;
        }
        value = value / 2;
    }
    result = sign + result;
    return result;
}

//Вычисляет большее значение длины строки
bool maxLength(string value1, string value2) {
    if (value1.size() > value2.size()) {
        return true;
    }
    else {
        return false;
    }
}

//Дополняет меньшее по кол-ву знаков до большего по кол-ву знаков числу
void addition(string& value1, string& value2) {
    char sign1 = value1[0], sign2 = value2[0];
    value1.erase(0, 1);
    value2.erase(0, 1);
    if (maxLength(value1, value2)) {
        while (value2.size() != value1.size()) {
            value2 = "0" + value2;
        }
    }
    else {
        while (value2.size() != value1.size()) {
            value1 = "0" + value1;
        }
    }
    value1 = sign1 + value1;
    value2 = sign2 + value2;
}

//Проверяет знаки двух двоичных чисел в выражении для правильного резулатьта
void checkSum(string& value1, string& value2) {
    if (value1[0] == '1') {
        value1 = reverseCode(value1);
    }
    if (value2[0] == '1') {
        value2 = reverseCode(value2);
    }
}

//Проверяет знак для правильности результата
char checkSign(string value1, string value2) {
    char result = value2[0];
    int int_value1 = binToInt(value1);
    int int_value2 = binToInt(value2);
    if (fabs(int_value1) >= fabs(int_value2)) {
        result = value1[0];
    }
    return result;
}

//Сравнивает два двоичных числа в сумме
string compare(string value1, string value2, char& rem) {
    string result = "";
    for (int i = 0; i < value1.size(); i++) {
        if (value1[value1.size() - 1 - i] == value2[value2.size() - 1 - i]) {
            if (value1[value1.size() - 1 - i] == '1') {
                if (rem == '0') {
                    result = "0" + result;
                    rem = '1';
                }
                else {
                    result = "1" + result;
                }
            }
            else {
                if (rem == '1') {
                    result = "1" + result;
                    rem = '0';
                }
                else {
                    result = "0" + result;
                }
            }
        }
        else if (value1[value1.size() - 1 - i] != value2[value2.size() - 1 - i]) {
            if (rem == '1') {
                result = "0" + result;
            }
            else {
                result = "1" + result;
            }
        }
    }
    return result;
}

//Сумма двух двоичных чисел
string sum(string value1, string value2) {
    string result = "";
    char sign = checkSign(value1, value2);
    addition(value1, value2);
    checkSum(value1, value2);
    char rem = '0';
    result = compare(value1, value2, rem);
    if (rem == '1') {
        string remainder = "01";
        addition(result, remainder);
        result = compare(result, remainder, rem = '0');
    }
    if (sign == '1') {
        result = '1' + result;
        result = reverseCode(result);
    }
    else {
        result = '0' + result;
    }
    return result;
}

//Делает из положительного числа отрицательное
void checkDiff(string& value2) {
    if (value2[0] == '0') {
        value2[0] = '1';
    }
    else {
        value2[0] = '0';
    }
}

//Разнoсть двух чисел
string diff(string value1, string value2) {
    string result = "";
    addition(value1, value2);
    if (value1 == value2) {
        return result = "00";
    }
    checkDiff(value2);
    result = sum(value1, value2);
    return result;
}

//Представляет двоичное число в дополнительном коде
string additionalCode(string value) {
    string result = reverseCode(value);
    result = sum(result, "01");
    return result;
}

//Проверяет знак для правильного результата в умножении двух чисел
char checkSignRes(string value1, string value2) {
    char result = '0';
    if ((value1[0] == '1' && value2[0] != '1') || (value1[0] != '1' && value2[0] == '1')) {
        result = '1';
    }
    return result;
}

//Умножение двочных чисел
string comp(string value1, string value2) {
    string result = "0", unsigned_result = "";
    addition(value1, value2);
    char sign = checkSignRes(value1, value2);
    value1.erase(0, 1);
    value2.erase(0, 1);
    for (int i = value2.size() - 1; i >= 0; i--) {
        for (int j = value1.size() - 1; j >= 0; j--) {
            if ((value1[j] == value2[i]) && (value2[i] == '1')) {
                unsigned_result = "1" + unsigned_result;
            }
            else {
                unsigned_result = "0" + unsigned_result;
            }
        }
        for (int k = 0; k < value2.size() - 1 - i; k++) {
            unsigned_result.push_back('0');
        }
        result = sum("0" + result, "0" + unsigned_result);
        unsigned_result = "";
    }
    result = sign + result;
    return result;
}

//Деление двоичных чисел без восстановления остатка
int div(string value1, string value2) {
    int result = 0, int_value1 = fabs(binToInt(value1)), int_value2 = fabs(binToInt(value2));
    char sign = checkSignRes(value1, value2);
    value1[0] = value2[0] = '0';
    while (int_value1 >= int_value2) {
        value1 = diff(value1, value2);
        int_value1 = binToInt(value1);
        result++;
    }
    if (sign == '1') {
        result = 0 - result;
    }
    return result;
}

//Находит знак мантиссы
void findSignMantissa(double number, string& value) {
    (number < 0) ? value.push_back('1') : value.push_back('0');
}

//Находит верхнюю и нижнюю границы числа в мантиссе
void findLowerUpperLimits(double number, int& lower_limit, int& upper_limit) {
    for (int i = -50; i < number; i++) {
        if (pow(2, i) > number) {
            upper_limit = i;
            break;
        }
    }
    for (int i = upper_limit - 1; i >= -100; i--) {
        if (pow(2, i) <= number) {
            lower_limit = i;
            break;
        }
    }
}

//Формула для перевода в мантиссу
double formuleInMantissa(double number, int lower_limit, int upper_limit) {
    return (number - pow(2, lower_limit)) / (pow(2, upper_limit) - pow(2, lower_limit));
}

//Находит порядок числа
void findExponentNumber(string& exponent, int lower_limit) {
    int E = lower_limit + SHIFT_OF_EXPONENT;
    exponent = intToBin(E).erase(0, 1);
    while (exponent.size() < SIZE_OF_EXPONENT) {
        exponent = "0" + exponent;
    }
}

//Находит мантиссу числа
void findMantissaNumber(string& mantissa, string exponent, double formule) {
    int M = pow(2, SIZE_OF_MANTISSA) * formule;
    mantissa = intToBin(M).erase(0, 1);
}

//Представляет число в виде числа с плавающей точкой
string doubleToBin(double number) {
    string result = ""
        , exponent = ""
        , mantissa = "";
    findSignMantissa(number, result);
    int lower_limit = 0
        , upper_limit = 1;
    findLowerUpperLimits(number, lower_limit, upper_limit);
    double formule = formuleInMantissa(fabs(number), lower_limit, upper_limit);
    findExponentNumber(exponent, lower_limit);
    findMantissaNumber(mantissa, exponent, formule);
    while (mantissa.length() != SIZE_OF_MANTISSA) {
        mantissa = '0' + mantissa;
    }
    result += exponent + mantissa;
    return result;
}

//Заполняет экспоненту
void fillExponent(string value, string& exponent) {
    for (int i = 1; i <= SIZE_OF_EXPONENT; i++) {
        exponent.push_back(value[i]);
    }
}

//Заполняет мантиссу
void fillMantissa(string value, string& mantissa) {
    for (int i = SIZE_OF_EXPONENT + 1; i < value.length(); i++) {
        mantissa.push_back(value[i]);
    }
}

//Находит знак числа с плавающей точкой
double findInSign(string value) {
    return pow((-1), int(value[0]));
}

//Формула для нахождения числа с плавающей точкой
double formuleFromMantissa(double s, int E, int M) {
    return s * pow(2, (E - SHIFT_OF_EXPONENT)) * (1 + M / (pow(2, SIZE_OF_MANTISSA)));
}

//Переводит число из двоичного в число с плавающей точкой
double binToDouble(string value) {
    string exponent = "0"
        , mantissa = "0";
    fillExponent(value, exponent);
    fillMantissa(value, mantissa);
    int E = binToInt(exponent)
        , M = binToInt(mantissa);
    return formuleFromMantissa(findInSign(value), E, M);
}

//Выполняет сдвиги в мантиссах
void shift(string& exponent1, string& exponent2, string& mantissa1, string& mantissa2) {
    int difference = binToInt("0" + exponent1) - binToInt("0" + exponent2);
    if (difference < 0) {
        mantissa1.erase(1, 1);
        mantissa2.erase(1, 1);
        exponent1 = exponent2;
        for (int i = 0; i < fabs(difference) - 1; i++) {
            mantissa1 = "0" + mantissa1;
            mantissa2.push_back('0');
        }
        mantissa1 = "0." + mantissa1;
        mantissa2.erase(0, 1);
        mantissa2 = "1." + mantissa2 + "0";
    }
    else if(difference > 0) {
        mantissa1.erase(1, 1);
        mantissa2.erase(1, 1);
        exponent2 = exponent1;
        for (int i = 0; i < fabs(difference) - 1; i++) {
            mantissa2 = "0" + mantissa2;
            mantissa1.push_back('0');
        }
        mantissa2 = "0." + mantissa2;
        mantissa1.erase(0, 1);
        mantissa1 = "1." + mantissa1 + "0";
    }
}

//Добавляет единицу в начало
void pushOne(string& mantissa1, string& mantissa2) {
    mantissa1 = "1." + mantissa1;
    mantissa2 = "1." + mantissa2;
}

//Сравнение символов для чисел с плавающей точкой
string compareDouble(string value1, string value2, char& rem) {
    string result = "";
    for (int i = 0; i < value1.size(); i++) {
        if (value1[value1.size() - 1 - i] == value2[value2.size() - 1 - i]) {
            if (value1[value1.size() - 1 - i] == '1') {
                if (rem == '0') {
                    result = "0" + result;
                    rem = '1';
                }
                else {
                    result = "1" + result;
                }
            }
            else if (value1[value1.size() - 1 - i] == '0') {
                if (rem == '1') {
                    result = "1" + result;
                    rem = '0';
                }
                else {
                    result = "0" + result;
                }
            }
            else if (value1[value1.size() - 1 - i] == '.') {
                result = "." + result;
            }
        }
        else if (value1[value1.size() - 1 - i] != value2[value2.size() - 1 - i]) {
            if (rem == '1') {
                result = "0" + result;
            }
            else {
                result = "1" + result;
            }
        }
    }
    return result;
}

//Проверка для остатка равного единице
void checkRem(string &value, string &exponent, char& rem) {
    if (rem == '1') {
        value = '1' + value;
        exponent = sum("0" + exponent, "01");
        while (exponent.size() != SIZE_OF_EXPONENT) {
            exponent.erase(0, 1);
        }
        rem = value[1];
    }
}

//Блок кода, если точка встречается раньше единицы
void dotBeforeOne(string &value, string& exponent, int index_dot) {
    int shift = 0;
    value.erase(index_dot, 1);
    while (value[0] != '1') {
        value.erase(0, 1);
        shift++;
    }
    value.erase(0, 1);
    while (value.size() != SIZE_OF_MANTISSA) {
        value.push_back('0');
    }
    exponent = sum("0" + exponent, intToBin(shift)).erase(0, 1);
}

//Блок кода, если точка встречается после единицы
void dotAfterOne(string& value, string& exponent, int index_one, int index_dot) {
    if (index_dot - index_one == 2) {
        exponent = sum("0" + exponent, "01");
        while (exponent.size() != SIZE_OF_EXPONENT) {
            exponent.erase(0, 1);
        }
    }
    value.erase(index_dot, 1);
    value.erase(0, 1);
}

//Преобразования после суммы двух чисел с плавающей точкой
void transformations(string &value, string &exponent, char rem) {
    if (rem == '1') {
        value = rem + value;
    }
    char one = '1', dot = '.';
    int index_one = value.find(one);  
    int index_dot = value.find(dot); 
    if (index_one - index_dot > 0) { 
        dotBeforeOne(value, exponent, index_dot);
    }
    else {                             
        dotAfterOne(value, exponent, index_one, index_dot);
    }
    while (value.size() != SIZE_OF_MANTISSA) {
        value.erase(value.size() - 1, 1);
    }
}

//Сумма мантисс
string sumDoubleNumbers(string value1, string value2) {
    string result = ""
        , exponent1 = ""
        , exponent2 = ""
        , mantissa1 = ""
        , mantissa2 = "";
    char rem = '0';
    fillExponent(value1, exponent1);
    fillExponent(value2, exponent2);
    fillMantissa(value1, mantissa1);
    fillMantissa(value2, mantissa2);
    pushOne(mantissa1, mantissa2);
    shift(exponent1, exponent2, mantissa1, mantissa2);
    result = compareDouble(mantissa1, mantissa2, rem);
    transformations(result, exponent1, rem);
    result = value1[0] + exponent1 + result;
    return result;
}

void menuList() {
    system("cls");
    cout << "Choose variant" << endl;
    cout << "(1)Input integer numbers" << endl;
    cout << "(2)Summa of integer numbers" << endl;
    cout << "(3)Difference of integer numbers" << endl;
    cout << "(4)Composition of numbers" << endl;
    cout << "(5)Division of numbers" << endl;
    cout << "(6)Input double numbers" << endl;
    cout << "(7)Summa of double numbers" << endl;
    cout << "(0)Exit the program" << endl;
}

int menuChooseVariant() {
    int variant = 0;
    menuList();
    cin >> variant;
    return variant;
}

void menu(int& a, int& b, double& c, double& d) {
    while (true) {
        switch (menuChooseVariant()) {
        case 1:
            cin >> a >> b;
            break;

        case 2:
            cout << sum(intToBin(a), intToBin(b)) << endl;
            cout << binToInt(sum(intToBin(a), intToBin(b))) << endl;
            system("pause");
            break;

        case 3:
            cout << diff(intToBin(a), intToBin(b)) << endl;
            cout << binToInt(diff(intToBin(a), intToBin(b))) << endl;
            system("pause");
            break;

        case 4:
            cout << comp(intToBin(a), intToBin(b)) << endl;
            cout << binToInt(comp(intToBin(a), intToBin(b))) << endl;
            system("pause");
            break;

        case 5:
            cout << div(intToBin(a), intToBin(b)) << endl;
            system("pause");
            break;

        case 6:
            cin >> c >> d;
            break;

        case 7:
            cout << sumDoubleNumbers(doubleToBin(c), doubleToBin(d)) << endl;
            cout << binToDouble(sumDoubleNumbers(doubleToBin(c), doubleToBin(d))) << endl;
            system("pause");
            break;

        case 0:
            cout << "---------Exiting the program---------" << endl;
            return;
        }
    }
}

int main() {
    int a = 0, b = 1;
    double c = 0.0, d = 0.0;
    cout << intToBin(a) << endl << intToBin(b);
    //menu(a, b, c, d);
}