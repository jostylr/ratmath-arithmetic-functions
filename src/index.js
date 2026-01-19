/**
 * @ratmath/arith-funs - Arithmetic Functions Package
 * 
 * Provides arithmetic functions for rational numbers and integers:
 * - Polynomials (evaluation, arithmetic, synthetic division, root finding)
 * - Number theory (GCD, LCM, primes, modular arithmetic)
 * - Rational functions (quotients of polynomials, partial fractions)
 * - Piecewise and step functions
 * - Core arithmetic (Abs, Sign, Floor, Ceil, Max, Min)
 */

import { CoreArithmetic } from "./core-arith.js";
import { NumberTheory } from "./number-theory.js";
import { PolynomialFunctions } from "./polynomial.js";
import { RationalFuncFunctions } from "./rational-func.js";
import { PiecewiseFunctions } from "./piecewise.js";

export * from "./core-arith.js";
export * from "./number-theory.js";
export * from "./polynomial.js";
export * from "./rational-func.js";
export * from "./piecewise.js";

/**
 * Registers all ArithFuns functions into the provided VariableManager.
 * @param {VariableManager} vm - The VariableManager instance.
 */
export function registerArithFuns(vm) {
    const register = (name, def) => {
        const normalizedName = vm.normalizeName(name);
        vm.functions.set(normalizedName, def);
    };

    // Core Arithmetic
    for (const [name, def] of Object.entries(CoreArithmetic)) {
        register(name, def);
    }

    // Number Theory
    for (const [name, def] of Object.entries(NumberTheory)) {
        register(name, def);
    }

    // Polynomials
    for (const [name, def] of Object.entries(PolynomialFunctions)) {
        register(name, def);
    }

    // Rational Functions
    for (const [name, def] of Object.entries(RationalFuncFunctions)) {
        register(name, def);
    }

    // Piecewise Functions
    for (const [name, def] of Object.entries(PiecewiseFunctions)) {
        register(name, def);
    }

    return "ArithFuns Package Loaded";
}
