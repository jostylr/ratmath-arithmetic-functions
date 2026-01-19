/**
 * Number Theory Functions
 * 
 * GCD, LCM, primes, factorization, modular arithmetic, combinatorics
 */

import { Integer, Rational } from "@ratmath/core";

/**
 * Extract BigInt value from Integer or number
 */
function toBigInt(val) {
    if (val instanceof Integer) return val.value;
    if (typeof val === 'bigint') return val;
    if (typeof val === 'number') return BigInt(Math.floor(val));
    if (val instanceof Rational) {
        if (val.denominator !== 1n) {
            throw new Error("Expected integer, got rational");
        }
        return val.numerator;
    }
    throw new Error(`Cannot convert ${typeof val} to integer`);
}

/**
 * GCD of two BigInts
 */
function gcdBigInt(a, b) {
    a = a < 0n ? -a : a;
    b = b < 0n ? -b : b;
    while (b !== 0n) {
        [a, b] = [b, a % b];
    }
    return a;
}

/**
 * LCM of two BigInts
 */
function lcmBigInt(a, b) {
    if (a === 0n || b === 0n) return 0n;
    a = a < 0n ? -a : a;
    b = b < 0n ? -b : b;
    return (a / gcdBigInt(a, b)) * b;
}

/**
 * Extended Euclidean algorithm
 * Returns [gcd, x, y] such that a*x + b*y = gcd
 */
function extGcdBigInt(a, b) {
    if (b === 0n) {
        return [a, 1n, 0n];
    }
    const [g, x1, y1] = extGcdBigInt(b, a % b);
    const x = y1;
    const y = x1 - (a / b) * y1;
    return [g, x, y];
}

/**
 * Modular exponentiation
 */
function modPowBigInt(base, exp, mod) {
    if (mod === 1n) return 0n;
    let result = 1n;
    base = ((base % mod) + mod) % mod;
    while (exp > 0n) {
        if (exp % 2n === 1n) {
            result = (result * base) % mod;
        }
        exp = exp / 2n;
        base = (base * base) % mod;
    }
    return result;
}

/**
 * Simple primality test (trial division for now)
 */
function isPrimeBigInt(n) {
    if (n < 2n) return false;
    if (n === 2n) return true;
    if (n % 2n === 0n) return false;
    if (n === 3n) return true;
    if (n % 3n === 0n) return false;
    
    let i = 5n;
    while (i * i <= n) {
        if (n % i === 0n || n % (i + 2n) === 0n) {
            return false;
        }
        i += 6n;
    }
    return true;
}

/**
 * Prime factorization
 */
function factorBigInt(n) {
    if (n < 0n) n = -n;
    if (n <= 1n) return [];
    
    const factors = [];
    
    while (n % 2n === 0n) {
        factors.push(2n);
        n = n / 2n;
    }
    
    let d = 3n;
    while (d * d <= n) {
        while (n % d === 0n) {
            factors.push(d);
            n = n / d;
        }
        d += 2n;
    }
    
    if (n > 1n) {
        factors.push(n);
    }
    
    return factors;
}

export const NumberTheory = {
    /**
     * GCD of multiple numbers
     */
    Gcd: {
        type: 'js',
        handler: function () {
            const allArgs = this._currentCallScope?.get("@@");
            if (!allArgs || allArgs.type !== 'sequence' || allArgs.values.length === 0) {
                throw new Error("Gcd requires at least one argument");
            }
            
            let result = toBigInt(allArgs.values[0]);
            for (let i = 1; i < allArgs.values.length; i++) {
                result = gcdBigInt(result, toBigInt(allArgs.values[i]));
            }
            return new Integer(result);
        },
        params: ["a", "b", "c?", "d?", "e?"],
        doc: "Greatest common divisor of the given integers"
    },

    /**
     * LCM of multiple numbers
     */
    Lcm: {
        type: 'js',
        handler: function () {
            const allArgs = this._currentCallScope?.get("@@");
            if (!allArgs || allArgs.type !== 'sequence' || allArgs.values.length === 0) {
                throw new Error("Lcm requires at least one argument");
            }
            
            let result = toBigInt(allArgs.values[0]);
            for (let i = 1; i < allArgs.values.length; i++) {
                result = lcmBigInt(result, toBigInt(allArgs.values[i]));
            }
            return new Integer(result);
        },
        params: ["a", "b", "c?", "d?", "e?"],
        doc: "Least common multiple of the given integers"
    },

    /**
     * Extended Euclidean algorithm
     */
    ExtGcd: {
        type: 'js',
        handler: function (a, b) {
            const [g, x, y] = extGcdBigInt(toBigInt(a), toBigInt(b));
            return {
                type: 'sequence',
                values: [new Integer(g), new Integer(x), new Integer(y)],
                lastValue: new Integer(y)
            };
        },
        params: ["a", "b"],
        doc: "Returns {gcd, x, y} such that a*x + b*y = gcd"
    },

    /**
     * Divides test
     */
    Divides: {
        type: 'js',
        handler: function (a, b) {
            const aVal = toBigInt(a);
            const bVal = toBigInt(b);
            if (aVal === 0n) return new Integer(bVal === 0n ? 1n : 0n);
            return new Integer(bVal % aVal === 0n ? 1n : 0n);
        },
        params: ["a", "b"],
        doc: "Returns 1 if a divides b, 0 otherwise"
    },

    /**
     * Modulo (always non-negative)
     */
    Mod: {
        type: 'js',
        handler: function (a, m) {
            const aVal = toBigInt(a);
            const mVal = toBigInt(m);
            if (mVal === 0n) throw new Error("Modulus cannot be zero");
            return new Integer(((aVal % mVal) + mVal) % mVal);
        },
        params: ["a", "m"],
        doc: "Returns a mod m (always non-negative)"
    },

    /**
     * Integer quotient
     */
    Quot: {
        type: 'js',
        handler: function (a, b) {
            const aVal = toBigInt(a);
            const bVal = toBigInt(b);
            if (bVal === 0n) throw new Error("Cannot divide by zero");
            return new Integer(aVal / bVal);
        },
        params: ["a", "b"],
        doc: "Returns integer quotient floor(a/b)"
    },

    /**
     * DivMod: returns {quotient, remainder}
     */
    DivMod: {
        type: 'js',
        handler: function (a, b) {
            const aVal = toBigInt(a);
            const bVal = toBigInt(b);
            if (bVal === 0n) throw new Error("Cannot divide by zero");
            const q = aVal / bVal;
            const r = aVal - q * bVal;
            return {
                type: 'sequence',
                values: [new Integer(q), new Integer(r)],
                lastValue: new Integer(r)
            };
        },
        params: ["a", "b"],
        doc: "Returns {quotient, remainder}"
    },

    /**
     * Coprime test
     */
    Coprime: {
        type: 'js',
        handler: function (a, b) {
            return new Integer(gcdBigInt(toBigInt(a), toBigInt(b)) === 1n ? 1n : 0n);
        },
        params: ["a", "b"],
        doc: "Returns 1 if gcd(a,b) = 1, 0 otherwise"
    },

    /**
     * Primality test
     */
    IsPrime: {
        type: 'js',
        handler: function (n) {
            return new Integer(isPrimeBigInt(toBigInt(n)) ? 1n : 0n);
        },
        params: ["n"],
        doc: "Returns 1 if n is prime, 0 otherwise"
    },

    /**
     * Next prime after n
     */
    NextPrime: {
        type: 'js',
        handler: function (n) {
            let val = toBigInt(n) + 1n;
            while (!isPrimeBigInt(val)) {
                val++;
            }
            return new Integer(val);
        },
        params: ["n"],
        doc: "Returns the smallest prime greater than n"
    },

    /**
     * Previous prime before n
     */
    PrevPrime: {
        type: 'js',
        handler: function (n) {
            let val = toBigInt(n) - 1n;
            if (val < 2n) throw new Error("No prime less than 2");
            while (!isPrimeBigInt(val)) {
                val--;
                if (val < 2n) throw new Error("No prime found");
            }
            return new Integer(val);
        },
        params: ["n"],
        doc: "Returns the largest prime less than n"
    },

    /**
     * Prime factorization
     */
    Factor: {
        type: 'js',
        handler: function (n) {
            const factors = factorBigInt(toBigInt(n));
            const values = factors.map(f => new Integer(f));
            return {
                type: 'sequence',
                values: values,
                lastValue: values.length > 0 ? values[values.length - 1] : undefined
            };
        },
        params: ["n"],
        doc: "Returns prime factorization as a sequence (with repetition)"
    },

    /**
     * Divisors of n
     */
    Divisors: {
        type: 'js',
        handler: function (n) {
            const val = toBigInt(n);
            if (val <= 0n) throw new Error("Divisors requires positive integer");
            
            const divs = [];
            let i = 1n;
            while (i * i <= val) {
                if (val % i === 0n) {
                    divs.push(i);
                    if (i * i !== val) {
                        divs.push(val / i);
                    }
                }
                i++;
            }
            divs.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
            
            const values = divs.map(d => new Integer(d));
            return {
                type: 'sequence',
                values: values,
                lastValue: values[values.length - 1]
            };
        },
        params: ["n"],
        doc: "Returns all divisors of n as a sequence"
    },

    /**
     * Number of divisors
     */
    DivisorCount: {
        type: 'js',
        handler: function (n) {
            const val = toBigInt(n);
            if (val <= 0n) throw new Error("DivisorCount requires positive integer");
            
            let count = 0n;
            let i = 1n;
            while (i * i <= val) {
                if (val % i === 0n) {
                    count++;
                    if (i * i !== val) count++;
                }
                i++;
            }
            return new Integer(count);
        },
        params: ["n"],
        doc: "Returns the number of divisors of n"
    },

    /**
     * Sum of divisors
     */
    DivisorSum: {
        type: 'js',
        handler: function (n, k) {
            const val = toBigInt(n);
            if (val <= 0n) throw new Error("DivisorSum requires positive integer");
            const power = k !== undefined ? toBigInt(k) : 1n;
            
            let sum = 0n;
            let i = 1n;
            while (i * i <= val) {
                if (val % i === 0n) {
                    sum += i ** power;
                    if (i * i !== val) {
                        sum += (val / i) ** power;
                    }
                }
                i++;
            }
            return new Integer(sum);
        },
        params: ["n", "k?"],
        doc: "Returns sum of kth powers of divisors (default k=1)"
    },

    /**
     * Modular exponentiation
     */
    ModPow: {
        type: 'js',
        handler: function (base, exp, mod) {
            const b = toBigInt(base);
            const e = toBigInt(exp);
            const m = toBigInt(mod);
            if (m === 0n) throw new Error("Modulus cannot be zero");
            if (e < 0n) throw new Error("Exponent must be non-negative");
            return new Integer(modPowBigInt(b, e, m));
        },
        params: ["base", "exp", "mod"],
        doc: "Computes base^exp mod m efficiently"
    },

    /**
     * Modular inverse
     */
    ModInv: {
        type: 'js',
        handler: function (a, m) {
            const aVal = toBigInt(a);
            const mVal = toBigInt(m);
            const [g, x, _] = extGcdBigInt(aVal, mVal);
            if (g !== 1n) {
                throw new Error(`No modular inverse: gcd(${aVal}, ${mVal}) = ${g} ≠ 1`);
            }
            return new Integer(((x % mVal) + mVal) % mVal);
        },
        params: ["a", "m"],
        doc: "Returns modular inverse of a mod m (requires gcd(a,m) = 1)"
    },

    /**
     * Euler's totient function
     */
    EulerPhi: {
        type: 'js',
        handler: function (n) {
            let val = toBigInt(n);
            if (val <= 0n) throw new Error("EulerPhi requires positive integer");
            
            let result = val;
            let p = 2n;
            
            while (p * p <= val) {
                if (val % p === 0n) {
                    while (val % p === 0n) {
                        val = val / p;
                    }
                    result = result - result / p;
                }
                p++;
            }
            
            if (val > 1n) {
                result = result - result / val;
            }
            
            return new Integer(result);
        },
        params: ["n"],
        doc: "Euler's totient function φ(n)"
    },

    /**
     * Möbius function
     */
    Mobius: {
        type: 'js',
        handler: function (n) {
            const val = toBigInt(n);
            if (val <= 0n) throw new Error("Mobius requires positive integer");
            if (val === 1n) return new Integer(1n);
            
            const factors = factorBigInt(val);
            
            // Check for repeated factors
            for (let i = 1; i < factors.length; i++) {
                if (factors[i] === factors[i - 1]) {
                    return new Integer(0n);
                }
            }
            
            // (-1)^k where k is number of distinct prime factors
            return new Integer(factors.length % 2 === 0 ? 1n : -1n);
        },
        params: ["n"],
        doc: "Möbius function μ(n)"
    },

    /**
     * Factorial
     */
    Factorial: {
        type: 'js',
        handler: function (n) {
            const val = toBigInt(n);
            if (val < 0n) throw new Error("Factorial requires non-negative integer");
            
            let result = 1n;
            for (let i = 2n; i <= val; i++) {
                result *= i;
            }
            return new Integer(result);
        },
        params: ["n"],
        doc: "Returns n!"
    },

    /**
     * Binomial coefficient
     */
    Binomial: {
        type: 'js',
        handler: function (n, k) {
            const nVal = toBigInt(n);
            let kVal = toBigInt(k);
            
            if (kVal < 0n || kVal > nVal) return new Integer(0n);
            if (kVal === 0n || kVal === nVal) return new Integer(1n);
            
            // Use symmetry
            if (kVal > nVal - kVal) {
                kVal = nVal - kVal;
            }
            
            let result = 1n;
            for (let i = 0n; i < kVal; i++) {
                result = result * (nVal - i) / (i + 1n);
            }
            return new Integer(result);
        },
        params: ["n", "k"],
        doc: "Binomial coefficient C(n,k) = n choose k"
    },

    /**
     * Permutations P(n,k)
     */
    Permutations: {
        type: 'js',
        handler: function (n, k) {
            const nVal = toBigInt(n);
            const kVal = toBigInt(k);
            
            if (kVal < 0n || kVal > nVal) return new Integer(0n);
            
            let result = 1n;
            for (let i = 0n; i < kVal; i++) {
                result *= (nVal - i);
            }
            return new Integer(result);
        },
        params: ["n", "k"],
        doc: "Permutations P(n,k) = n!/(n-k)!"
    },

    /**
     * Fibonacci number
     */
    Fibonacci: {
        type: 'js',
        handler: function (n) {
            const val = toBigInt(n);
            if (val < 0n) throw new Error("Fibonacci requires non-negative integer");
            if (val === 0n) return new Integer(0n);
            if (val === 1n) return new Integer(1n);
            
            let a = 0n, b = 1n;
            for (let i = 2n; i <= val; i++) {
                [a, b] = [b, a + b];
            }
            return new Integer(b);
        },
        params: ["n"],
        doc: "Returns the nth Fibonacci number"
    },

    /**
     * Lucas number
     */
    Lucas: {
        type: 'js',
        handler: function (n) {
            const val = toBigInt(n);
            if (val < 0n) throw new Error("Lucas requires non-negative integer");
            if (val === 0n) return new Integer(2n);
            if (val === 1n) return new Integer(1n);
            
            let a = 2n, b = 1n;
            for (let i = 2n; i <= val; i++) {
                [a, b] = [b, a + b];
            }
            return new Integer(b);
        },
        params: ["n"],
        doc: "Returns the nth Lucas number"
    },

    /**
     * Catalan number
     */
    Catalan: {
        type: 'js',
        handler: function (n) {
            const val = toBigInt(n);
            if (val < 0n) throw new Error("Catalan requires non-negative integer");
            
            // C_n = C(2n, n) / (n + 1)
            const nInt = Number(val);
            let result = 1n;
            for (let i = 0n; i < val; i++) {
                result = result * (2n * val - i) / (i + 1n);
            }
            return new Integer(result / (val + 1n));
        },
        params: ["n"],
        doc: "Returns the nth Catalan number"
    },

    /**
     * Harmonic number (rational)
     */
    Harmonic: {
        type: 'js',
        handler: function (n) {
            const val = toBigInt(n);
            if (val < 1n) throw new Error("Harmonic requires positive integer");
            
            let result = new Rational(0n, 1n);
            for (let i = 1n; i <= val; i++) {
                result = result.add(new Rational(1n, i));
            }
            return result;
        },
        params: ["n"],
        doc: "Returns the nth Harmonic number H_n = 1 + 1/2 + ... + 1/n"
    },

    /**
     * Bernoulli number (rational)
     */
    Bernoulli: {
        type: 'js',
        handler: function (n) {
            const val = Number(toBigInt(n));
            if (val < 0) throw new Error("Bernoulli requires non-negative integer");
            
            // Use Akiyama-Tanigawa algorithm
            const A = [];
            for (let m = 0; m <= val; m++) {
                A[m] = new Rational(1n, BigInt(m + 1));
                for (let j = m; j >= 1; j--) {
                    A[j - 1] = A[j - 1].subtract(A[j]).multiply(new Rational(BigInt(j), 1n));
                }
            }
            return A[0];
        },
        params: ["n"],
        doc: "Returns the nth Bernoulli number"
    },
};
