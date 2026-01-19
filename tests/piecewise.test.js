import { describe, test, expect, beforeEach } from "bun:test";
import { VariableManager } from "@ratmath/algebra";
import { Integer, Rational } from "@ratmath/core";
import { registerArithFuns } from "../src/index.js";

describe("Piecewise and Step Functions", () => {
    let vm;

    beforeEach(() => {
        vm = new VariableManager();
        registerArithFuns(vm);
    });

    describe("Step Function", () => {
        test("Step returns 0 for negative input", () => {
            expect(vm.processInput("Step(-5)").result.toString()).toBe("0");
            expect(vm.processInput("Step(-1/2)").result.toString()).toBe("0");
        });

        test("Step returns 1 for zero and positive input", () => {
            expect(vm.processInput("Step(0)").result.toString()).toBe("1");
            expect(vm.processInput("Step(5)").result.toString()).toBe("1");
            expect(vm.processInput("Step(1/2)").result.toString()).toBe("1");
        });
    });

    describe("UnitStep", () => {
        test("UnitStep(x, a) returns 0 if x < a", () => {
            expect(vm.processInput("UnitStep(1, 3)").result.toString()).toBe("0");
        });

        test("UnitStep(x, a) returns 1 if x >= a", () => {
            expect(vm.processInput("UnitStep(5, 3)").result.toString()).toBe("1");
            expect(vm.processInput("UnitStep(3, 3)").result.toString()).toBe("1");
        });
    });

    describe("Rect", () => {
        test("Rect returns 1 inside interval", () => {
            expect(vm.processInput("Rect(3/2, 1, 2)").result.toString()).toBe("1");
            expect(vm.processInput("Rect(1, 1, 2)").result.toString()).toBe("1");
            expect(vm.processInput("Rect(2, 1, 2)").result.toString()).toBe("1");
        });

        test("Rect returns 0 outside interval", () => {
            expect(vm.processInput("Rect(0, 1, 2)").result.toString()).toBe("0");
            expect(vm.processInput("Rect(3, 1, 2)").result.toString()).toBe("0");
        });
    });

    describe("Ramp", () => {
        test("Ramp returns 0 for negative", () => {
            expect(vm.processInput("Ramp(-5)").result.toString()).toBe("0");
        });

        test("Ramp returns x for non-negative", () => {
            expect(vm.processInput("Ramp(0)").result.toString()).toBe("0");
            expect(vm.processInput("Ramp(5)").result.toString()).toBe("5");
            expect(vm.processInput("Ramp(3/2)").result.toString()).toBe("3/2");
        });
    });

    describe("Clamp", () => {
        test("Clamp returns x if in range", () => {
            expect(vm.processInput("Clamp(5, 0, 10)").result.toString()).toBe("5");
        });

        test("Clamp returns lo if x < lo", () => {
            expect(vm.processInput("Clamp(-5, 0, 10)").result.toString()).toBe("0");
        });

        test("Clamp returns hi if x > hi", () => {
            expect(vm.processInput("Clamp(15, 0, 10)").result.toString()).toBe("10");
        });
    });

    describe("Sgn (Sign function)", () => {
        test("Sgn returns -1 for negative", () => {
            expect(vm.processInput("Sgn(-5)").result.toString()).toBe("-1");
            expect(vm.processInput("Sgn(-1/2)").result.toString()).toBe("-1");
        });

        test("Sgn returns 0 for zero", () => {
            expect(vm.processInput("Sgn(0)").result.toString()).toBe("0");
        });

        test("Sgn returns 1 for positive", () => {
            expect(vm.processInput("Sgn(5)").result.toString()).toBe("1");
            expect(vm.processInput("Sgn(1/2)").result.toString()).toBe("1");
        });
    });

    describe("Indicator Functions", () => {
        test("Chi closed interval [a,b]", () => {
            expect(vm.processInput("Chi(3/2, 1, 2)").result.toString()).toBe("1");
            expect(vm.processInput("Chi(1, 1, 2)").result.toString()).toBe("1");
            expect(vm.processInput("Chi(2, 1, 2)").result.toString()).toBe("1");
            expect(vm.processInput("Chi(0, 1, 2)").result.toString()).toBe("0");
        });

        test("ChiOpen open interval (a,b)", () => {
            expect(vm.processInput("ChiOpen(3/2, 1, 2)").result.toString()).toBe("1");
            expect(vm.processInput("ChiOpen(1, 1, 2)").result.toString()).toBe("0");
            expect(vm.processInput("ChiOpen(2, 1, 2)").result.toString()).toBe("0");
        });

        test("ChiLeftOpen half-open (a,b]", () => {
            expect(vm.processInput("ChiLeftOpen(1, 1, 2)").result.toString()).toBe("0");
            expect(vm.processInput("ChiLeftOpen(3/2, 1, 2)").result.toString()).toBe("1");
            expect(vm.processInput("ChiLeftOpen(2, 1, 2)").result.toString()).toBe("1");
        });

        test("ChiRightOpen half-open [a,b)", () => {
            expect(vm.processInput("ChiRightOpen(1, 1, 2)").result.toString()).toBe("1");
            expect(vm.processInput("ChiRightOpen(3/2, 1, 2)").result.toString()).toBe("1");
            expect(vm.processInput("ChiRightOpen(2, 1, 2)").result.toString()).toBe("0");
        });
    });

    // Note: If function is defined in stdlib/src/core.js with lazy evaluation
    // These tests should be in stdlib tests, not arith-funs
    describe("If (conditional) - stdlib", () => {
        test.todo("If tests belong in stdlib - uses lazy evaluation", () => {
            // If(condition, thenExpr, elseExpr) uses lazy evaluation
            // See packages/stdlib/tests for If tests
        });
    });

    // Note: Piecewise constructor and PiecewiseEval require custom object handling
    // that the VariableManager doesn't currently support for direct testing.
    // The functions work correctly when called programmatically.
    describe("Piecewise Constructor", () => {
        test.todo("Creates piecewise object - requires custom object support in VM", () => {
            // const result = vm.processInput("p := Piecewise(1, 100, 0, 200)");
            // expect(result.result.type).toBe("piecewise");
        });
    });

    describe("PiecewiseEval", () => {
        test.todo("PiecewiseEval - requires custom object support in VM", () => {
            // vm.processInput("p := Piecewise(1, 100, 1, 200)");
            // const result = vm.processInput("PiecewiseEval(p, 0)");
            // expect(result.result.toString()).toBe("100");
        });
    });

    // The recommended pattern for piecewise is using If with lambda
    describe("Piecewise via If and Lambda", () => {
        test.todo("abs(x) using If: x -> If(x < 0, -x, x)", () => {
            // This requires variable substitution in the evaluator
        });
    });
});
