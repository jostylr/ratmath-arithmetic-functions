/**
 * RatMath Module for ArithFuns
 * 
 * This file exports the combined functions and variables for VariableManager integration.
 * Load via: LOAD arith-funs
 */

import { CoreArithmetic } from "./core-arith.js";
import { NumberTheory } from "./number-theory.js";
import { PolynomialFunctions } from "./polynomial.js";
import { RationalFuncFunctions } from "./rational-func.js";
import { PiecewiseFunctions } from "./piecewise.js";

/**
 * Combined functions export for VariableManager.loadModule()
 */
export const functions = {
    ...CoreArithmetic,
    ...NumberTheory,
    ...PolynomialFunctions,
    ...RationalFuncFunctions,
    ...PiecewiseFunctions,
};

/**
 * Variables/constants exported by this module
 */
export const variables = {
    // No package-level constants for now
};
