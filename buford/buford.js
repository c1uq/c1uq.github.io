

//content
	var bu = {
        bot: {
            alge: function (string, doDebug) {
                //setup
                let data = {};
                data.phase2 = false;
                
                const lockObj = bu.code.lockObj;
                function deb(title, ...args) {
                    let parentFuntion = "bu.bot.alge"
                    if (doDebug) {
                        for (let i = 0; i < args.length; i++) {
                            //setTimeout(() => {
                                console.log("%cDEBUG|%c|" + parentFuntion + "|%c|" + title + ":", "color: #ff0000", "color:#079127", "color:#2c9c90", args[i]);
                            //});
                        }
                    }
                }
                
                
                let ans = string;
                //===========================================================================
                //---------------------------------------------------------------------------preset
                //===========================================================================
                let phase = [];
                
                function presolve() { //--------------------------------presolve
                    deb("presolve", "PRESOLVE");
                    
                    
                    
                    //setup
                    function changeVariableToA (str) { //--------------------------------changeVaribleToA
                        const letters = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "s", "d", "f", "g", "h", "j", "k", "l", "z", "x", "c", "v", "b", "n", "m"];
                        let retr = str;
                        for (let i = 0; i < str.length; i++) {
                            if (letters.includes(str.charAt(i))) {
                                retr = retr.substr(0, i) + 'a' + retr.substr(i + 1, retr.length);
                            }
                        }

                        deb("changeVariableToA", retr);
                        return retr;
                    }
                    ans = changeVariableToA(ans);
                    
                    function removeWhitespace (str) { //--------------------------------removeWhitespace
                        let build = "";
                        for (let i = 0; i < str.length; i++) {
                            if (str.charAt(i) !== ' ') {
                                build = build + str.charAt(i);
                            }
                        }
                        return build;
                    }
                    ans = removeWhitespace(ans);
                    
                    
                    
                    //errors
                    let clear = true;
                    let errorMessage = "Error";
                    let type = 1;
                    
                    
                    function findVariable() { //--------------------------------findVariable
                        let found = false;
                        for (let i = 0; i < ans.length; i++) {
                            if (ans.charAt(i) === 'a') {
                                found = true;
                            }
                        }
                        
                        if (!(found)) {
                            clear = false;
                            errorMessage = "Equation must have variable";
                        }
                        deb("findVariable", clear);
                    } findVariable();
                    
                    function findEqualsAndDetectValidExpressions() { //--------------------------------findEqualsAndDetectValidExpressions
                        let found = false;
                        let location;
                        for (let i = 0; i < ans.length; i++) {
                            if (ans.charAt(i) === '=') {
                                found = true;
                                location = i;
                            }
                        }
                        
                        if (!(found)) {
                            clear = false;
                            errorMessage = "Equation must have an equal sign";
                        }
                        deb("findEqualsAndDetectValidExpressions//equals", clear);
                        
                        found = false;
                        let found2 = false;
                        let exp1 = ' ' + ans.substr(0, location);
                        let exp2 = ' ' + ans.substr(location + 1, ans.length);
                        const acceptableValues = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a'];
                        for (let i = 0; i < exp1.length; i++) {
                            if (acceptableValues.includes(exp1.charAt(i))) {
                                found = true;
                            }
                        }
                        for (let i = 0; i < exp2.length; i++) {
                            if (acceptableValues.includes(exp2.charAt(i))) {
                                found2 = true;
                            }
                        }
                        
                        if (!(found && found2)) {
                            clear = false;
                            errorMessage = "Malformed equation";
                        }
                        deb("findEqualsAndDetectValidExpressions//validExp", clear);
                    } findEqualsAndDetectValidExpressions();
                    
                    function detectInvalidVariable () {
                        for (let i = 0; i < ans.length - 1; i++) {
                            if (ans.charAt(i) === 'a' && ans.charAt(i + 1) === 'a') {
                                clear = false;
                                errorMessage = "Malformed variable";
                            }
                        }
                        deb("detectInvalidVariable", clear);
                    } detectInvalidVariable();
                    
                    
                    initType1();
                    //console.log(phase1);
                    if (clear) {
                        phase1();
                    } else {
                        ans = undefined;
                        console.error(errorMessage);
                    }
                }
                
                
                //===========================================================================
                //---------------------------------------------------------------------------phase1
                //===========================================================================
                
                
                function createAddArray(stringExpression) { //--------------------------------createAddArray
                    let str = stringExpression;
                    let arr = [];
                    let build = "";
                    
                    let paren = 0;
                    for (let i = 0; i < str.length; i++) {
                        if (str.charAt(i) === '+' && paren === 0) {
                            if (build.length > 0) {
                                arr.push(build);
                            }
                            build = "";
                        } else if (str.charAt(i) === '-' && paren === 0) {
                            if (build.length > 0) {
                                arr.push(build);
                            }
                            build = "-";
                        } else if (str.charAt(i) === '(') {
                            paren++;
                            build = build + str.charAt(i);
                        } else if (str.charAt(i) === ')') {
                            paren--;
                            build = build + str.charAt(i);
                        } else if (str.charAt(i) !== ' ') {
                            build = build + str.charAt(i);
                        }
                    }
                    arr.push(build);
                    build = "";
                    
                    //deb("createAddArray", lockObj(arr));
                    return arr;
                }
                
                function separateEquation(equationString) { //--------------------------------separateEquation
                    let exp1;
                    let exp2;
                    let build = "";
                    for (let i = 0; i < equationString.length; i++) {
                        if (equationString.charAt(i) === '=') {
                            exp1 = createAddArray(build);
                            build = "";
                        } else {
                            build = build + equationString.charAt(i);
                        }
                    }
                    exp2 = createAddArray(build);
                    deb("separateEquation", lockObj([exp1, exp2]));
                    return [exp1, exp2];
                }
                
                let memoizedIn = [];
                let memoizedOut = [];
                function classify(stringNum) { //--------------------------------classify
                    if (memoizedIn.includes(stringNum)) {
                        let output = memoizedOut[memoizedIn.indexOf(stringNum)];
                        return output;
                    } else {
                        let constantChar = ['-', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
                        let variableChar = ['-', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a'];

                        let bools = [true, true];
                        for (let charNum = 0; charNum < stringNum.length; charNum++) {
                            let char = stringNum.charAt(charNum);
                            if (constantChar.includes(char)) {

                            } else if (variableChar.includes(char)) {
                                bools[0] = false;
                            } else {
                                bools[0] = false; bools[1] = false;
                            }
                        }
                        
                        let value;
                        if (bools[0] && bools[1]) {
                            value = 0;
                        } else if (bools[1]) {
                            value = 1;
                        } else {
                            data.phase2 = true;
                            value = 2;
                        }
                        
                        memoizedIn.push(stringNum);
                        memoizedOut.push(value);
                        return value;
                    }
                }
                
                function addPossible (addArray) { //--------------------------------addPossible
                    //---------classify
                    
                    let constant = [];
                    let variable = [];
                    
                    let returnAddArray = [];
                    
                    for (let arrNum = 0; arrNum < addArray.length; arrNum++) {
                        let type = classify(addArray[arrNum]);
                        if (type === 0) {
                            constant.push(addArray[arrNum]);
                        } else if (type === 1) {
                            variable.push(addArray[arrNum]);
                        } else {
                            returnAddArray.push(addArray[arrNum]);
                        }
                    }
                    
                    deb("addPossible//classifications", lockObj([constant, variable, returnAddArray]));
                    //-----------add
                    let sum = 0;
                    if (constant.length > 0) {
                        for (let i = 0; i < constant.length; i++) {
                            sum += parseFloat(constant[i]);
                        }
                        returnAddArray.push(sum + '');
                    }
                    
                    if (variable.length > 0) {
                        sum = 0;
                        for (let i = 0; i < variable.length; i++) {
                            if (isNaN(parseFloat(variable[i]))) {
                                if (variable[i].charAt(0) === '-') {
                                    sum += -1
                                } else {
                                    sum += 1
                                }
                            } else {
                                sum += parseFloat(variable[i]);
                            }
                        }
                        returnAddArray.push(sum + 'a');
                    }
                    
                    deb("addPossible", lockObj(returnAddArray));
                    return returnAddArray;
                }
                
                function setVariabledSide(eqArr) { //--------------------------------setVairabledSide
                    let returnArr = [];
                    //determineMovement --determine if movement needed
                    bools = [false, false];
                    let vars = [0, 0]; //position of removable var on both sides
                    for (let i = 0; i < eqArr[0].length; i++) { //1st side
                        if (classify(eqArr[0][i]) === 1) {
                            bools[0] = true;
                            vars[0] = i;
                        }
                    } 
                    for (let i = 0; i < eqArr[1].length; i++) { //2nd side
                        if (classify(eqArr[1][i]) === 1) {
                            bools[1] = true;
                            vars[1] = i;
                        }
                    }
                    deb("setVariabledSide//vars", lockObj(vars));
                    
                    if (bools[0] && bools[1]) { //remove variable
                        let removingVar = parseFloat(eqArr[1][vars[1]]);
                        let otherVar = parseFloat(eqArr[0][vars[0]]);
                        removingVar *= -1;
                        otherVar += removingVar;
                        
                        eqArr[0][vars[0]] = otherVar + 'a';
                        eqArr[1].splice(vars[1], 1);
                        if (eqArr[1].length < 1) {
                            eqArr[1].push(0);
                        }
                        returnArr = eqArr;
                    } else if (bools[1]) {      //flip sides
                        returnArr.push(eqArr[1]);
                        returnArr.push(eqArr[0]);
                    } else {
                        returnArr = eqArr;
                    }
                    
                    deb("setVariabledSide", lockObj(returnArr));
                    return returnArr;
                }
                
                function removeAddition(eqArr) { //--------------------------------removeAddition
                    let consts = [0, 0]
                    for (let i = 0; i < eqArr[0].length; i++) {
                        if (classify(eqArr[0][i]) === 0) {
                            consts[0] = i;
                        }
                    }
                    for (let i = 0; i < eqArr[1].length; i++) {
                        if (classify(eqArr[1][i]) === 0) {
                            consts[1] = i;
                        }
                    }
                    let constant = parseFloat(eqArr[0][consts[0]]);
                    eqArr[0].splice(consts[0], 1);
                    constant *= -1;
                    let sum = parseFloat(eqArr[1][consts[1]]) + constant;
                    eqArr[1][consts[1]] = sum + '';
                    
                    deb("removeAddition", lockObj(eqArr));
                    return eqArr;
                }
                
                function completeWithMult (eqArr) { //--------------------------------completeWithMult
                    deb("completeWithMult", parseFloat(eqArr[1][0]) / parseFloat(eqArr[0][0]));
                    return parseFloat(eqArr[1][0]) / parseFloat(eqArr[0][0]);
                }
                
                function checkForSpecialAnswers(ans) { //--------------------------------checkForSpecialAnswers
                    let retr = ans;
                    if (retr === Infinity) {
                        retr = "No Solution"
                    } else if (isNaN(retr)) {
                        retr = "Identity"
                    }
                    
                    deb("checkForSpecialAnswers", retr);
                    return retr;
                }
                
                
                //===========================================================================
                //---------------------------------------------------------------------------phase2
                //===========================================================================
                
                function detectDistributable(str) { //--------------------------------detectDistributable
                    retr = false;
                    if (
                        str.includes('(') &&
                        str.includes(')') &&
                        str.indexOf('(') > 0
                    ) {
                        retr = true;
                    }
                    return retr;
                }
                
                function distributeDistributable(addArr) { //--------------------------------distributeDistributable
                    let arr = addArr;
                    for (let arrayNum = 0; arrayNum < arr.length; arrayNum++) {
                        let str = arr[arrayNum];
                        let arrayAddition = [];
                        
                        if (detectDistributable(str)) {
                            let outside = str.substr(0, str.indexOf('('));
                            let insideStr = str.substr(str.indexOf('(') + 1, str.indexOf(')') - str.indexOf('(') - 1);
                            let inside = createAddArray(insideStr);
                            
                            if (inside[0] === 'a') {
                                inside[0] = '1a';
                            } else if (inside[0] === '-a') {
                                inside[0] = '-1a';
                            }
                            if (inside[1] === 'a') {
                                inside[1] = '1a';
                            } else if (inside[1] === '-a') {
                                inside[1] = '-1a';
                            }
                            
                            if (classify(inside[0]) === 0) {
                                arrayAddition.push(parseFloat(outside) * parseFloat(inside[0]) + '');
                            } else if (classify(inside[0]) === 1) {
                                arrayAddition.push(parseFloat(outside) * parseFloat(inside[0]) + 'a');
                            }
                            
                            if (classify(inside[1]) === 0) {
                                arrayAddition.push(parseFloat(outside) * parseFloat(inside[1]) + '');
                            } else if (classify(inside[1]) === 1) {
                                arrayAddition.push(parseFloat(outside) * parseFloat(inside[1]) + 'a');
                            }
                            
                            arr.splice(arrayNum, 1);
                            arr.push(arrayAddition[0]);
                            arr.push(arrayAddition[1]);
                        }
                        
                        deb("distributeDistribuatable", lockObj(arr));
                        return arr;
                    }
                    
                }
                
                //===========================================================================
                //---------------------------------------------------------------------------start
                //===========================================================================
                
                let phase1;
                let phase2;
                function initType1() {
                    phase1 = function(inArr) { //----------------------------------phase1
                        data.phase2 = false;

                        deb("phase1", "PHASE1");
                        if (!(inArr)) {
                            ans = separateEquation(ans);
                        }
                        ans[0] = addPossible(ans[0]);
                        ans[1] = addPossible(ans[1]);
                        ans = setVariabledSide(ans);
                        if (data.phase2) {
                            phase2();
                        } else {
                            if (ans[0].length > 1) {
                                ans = removeAddition(ans);
                            }
                            ans = completeWithMult(ans);
                            ans = checkForSpecialAnswers(ans);
                        }
                    }

                    phase2 = function() { //-----------------------------------phase2
                        deb("phase2", "PHASE2");

                        ans = [distributeDistributable(ans[0]), distributeDistributable(ans[1])];

                        phase1(true);
                    }
                }
                
                presolve();
                deb("return", ans);
                return ans;
            }
        },
		fraction: {
            simplify: function (whole, numerator, denominator) {
                bu.fraction.reduce();
            },
			impToMixed: function (numerator, denominator) {
				return [Math.floor(numerator / denominator), numerator % denominator, denominator];
			},
			mixedToImp: function (whole, numerator, denominator) {
				return [whole * denominator + numerator, denominator];
			},
			reduce: function (numerator, denominator) {
				let devi = bu.factor.GCF(numerator, denominator);
				let retr = [numerator / devi, denominator / devi];
				return [retr[0], retr[1]];
			},
			divide: function (dividendNumerator, dividendDenominator, divisorNumerator, divisorDenominator) {
				return bu.fraction.simplify(dividendNumerator * divisorDenominator, dividendDenominator * divisorNumerator);
			},
			toPercent: function (numerator, denominator) {
                return numerator / denominator * 100;
			}, 
			toDecimal: function (numerator, denominator) {
				return numerator / denominator;
			}
		},
		factor: {
			factor: function (num) {
				let factors = [1];
				let i = 2;
				while (i < num / 2 + 1) {
					if (num % i === 0) {
						factors.push(i);
					}
					i++;
				}
				factors.push(num);

				return factors;
			},
			isPrime: function (num) {
				return (bu.factor.factor(num).toString() === `1,${num}`)
			},
			primeFactor: function (num) {
				let tree = num;
				let primeF = [];
				while (bu.factor.isPrime(tree) === false) {
					let pushing = bu.factor.factor(tree)[1];
					primeF.push(pushing);
					tree = tree / pushing;
					log(tree);
				}
				primeF.push(tree)
				return primeF;
			}, 
			GCF: function (num1, num2) {
				let fac1 = bu.factor.factor(num1);
				let fac2 = bu.factor.factor(num2);
				let i = fac1.length - 1;
				let ii;
				let returnVal;
				while (i > 0 || fac1[i] === fac2[ii]) {
					ii = fac2.length - 1;
					while (ii > 0) {
						if (fac1[i] === fac2[ii]) {
							returnVal = fac1[i];
							return returnVal;
						}
						ii--;
					}
					i--;
				}
				if (returnVal === undefined) {
					returnVal = 1;
				}
				return returnVal;
			},
			LCM: function (num1, num2) {
				let num1f = [num1, num1 * 2];
				let num2f = [num2, num2 * 2];
				log(num1f, num2f);
			}
		},
		code: {
            keyArray: function () {
                let string = "[";
                document.body.addEventListener("keydown", function (e) {
                    if (e.repeat === false) {
                        string += '"' + e.key + '", ';
                        console.log(string);
                    } 
                });
            },
            lockObj: function (object) {
                return JSON.parse(JSON.stringify(object));
            },
			compress: function (code) {
				let aCode = bu.code.string.pullToArr(code);
				let retr = [];
				let i = 0;
				while (i < 17) {
					if (aCode[i] !== "↵") {
						log(i, aCode[i], aCode[i] !== "/r");
						retr.push(aCode[i]);
					} else {
						log("line");
					}
					i++;
				}
				return retr;
			},
			array: {
				mergeToStr: function (array) {
					let retr = "";
					let i = 0;
					while (i < array.length) {
						retr += array[i];
						i++;
					}
					return retr;
				},
				max: function (array) {
					let maxNum = array[0];
					let i = 1;
					while (array.length > i) {
						if (array[i] > maxNum) {
							maxNum = array[i];
						}
						i++;
					}
					return maxNum;
				},
				count: function (value, array) {
					let amount = 0;
					for (let i = 0; i < array.length; i++) { if (value === array[i]) {
						amount++;
					}}
					return amount;
				}
			},
			string: {
				pullToArr: function (string) {
					let i = 0;
					let retr = [];
					while ( i < string.length ) {
						retr.push(string.charAt(i));
						i++;
					}
					return retr;
				}
			},
		}
	};
	console.log("BufordJS successfully applied")
