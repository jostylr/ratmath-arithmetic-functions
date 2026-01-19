/**
 * Piecewise and Step Functions
 * 
 * Define and evaluate piecewise functions, step functions, and indicators.
 */

import { Integer, Rational } from "@ratmath/core";

/**
 * Convert value to Rational for comparison
 */
function toRational(val) {
    if (val instanceof Rational) return val;
    if (val instanceof Integer) return new Rational(val.value, 1n);
    if (typeof val === 'bigint') return new Rational(val, 1n);
    if (typeof val === 'number') return new Rational(BigInt(Math.floor(val)), 1n);
    throw new Error(`Cannot convert ${typeof val} to Rational`);
}

/**
 * Compare two values
 */
function compareValues(a, b) {
    const ra = toRational(a);
    const rb = toRational(b);
    return ra.compareTo(rb);
}

export const PiecewiseFunctions = {
    /**
     * Heaviside step function
     */
    Step: {
        type: 'js',
        handler: function (x) {
            const xRat = toRational(x);
            // Step(x) = 0 if x < 0, 1 if x >= 0
            return new Integer(xRat.compareTo(Rational.zero) >= 0 ? 1n : 0n);
        },
        params: ["x"],
        doc: "Heaviside step function: 0 if x < 0, 1 if x ≥ 0"
    },

    /**
     * Unit step at point a
     */
    UnitStep: {
        type: 'js',
        handler: function (x, a) {
            const xRat = toRational(x);
            const aRat = a !== undefined ? toRational(a) : Rational.zero;
            return new Integer(xRat.compareTo(aRat) >= 0 ? 1n : 0n);
        },
        params: ["x", "a?"],
        doc: "Unit step at a: 0 if x < a, 1 if x ≥ a"
    },

    /**
     * Rectangle/box function
     */
    Rect: {
        type: 'js',
        handler: function (x, a, b) {
            const xRat = toRational(x);
            const aRat = toRational(a);
            const bRat = toRational(b);
            
            const geA = xRat.compareTo(aRat) >= 0;
            const leB = xRat.compareTo(bRat) <= 0;
            
            return new Integer(geA && leB ? 1n : 0n);
        },
        params: ["x", "a", "b"],
        doc: "Rectangle function: 1 if a ≤ x ≤ b, 0 otherwise"
    },

    /**
     * Ramp function
     */
    Ramp: {
        type: 'js',
        handler: function (x) {
            const xRat = toRational(x);
            if (xRat.compareTo(Rational.zero) <= 0) {
                return new Integer(0n);
            }
            return xRat;
        },
        params: ["x"],
        doc: "Ramp function: max(0, x)"
    },

    /**
     * Clamp to range
     */
    Clamp: {
        type: 'js',
        handler: function (x, lo, hi) {
            const xRat = toRational(x);
            const loRat = toRational(lo);
            const hiRat = toRational(hi);
            
            if (xRat.compareTo(loRat) < 0) return loRat;
            if (xRat.compareTo(hiRat) > 0) return hiRat;
            return xRat;
        },
        params: ["x", "lo", "hi"],
        doc: "Clamp x to range [lo, hi]"
    },

    /**
     * Sign function (alias for Sign in core-arith)
     */
    Sgn: {
        type: 'js',
        handler: function (x) {
            const xRat = toRational(x);
            const cmp = xRat.compareTo(Rational.zero);
            return new Integer(BigInt(cmp));
        },
        params: ["x"],
        doc: "Sign function: -1 if x < 0, 0 if x = 0, 1 if x > 0"
    },

    /**
     * Characteristic function of closed interval [a, b]
     */
    Chi: {
        type: 'js',
        handler: function (x, a, b) {
            const xRat = toRational(x);
            const aRat = toRational(a);
            const bRat = toRational(b);
            
            const geA = xRat.compareTo(aRat) >= 0;
            const leB = xRat.compareTo(bRat) <= 0;
            
            return new Integer(geA && leB ? 1n : 0n);
        },
        params: ["x", "a", "b"],
        doc: "Characteristic function χ[a,b]: 1 if a ≤ x ≤ b"
    },

    /**
     * Characteristic function of open interval (a, b)
     */
    ChiOpen: {
        type: 'js',
        handler: function (x, a, b) {
            const xRat = toRational(x);
            const aRat = toRational(a);
            const bRat = toRational(b);
            
            const gtA = xRat.compareTo(aRat) > 0;
            const ltB = xRat.compareTo(bRat) < 0;
            
            return new Integer(gtA && ltB ? 1n : 0n);
        },
        params: ["x", "a", "b"],
        doc: "Characteristic function χ(a,b): 1 if a < x < b"
    },

    /**
     * Characteristic function of half-open interval (a, b]
     */
    ChiLeftOpen: {
        type: 'js',
        handler: function (x, a, b) {
            const xRat = toRational(x);
            const aRat = toRational(a);
            const bRat = toRational(b);
            
            const gtA = xRat.compareTo(aRat) > 0;
            const leB = xRat.compareTo(bRat) <= 0;
            
            return new Integer(gtA && leB ? 1n : 0n);
        },
        params: ["x", "a", "b"],
        doc: "Characteristic function χ(a,b]: 1 if a < x ≤ b"
    },

    /**
     * Characteristic function of half-open interval [a, b)
     */
    ChiRightOpen: {
        type: 'js',
        handler: function (x, a, b) {
            const xRat = toRational(x);
            const aRat = toRational(a);
            const bRat = toRational(b);
            
            const geA = xRat.compareTo(aRat) >= 0;
            const ltB = xRat.compareTo(bRat) < 0;
            
            return new Integer(geA && ltB ? 1n : 0n);
        },
        params: ["x", "a", "b"],
        doc: "Characteristic function χ[a,b): 1 if a ≤ x < b"
    },

    /**
     * Create piecewise function from condition/value pairs
     * Usage: Piecewise(cond1, val1, cond2, val2, ..., default?)
     * Conditions are evaluated in order; first true condition's value is returned
     */
    Piecewise: {
        type: 'js',
        handler: function () {
            const allArgs = this._currentCallScope?.get("@@");
            if (!allArgs || allArgs.type !== 'sequence' || allArgs.values.length < 2) {
                throw new Error("Piecewise requires at least one condition/value pair");
            }
            
            const args = allArgs.values;
            const pieces = [];
            
            // Parse condition/value pairs
            // If odd number of args, last one is the default (else) value
            let i = 0;
            while (i < args.length - 1) {
                const condition = args[i];
                const value = args[i + 1];
                pieces.push({ condition, value });
                i += 2;
            }
            
            // If odd number of args, the last is the default value
            const defaultValue = args.length % 2 === 1 ? args[args.length - 1] : null;
            
            return {
                type: 'piecewise',
                pieces: pieces,
                defaultValue: defaultValue
            };
        },
        params: ["cond1", "val1"],
        doc: "Create piecewise function: Piecewise(cond1, val1, cond2, val2, ..., default?)"
    },

    /**
     * Evaluate piecewise function at x
     * Evaluates each condition in order and returns the value for the first true condition
     */
    PiecewiseEval: {
        type: 'js',
        handler: function (f, x) {
            if (f?.type !== 'piecewise') {
                throw new Error("Expected piecewise function");
            }
            
            // Evaluate each condition
            for (const piece of f.pieces) {
                // Condition should be an Integer (1 for true, 0 for false)
                // from comparison operators
                let conditionResult;
                
                if (piece.condition instanceof Integer) {
                    conditionResult = piece.condition.value !== 0n;
                } else if (typeof piece.condition === 'number') {
                    conditionResult = piece.condition !== 0;
                } else if (piece.condition?.value !== undefined) {
                    conditionResult = piece.condition.value !== 0n && piece.condition.value !== 0;
                } else {
                    // Truthy check for other types
                    conditionResult = Boolean(piece.condition);
                }
                
                if (conditionResult) {
                    return piece.value;
                }
            }
            
            // Return default value if no condition matched
            if (f.defaultValue !== null) {
                return f.defaultValue;
            }
            
            throw new Error("No matching condition in piecewise function");
        },
        params: ["f", "x"],
        doc: "Evaluate piecewise function at x"
    },
    // Note: If function is defined in stdlib/src/core.js with lazy evaluation
};
