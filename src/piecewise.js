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
    return ra.compare(rb);
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
            return new Integer(xRat.compare(Rational.zero) >= 0 ? 1n : 0n);
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
            return new Integer(xRat.compare(aRat) >= 0 ? 1n : 0n);
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
            
            const geA = xRat.compare(aRat) >= 0;
            const leB = xRat.compare(bRat) <= 0;
            
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
            if (xRat.compare(Rational.zero) <= 0) {
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
            
            if (xRat.compare(loRat) < 0) return loRat;
            if (xRat.compare(hiRat) > 0) return hiRat;
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
            const cmp = xRat.compare(Rational.zero);
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
            
            const geA = xRat.compare(aRat) >= 0;
            const leB = xRat.compare(bRat) <= 0;
            
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
            
            const gtA = xRat.compare(aRat) > 0;
            const ltB = xRat.compare(bRat) < 0;
            
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
            
            const gtA = xRat.compare(aRat) > 0;
            const leB = xRat.compare(bRat) <= 0;
            
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
            
            const geA = xRat.compare(aRat) >= 0;
            const ltB = xRat.compare(bRat) < 0;
            
            return new Integer(geA && ltB ? 1n : 0n);
        },
        params: ["x", "a", "b"],
        doc: "Characteristic function χ[a,b): 1 if a ≤ x < b"
    },

    /**
     * Create piecewise function
     * TODO: Full implementation requires condition parsing
     */
    Piecewise: {
        type: 'js',
        handler: function () {
            const allArgs = this._currentCallScope?.get("@@");
            if (!allArgs || allArgs.type !== 'sequence') {
                throw new Error("Piecewise requires piece definitions");
            }
            
            // Store the pieces for later evaluation
            return {
                type: 'piecewise',
                pieces: allArgs.values
            };
        },
        params: ["piece1", "piece2?", "piece3?", "piece4?", "piece5?"],
        doc: "Create piecewise function from {function, condition} pairs"
    },

    /**
     * Evaluate piecewise function
     * TODO: Full implementation requires condition evaluation
     */
    PiecewiseEval: {
        type: 'js',
        handler: function (f, x) {
            if (f?.type !== 'piecewise') {
                throw new Error("Expected piecewise function");
            }
            
            // TODO: Evaluate conditions and apply correct piece
            return { type: 'string', value: 'PiecewiseEval not yet fully implemented' };
        },
        params: ["f", "x"],
        doc: "Evaluate piecewise function at x"
    },
};
