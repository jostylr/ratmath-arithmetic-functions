/**
 * Polynomial Functions
 * 
 * Create, evaluate, and manipulate polynomials with rational coefficients.
 * Includes synthetic division, Taylor rebasing, and root analysis.
 */

import { Integer, Rational } from "@ratmath/core";

/**
 * Extract coefficient array from a polynomial object or sequence
 */
function extractCoeffs(poly) {
    // If it's a sequence, extract values
    if (poly?.type === 'sequence') {
        return poly.values.map(toRational);
    }
    // If it has coeffs decoration
    if (poly?.coeffs) {
        return extractCoeffs(poly.coeffs);
    }
    throw new Error("Expected polynomial or coefficient sequence");
}

/**
 * Convert value to Rational
 */
function toRational(val) {
    if (val instanceof Rational) return val;
    if (val instanceof Integer) return new Rational(val.value, 1n);
    if (typeof val === 'bigint') return new Rational(val, 1n);
    if (typeof val === 'number') return new Rational(BigInt(Math.floor(val)), 1n);
    throw new Error(`Cannot convert ${typeof val} to Rational`);
}

/**
 * Create coefficient sequence from array
 */
function makeCoeffSequence(coeffs) {
    const values = coeffs.map(c => 
        c instanceof Rational ? c : 
        c instanceof Integer ? c : 
        new Rational(c, 1n)
    );
    return {
        type: 'sequence',
        values: values,
        lastValue: values.length > 0 ? values[values.length - 1] : undefined
    };
}

/**
 * Trim leading zeros from coefficient array (highest degree)
 */
function trimCoeffs(coeffs) {
    let end = coeffs.length - 1;
    while (end > 0 && coeffs[end].numerator === 0n) {
        end--;
    }
    return coeffs.slice(0, end + 1);
}

/**
 * Evaluate polynomial at x using Horner's method
 */
function hornerEval(coeffs, x) {
    if (coeffs.length === 0) return new Rational(0n, 1n);
    
    const xRat = toRational(x);
    let result = coeffs[coeffs.length - 1];
    
    for (let i = coeffs.length - 2; i >= 0; i--) {
        result = result.multiply(xRat).add(coeffs[i]);
    }
    
    return result;
}

/**
 * Synthetic division by (x - c)
 * Returns { quotient: coeffs[], remainder: Rational }
 */
function synthDivide(coeffs, c) {
    if (coeffs.length === 0) {
        return { quotient: [], remainder: new Rational(0n, 1n) };
    }
    
    const cRat = toRational(c);
    const n = coeffs.length;
    
    // Work with coefficients in descending order for synthetic division
    const descCoeffs = [...coeffs].reverse();
    const result = [descCoeffs[0]];
    
    for (let i = 1; i < n; i++) {
        result.push(result[i - 1].multiply(cRat).add(descCoeffs[i]));
    }
    
    // Last element is remainder, rest are quotient coefficients
    const remainder = result[n - 1];
    const quotientDesc = result.slice(0, n - 1);
    
    // Convert back to ascending order
    const quotient = quotientDesc.reverse();
    
    return { quotient, remainder };
}

export const PolynomialFunctions = {
    /**
     * Create polynomial from coefficient sequence
     */
    Poly: {
        type: 'js',
        handler: function (coeffs, varName) {
            const coeffArray = extractCoeffs(coeffs);
            const trimmed = trimCoeffs(coeffArray);
            const degree = trimmed.length - 1;
            const variable = varName?.value || varName || "x";
            
            // Create a callable function object
            const polyFunc = {
                type: 'polynomial',
                coeffs: makeCoeffSequence(trimmed),
                degree: degree,
                variable: variable,
                // Make it callable for evaluation
                call: (x) => hornerEval(trimmed, x)
            };
            
            return polyFunc;
        },
        params: ["coeffs", "var?"],
        doc: "Create polynomial from coefficients {a₀, a₁, ...} in ascending order"
    },

    /**
     * Get polynomial degree
     */
    PolyDeg: {
        type: 'js',
        handler: function (poly) {
            if (poly?.degree !== undefined) {
                return new Integer(BigInt(poly.degree));
            }
            const coeffs = extractCoeffs(poly);
            const trimmed = trimCoeffs(coeffs);
            return new Integer(BigInt(trimmed.length - 1));
        },
        params: ["poly"],
        doc: "Returns the degree of the polynomial"
    },

    /**
     * Get polynomial coefficients
     */
    PolyCoeffs: {
        type: 'js',
        handler: function (poly) {
            if (poly?.coeffs) {
                return poly.coeffs;
            }
            return extractCoeffs(poly);
        },
        params: ["poly"],
        doc: "Returns the coefficient sequence of the polynomial"
    },

    /**
     * Get specific coefficient
     */
    PolyCoeff: {
        type: 'js',
        handler: function (poly, n) {
            const coeffs = extractCoeffs(poly?.coeffs || poly);
            const idx = Number(n instanceof Integer ? n.value : n);
            if (idx < 0 || idx >= coeffs.length) {
                return new Rational(0n, 1n);
            }
            return coeffs[idx];
        },
        params: ["poly", "n"],
        doc: "Returns the nth coefficient (0-indexed, ascending)"
    },

    /**
     * Evaluate polynomial at x
     */
    PolyEval: {
        type: 'js',
        handler: function (poly, x) {
            const coeffs = extractCoeffs(poly?.coeffs || poly);
            return hornerEval(coeffs, x);
        },
        params: ["poly", "x"],
        doc: "Evaluate polynomial at x"
    },

    /**
     * Horner's method evaluation (optionally with steps)
     */
    PolyHorner: {
        type: 'js',
        handler: function (poly, x, showSteps) {
            const coeffs = extractCoeffs(poly?.coeffs || poly);
            const xRat = toRational(x);
            
            if (!showSteps) {
                return hornerEval(coeffs, x);
            }
            
            // With steps
            const steps = [];
            let result = coeffs[coeffs.length - 1];
            steps.push({ step: 0, value: result });
            
            for (let i = coeffs.length - 2; i >= 0; i--) {
                result = result.multiply(xRat).add(coeffs[i]);
                steps.push({ step: coeffs.length - 1 - i, value: result });
            }
            
            return {
                type: 'sequence',
                values: steps.map(s => s.value),
                lastValue: result,
                result: result
            };
        },
        params: ["poly", "x", "showSteps?"],
        doc: "Evaluate using Horner's method, optionally showing steps"
    },

    /**
     * Add polynomials
     */
    PolyAdd: {
        type: 'js',
        handler: function (p, q) {
            const pCoeffs = extractCoeffs(p?.coeffs || p);
            const qCoeffs = extractCoeffs(q?.coeffs || q);
            
            const maxLen = Math.max(pCoeffs.length, qCoeffs.length);
            const result = [];
            
            for (let i = 0; i < maxLen; i++) {
                const pVal = i < pCoeffs.length ? pCoeffs[i] : new Rational(0n, 1n);
                const qVal = i < qCoeffs.length ? qCoeffs[i] : new Rational(0n, 1n);
                result.push(pVal.add(qVal));
            }
            
            const trimmed = trimCoeffs(result);
            return {
                type: 'polynomial',
                coeffs: makeCoeffSequence(trimmed),
                degree: trimmed.length - 1
            };
        },
        params: ["p", "q"],
        doc: "Add two polynomials"
    },

    /**
     * Subtract polynomials
     */
    PolySub: {
        type: 'js',
        handler: function (p, q) {
            const pCoeffs = extractCoeffs(p?.coeffs || p);
            const qCoeffs = extractCoeffs(q?.coeffs || q);
            
            const maxLen = Math.max(pCoeffs.length, qCoeffs.length);
            const result = [];
            
            for (let i = 0; i < maxLen; i++) {
                const pVal = i < pCoeffs.length ? pCoeffs[i] : new Rational(0n, 1n);
                const qVal = i < qCoeffs.length ? qCoeffs[i] : new Rational(0n, 1n);
                result.push(pVal.subtract(qVal));
            }
            
            const trimmed = trimCoeffs(result);
            return {
                type: 'polynomial',
                coeffs: makeCoeffSequence(trimmed),
                degree: trimmed.length - 1
            };
        },
        params: ["p", "q"],
        doc: "Subtract polynomials: P - Q"
    },

    /**
     * Multiply polynomials
     */
    PolyMul: {
        type: 'js',
        handler: function (p, q) {
            const pCoeffs = extractCoeffs(p?.coeffs || p);
            const qCoeffs = extractCoeffs(q?.coeffs || q);
            
            if (pCoeffs.length === 0 || qCoeffs.length === 0) {
                return {
                    type: 'polynomial',
                    coeffs: makeCoeffSequence([new Rational(0n, 1n)]),
                    degree: -1
                };
            }
            
            const resultLen = pCoeffs.length + qCoeffs.length - 1;
            const result = Array(resultLen).fill(null).map(() => new Rational(0n, 1n));
            
            for (let i = 0; i < pCoeffs.length; i++) {
                for (let j = 0; j < qCoeffs.length; j++) {
                    result[i + j] = result[i + j].add(pCoeffs[i].multiply(qCoeffs[j]));
                }
            }
            
            const trimmed = trimCoeffs(result);
            return {
                type: 'polynomial',
                coeffs: makeCoeffSequence(trimmed),
                degree: trimmed.length - 1
            };
        },
        params: ["p", "q"],
        doc: "Multiply polynomials"
    },

    /**
     * Scale polynomial by scalar
     */
    PolyScale: {
        type: 'js',
        handler: function (poly, c) {
            const coeffs = extractCoeffs(poly?.coeffs || poly);
            const cRat = toRational(c);
            
            const result = coeffs.map(coef => coef.multiply(cRat));
            const trimmed = trimCoeffs(result);
            
            return {
                type: 'polynomial',
                coeffs: makeCoeffSequence(trimmed),
                degree: trimmed.length - 1
            };
        },
        params: ["poly", "c"],
        doc: "Multiply polynomial by scalar c"
    },

    /**
     * Negate polynomial
     */
    PolyNeg: {
        type: 'js',
        handler: function (poly) {
            const coeffs = extractCoeffs(poly?.coeffs || poly);
            const result = coeffs.map(c => c.negate());
            
            return {
                type: 'polynomial',
                coeffs: makeCoeffSequence(result),
                degree: result.length - 1
            };
        },
        params: ["poly"],
        doc: "Negate polynomial"
    },

    /**
     * Derivative
     */
    PolyDer: {
        type: 'js',
        handler: function (poly, n) {
            let coeffs = extractCoeffs(poly?.coeffs || poly);
            const times = n !== undefined ? Number(n instanceof Integer ? n.value : n) : 1;
            
            for (let t = 0; t < times; t++) {
                if (coeffs.length <= 1) {
                    coeffs = [new Rational(0n, 1n)];
                    break;
                }
                
                const newCoeffs = [];
                for (let i = 1; i < coeffs.length; i++) {
                    newCoeffs.push(coeffs[i].multiply(new Rational(BigInt(i), 1n)));
                }
                coeffs = newCoeffs;
            }
            
            const trimmed = trimCoeffs(coeffs);
            return {
                type: 'polynomial',
                coeffs: makeCoeffSequence(trimmed),
                degree: trimmed.length - 1
            };
        },
        params: ["poly", "n?"],
        doc: "Compute nth derivative (default n=1)"
    },

    /**
     * Indefinite integral
     */
    PolyInt: {
        type: 'js',
        handler: function (poly, c) {
            const coeffs = extractCoeffs(poly?.coeffs || poly);
            const constant = c !== undefined ? toRational(c) : new Rational(0n, 1n);
            
            const result = [constant];
            for (let i = 0; i < coeffs.length; i++) {
                result.push(coeffs[i].divide(new Rational(BigInt(i + 1), 1n)));
            }
            
            const trimmed = trimCoeffs(result);
            return {
                type: 'polynomial',
                coeffs: makeCoeffSequence(trimmed),
                degree: trimmed.length - 1
            };
        },
        params: ["poly", "c?"],
        doc: "Indefinite integral with constant c (default 0)"
    },

    /**
     * Synthetic division by (x - c)
     */
    SynthDiv: {
        type: 'js',
        handler: function (poly, c, showSteps) {
            const coeffs = extractCoeffs(poly?.coeffs || poly);
            const { quotient, remainder } = synthDivide(coeffs, c);
            
            const result = {
                quotient: {
                    type: 'polynomial',
                    coeffs: makeCoeffSequence(quotient),
                    degree: quotient.length - 1
                },
                remainder: remainder
            };
            
            if (showSteps) {
                // TODO: Add step-by-step details
                result.steps = "Step details not yet implemented";
            }
            
            return {
                type: 'sequence',
                values: [result.quotient, result.remainder],
                lastValue: result.remainder,
                quotient: result.quotient,
                remainder: result.remainder
            };
        },
        params: ["poly", "c", "showSteps?"],
        doc: "Synthetic division by (x - c), returns {quotient, remainder}"
    },

    /**
     * Synthetic division quotient only
     */
    SynthDivPoly: {
        type: 'js',
        handler: function (poly, c) {
            const coeffs = extractCoeffs(poly?.coeffs || poly);
            const { quotient } = synthDivide(coeffs, c);
            
            return {
                type: 'polynomial',
                coeffs: makeCoeffSequence(quotient),
                degree: quotient.length - 1
            };
        },
        params: ["poly", "c"],
        doc: "Return quotient polynomial from synthetic division by (x - c)"
    },

    /**
     * Synthetic division remainder (= P(c))
     */
    SynthDivRem: {
        type: 'js',
        handler: function (poly, c) {
            const coeffs = extractCoeffs(poly?.coeffs || poly);
            return hornerEval(coeffs, c);
        },
        params: ["poly", "c"],
        doc: "Return remainder from synthetic division (equals P(c))"
    },

    /**
     * Rebase polynomial at x = a (Taylor polynomial)
     */
    PolyRebase: {
        type: 'js',
        handler: function (poly, a) {
            let coeffs = extractCoeffs(poly?.coeffs || poly);
            const aRat = toRational(a);
            
            // Repeated synthetic division to get Taylor coefficients
            const taylorCoeffs = [];
            
            for (let i = 0; i < coeffs.length; i++) {
                const { quotient, remainder } = synthDivide(coeffs, aRat);
                taylorCoeffs.push(remainder);
                coeffs = quotient;
            }
            
            return {
                type: 'polynomial',
                coeffs: makeCoeffSequence(taylorCoeffs),
                degree: taylorCoeffs.length - 1,
                base: aRat
            };
        },
        params: ["poly", "a"],
        doc: "Express P(x) as polynomial in (x - a)"
    },

    /**
     * Count sign changes in coefficients
     */
    PolySignChanges: {
        type: 'js',
        handler: function (poly) {
            const coeffs = extractCoeffs(poly?.coeffs || poly);
            
            // Filter out zero coefficients
            const nonZero = coeffs.filter(c => c.numerator !== 0n);
            
            let changes = 0;
            for (let i = 1; i < nonZero.length; i++) {
                const prevSign = nonZero[i - 1].numerator > 0n;
                const currSign = nonZero[i].numerator > 0n;
                if (prevSign !== currSign) {
                    changes++;
                }
            }
            
            return new Integer(BigInt(changes));
        },
        params: ["poly"],
        doc: "Count sign changes in polynomial coefficients"
    },

    /**
     * Descartes' Rule of Signs analysis
     */
    PolyDescartes: {
        type: 'js',
        handler: function (poly) {
            const coeffs = extractCoeffs(poly?.coeffs || poly);
            
            // Count sign changes for positive roots
            const nonZero = coeffs.filter(c => c.numerator !== 0n);
            let posChanges = 0;
            for (let i = 1; i < nonZero.length; i++) {
                const prevSign = nonZero[i - 1].numerator > 0n;
                const currSign = nonZero[i].numerator > 0n;
                if (prevSign !== currSign) posChanges++;
            }
            
            // Count for negative roots: P(-x)
            const negCoeffs = coeffs.map((c, i) => i % 2 === 1 ? c.negate() : c);
            const negNonZero = negCoeffs.filter(c => c.numerator !== 0n);
            let negChanges = 0;
            for (let i = 1; i < negNonZero.length; i++) {
                const prevSign = negNonZero[i - 1].numerator > 0n;
                const currSign = negNonZero[i].numerator > 0n;
                if (prevSign !== currSign) negChanges++;
            }
            
            // Possible counts (differ by 2)
            const possiblePos = [];
            for (let k = posChanges; k >= 0; k -= 2) {
                possiblePos.push(new Integer(BigInt(k)));
            }
            
            const possibleNeg = [];
            for (let k = negChanges; k >= 0; k -= 2) {
                possibleNeg.push(new Integer(BigInt(k)));
            }
            
            return {
                type: 'sequence',
                values: [
                    { type: 'string', value: 'positiveRoots' },
                    { type: 'sequence', values: possiblePos },
                    { type: 'string', value: 'negativeRoots' },
                    { type: 'sequence', values: possibleNeg }
                ],
                positiveChanges: new Integer(BigInt(posChanges)),
                negativeChanges: new Integer(BigInt(negChanges)),
                possiblePositive: possiblePos,
                possibleNegative: possibleNeg
            };
        },
        params: ["poly"],
        doc: "Descartes' Rule of Signs analysis for positive and negative roots"
    },

    /**
     * Find rational roots using Rational Root Theorem
     */
    PolyRatRoots: {
        type: 'js',
        handler: function (poly) {
            const coeffs = extractCoeffs(poly?.coeffs || poly);
            if (coeffs.length === 0) return { type: 'sequence', values: [] };
            
            // Get constant term and leading coefficient
            const a0 = coeffs[0];
            const an = coeffs[coeffs.length - 1];
            
            if (a0.numerator === 0n) {
                // x = 0 is a root; factor out x and continue
                // For now, just note it
            }
            
            // Find divisors of constant term numerator
            const p = a0.numerator < 0n ? -a0.numerator : a0.numerator;
            const q = an.numerator < 0n ? -an.numerator : an.numerator;
            
            if (p === 0n || q === 0n) {
                return { type: 'sequence', values: [], lastValue: undefined };
            }
            
            // Get divisors
            const pDivs = [];
            for (let i = 1n; i * i <= p; i++) {
                if (p % i === 0n) {
                    pDivs.push(i);
                    if (i * i !== p) pDivs.push(p / i);
                }
            }
            
            const qDivs = [];
            for (let i = 1n; i * i <= q; i++) {
                if (q % i === 0n) {
                    qDivs.push(i);
                    if (i * i !== q) qDivs.push(q / i);
                }
            }
            
            // Test all ±p/q candidates
            const roots = [];
            const tested = new Set();
            
            for (const pVal of pDivs) {
                for (const qVal of qDivs) {
                    const posCandidate = new Rational(pVal, qVal);
                    const negCandidate = new Rational(-pVal, qVal);
                    
                    const posKey = posCandidate.toString();
                    const negKey = negCandidate.toString();
                    
                    if (!tested.has(posKey)) {
                        tested.add(posKey);
                        if (hornerEval(coeffs, posCandidate).numerator === 0n) {
                            roots.push(posCandidate);
                        }
                    }
                    
                    if (!tested.has(negKey)) {
                        tested.add(negKey);
                        if (hornerEval(coeffs, negCandidate).numerator === 0n) {
                            roots.push(negCandidate);
                        }
                    }
                }
            }
            
            // Sort roots
            roots.sort((a, b) => a.compare(b));
            
            return {
                type: 'sequence',
                values: roots,
                lastValue: roots.length > 0 ? roots[roots.length - 1] : undefined
            };
        },
        params: ["poly"],
        doc: "Find all rational roots using the Rational Root Theorem"
    },
};
