/**
 * Core Arithmetic Functions
 * 
 * Basic arithmetic operations: Abs, Sign, Max, Min, Floor, Ceil, etc.
 */

import { Integer, Rational } from "@ratmath/core";

/**
 * Helper to convert value to Rational for comparison/operations
 */
function toRational(val) {
    if (val instanceof Rational) return val;
    if (val instanceof Integer) return new Rational(val.value, 1n);
    if (typeof val === 'bigint') return new Rational(val, 1n);
    if (typeof val === 'number') return new Rational(BigInt(Math.floor(val)), 1n);
    throw new Error(`Cannot convert ${typeof val} to Rational`);
}

/**
 * Compare two values, returns -1, 0, or 1
 */
function compareValues(a, b) {
    const ra = toRational(a);
    const rb = toRational(b);
    return ra.compare(rb);
}

export const CoreArithmetic = {
    /**
     * Absolute value
     */
    Abs: {
        type: 'js',
        handler: function (x) {
            if (x instanceof Integer) {
                const val = x.value < 0n ? -x.value : x.value;
                return new Integer(val);
            }
            if (x instanceof Rational) {
                return x.abs();
            }
            throw new Error("Abs expects a number");
        },
        params: ["x"],
        doc: "Returns the absolute value of x"
    },

    /**
     * Sign function: -1, 0, or 1
     */
    Sign: {
        type: 'js',
        handler: function (x) {
            if (x instanceof Integer) {
                if (x.value < 0n) return new Integer(-1n);
                if (x.value > 0n) return new Integer(1n);
                return new Integer(0n);
            }
            if (x instanceof Rational) {
                const cmp = x.compare(Rational.zero);
                return new Integer(BigInt(cmp));
            }
            throw new Error("Sign expects a number");
        },
        params: ["x"],
        doc: "Returns -1 if x < 0, 0 if x = 0, 1 if x > 0"
    },

    /**
     * Maximum of values
     */
    Max: {
        type: 'js',
        handler: function () {
            const allArgs = this._currentCallScope?.get("@@");
            if (!allArgs || allArgs.type !== 'sequence' || allArgs.values.length === 0) {
                throw new Error("Max requires at least one argument");
            }
            
            let maxVal = allArgs.values[0];
            for (let i = 1; i < allArgs.values.length; i++) {
                if (compareValues(allArgs.values[i], maxVal) > 0) {
                    maxVal = allArgs.values[i];
                }
            }
            return maxVal;
        },
        params: ["a", "b?", "c?", "d?", "e?"],
        doc: "Returns the maximum of the given values"
    },

    /**
     * Minimum of values
     */
    Min: {
        type: 'js',
        handler: function () {
            const allArgs = this._currentCallScope?.get("@@");
            if (!allArgs || allArgs.type !== 'sequence' || allArgs.values.length === 0) {
                throw new Error("Min requires at least one argument");
            }
            
            let minVal = allArgs.values[0];
            for (let i = 1; i < allArgs.values.length; i++) {
                if (compareValues(allArgs.values[i], minVal) < 0) {
                    minVal = allArgs.values[i];
                }
            }
            return minVal;
        },
        params: ["a", "b?", "c?", "d?", "e?"],
        doc: "Returns the minimum of the given values"
    },

    /**
     * Floor function
     */
    Floor: {
        type: 'js',
        handler: function (x) {
            if (x instanceof Integer) {
                return x;
            }
            if (x instanceof Rational) {
                return new Integer(x.floor());
            }
            throw new Error("Floor expects a number");
        },
        params: ["x"],
        doc: "Returns the floor (greatest integer ≤ x)"
    },

    /**
     * Ceiling function
     */
    Ceil: {
        type: 'js',
        handler: function (x) {
            if (x instanceof Integer) {
                return x;
            }
            if (x instanceof Rational) {
                return new Integer(x.ceiling());
            }
            throw new Error("Ceil expects a number");
        },
        params: ["x"],
        doc: "Returns the ceiling (least integer ≥ x)"
    },

    /**
     * Round to nearest integer
     */
    Round: {
        type: 'js',
        handler: function (x, places) {
            if (x instanceof Integer && places === undefined) {
                return x;
            }
            if (x instanceof Rational) {
                // Round to nearest integer
                // floor(x + 1/2)
                const half = new Rational(1n, 2n);
                const shifted = x.add(half);
                return new Integer(shifted.floor());
            }
            throw new Error("Round expects a number");
        },
        params: ["x", "places?"],
        doc: "Rounds x to the nearest integer"
    },

    /**
     * Truncate toward zero
     */
    Trunc: {
        type: 'js',
        handler: function (x) {
            if (x instanceof Integer) {
                return x;
            }
            if (x instanceof Rational) {
                return new Integer(x.truncate());
            }
            throw new Error("Trunc expects a number");
        },
        params: ["x"],
        doc: "Truncates x toward zero"
    },

    /**
     * Fractional part: x - floor(x)
     */
    Frac: {
        type: 'js',
        handler: function (x) {
            if (x instanceof Integer) {
                return new Integer(0n);
            }
            if (x instanceof Rational) {
                const floorVal = x.floor();
                return x.subtract(new Rational(floorVal, 1n));
            }
            throw new Error("Frac expects a number");
        },
        params: ["x"],
        doc: "Returns the fractional part of x (x - floor(x))"
    },

    /**
     * Numerator of a rational
     */
    Numer: {
        type: 'js',
        handler: function (x) {
            if (x instanceof Integer) {
                return x;
            }
            if (x instanceof Rational) {
                return new Integer(x.numerator);
            }
            throw new Error("Numer expects a number");
        },
        params: ["x"],
        doc: "Returns the numerator of a rational number"
    },

    /**
     * Denominator of a rational
     */
    Denom: {
        type: 'js',
        handler: function (x) {
            if (x instanceof Integer) {
                return new Integer(1n);
            }
            if (x instanceof Rational) {
                return new Integer(x.denominator);
            }
            throw new Error("Denom expects a number");
        },
        params: ["x"],
        doc: "Returns the denominator of a rational number"
    },

    /**
     * Reciprocal: 1/x
     */
    Reciprocal: {
        type: 'js',
        handler: function (x) {
            if (x instanceof Integer) {
                if (x.value === 0n) {
                    throw new Error("Cannot compute reciprocal of zero");
                }
                return new Rational(1n, x.value);
            }
            if (x instanceof Rational) {
                return x.reciprocal();
            }
            throw new Error("Reciprocal expects a number");
        },
        params: ["x"],
        doc: "Returns 1/x"
    },

    /**
     * Negation: -x
     */
    Neg: {
        type: 'js',
        handler: function (x) {
            if (x instanceof Integer) {
                return new Integer(-x.value);
            }
            if (x instanceof Rational) {
                return x.negate();
            }
            throw new Error("Neg expects a number");
        },
        params: ["x"],
        doc: "Returns -x"
    },

    /**
     * Compare: returns -1, 0, or 1
     */
    Cmp: {
        type: 'js',
        handler: function (a, b) {
            const result = compareValues(a, b);
            return new Integer(BigInt(result));
        },
        params: ["a", "b"],
        doc: "Compares a and b: returns -1 if a < b, 0 if a = b, 1 if a > b"
    },

    /**
     * Equality test
     */
    Eq: {
        type: 'js',
        handler: function (a, b) {
            return new Integer(compareValues(a, b) === 0 ? 1n : 0n);
        },
        params: ["a", "b"],
        doc: "Returns 1 if a = b, 0 otherwise"
    },

    /**
     * Less than
     */
    Lt: {
        type: 'js',
        handler: function (a, b) {
            return new Integer(compareValues(a, b) < 0 ? 1n : 0n);
        },
        params: ["a", "b"],
        doc: "Returns 1 if a < b, 0 otherwise"
    },

    /**
     * Less or equal
     */
    Le: {
        type: 'js',
        handler: function (a, b) {
            return new Integer(compareValues(a, b) <= 0 ? 1n : 0n);
        },
        params: ["a", "b"],
        doc: "Returns 1 if a ≤ b, 0 otherwise"
    },

    /**
     * Greater than
     */
    Gt: {
        type: 'js',
        handler: function (a, b) {
            return new Integer(compareValues(a, b) > 0 ? 1n : 0n);
        },
        params: ["a", "b"],
        doc: "Returns 1 if a > b, 0 otherwise"
    },

    /**
     * Greater or equal
     */
    Ge: {
        type: 'js',
        handler: function (a, b) {
            return new Integer(compareValues(a, b) >= 0 ? 1n : 0n);
        },
        params: ["a", "b"],
        doc: "Returns 1 if a ≥ b, 0 otherwise"
    },

    /**
     * Between: a ≤ x ≤ b
     */
    Between: {
        type: 'js',
        handler: function (x, a, b) {
            const geA = compareValues(x, a) >= 0;
            const leB = compareValues(x, b) <= 0;
            return new Integer(geA && leB ? 1n : 0n);
        },
        params: ["x", "a", "b"],
        doc: "Returns 1 if a ≤ x ≤ b, 0 otherwise"
    },
};
