//setup
	let log = console.log;
	log("BufordJS sucessfully applied");

//content
	var bu = {
        bot: {
            alge: function (string) {
                //5a = 20
                let evalStr = function (eStr_str) {
                    return Function("return " + eStr_str)();
                };
                
                //find a
                let locA = 0;
                while (locA < string.length && string.charAt(locA) !== 'a') {
                    locA++;
                }
                log("@ a: " + locA);
                
                //find =
                let locE = 0;
                while (string.charAt(locE) !== '=') {
                    locE++;
                }
                log("@ =: " + locE);
                
                if (locA < 1 || string.charAt(locA - 1) === ' ') {
                    
                } else {
                    //find # before a
                    let multUnit = '';
                    for (let i = locA - 1; i > -1 && string.charAt(i) !== ' '; i--) {
                        multUnit = string.charAt(i) + multUnit;
                    }
                    log("# before a: " + multUnit);

                    //find # after =
                    let afterEq = '';
                    for (let i = locE + 2; i < string.length; i++) {
                        afterEq = afterEq + string.charAt(i);
                    }
                    afterEq = evalStr(afterEq);
                    log("# after =: " +  afterEq);

                    return afterEq / multUnit;
                }
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
	}
	
