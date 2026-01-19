import { describe, test, expect, beforeEach } from "bun:test";
import { VariableManager } from "@ratmath/algebra";
import { Integer, Rational } from "@ratmath/core";

describe("Piecewise and Step Functions", () => {
    let vm;

    beforeEach(() => {
        vm = new VariableManager();
        // TODO: Load arith-funs module when implemented
    });

    describe("Step Function", () => {
        test.todo("Step returns 0 for negative input", () => {
            expect(vm.processInput("Step(-5)").result.toString()).toBe("0");
            expect(vm.processInput("Step(-1/2)").result.toString()).toBe("0");
        });

        test.todo("Step returns 1 for zero and positive input", () => {
            expect(vm.processInput("Step(0)").result.toString()).toBe("1");
            expect(vm.processInput("Step(5)").result.toString()).toBe("1");
            expect(vm.processInput("Step(1/2)").result.toString()).toBe("1");
        });
    });

    describe("UnitStep", () => {
        test.todo("UnitStep(x, a) returns 0 if x < a", () => {
            expect(vm.processInput("UnitStep(1, 3)").result.toString()).toBe("0");
        });

        test.todo("UnitStep(x, a) returns 1 if x >= a", () => {
            expect(vm.processInput("UnitStep(5, 3)").result.toString()).toBe("1");
            expect(vm.processInput("UnitStep(3, 3)").result.toString()).toBe("1");
        });
    });

    describe("Rect", () => {
        test.todo("Rect returns 1 inside interval", () => {
            expect(vm.processInput("Rect(3/2, 1, 2)").result.toString()).toBe("1");
            expect(vm.processInput("Rect(1, 1, 2)").result.toString()).toBe("1");
            expect(vm.processInput("Rect(2, 1, 2)").result.toString()).toBe("1");
        });

        test.todo("Rect returns 0 outside interval", () => {
            expect(vm.processInput("Rect(0, 1, 2)").result.toString()).toBe("0");
            expect(vm.processInput("Rect(3, 1, 2)").result.toString()).toBe("0");
        });
    });

    describe("Ramp", () => {
        test.todo("Ramp returns 0 for negative", () => {
            expect(vm.processInput("Ramp(-5)").result.toString()).toBe("0");
        });

        test.todo("Ramp returns x for non-negative", () => {
            expect(vm.processInput("Ramp(0)").result.toString()).toBe("0");
            expect(vm.processInput("Ramp(5)").result.toString()).toBe("5");
            expect(vm.processInput("Ramp(3/2)").result.toString()).toBe("3/2");
        });
    });

    describe("Clamp", () => {
        test.todo("Clamp returns x if in range", () => {
            expect(vm.processInput("Clamp(5, 0, 10)").result.toString()).toBe("5");
        });

        test.todo("Clamp returns lo if x < lo", () => {
            expect(vm.processInput("Clamp(-5, 0, 10)").result.toString()).toBe("0");
        });

        test.todo("Clamp returns hi if x > hi", () => {
            expect(vm.processInput("Clamp(15, 0, 10)").result.toString()).toBe("10");
        });
    });

    describe("Indicator Functions", () => {
        test.todo("Chi closed interval", () => {
            expect(vm.processInput("Chi(3/2, 1, 2)").result.toString()).toBe("1");
            expect(vm.processInput("Chi(1, 1, 2)").result.toString()).toBe("1");
            expect(vm.processInput("Chi(2, 1, 2)").result.toString()).toBe("1");
            expect(vm.processInput("Chi(0, 1, 2)").result.toString()).toBe("0");
        });

        test.todo("ChiOpen open interval", () => {
            expect(vm.processInput("ChiOpen(3/2, 1, 2)").result.toString()).toBe("1");
            expect(vm.processInput("ChiOpen(1, 1, 2)").result.toString()).toBe("0");
            expect(vm.processInput("ChiOpen(2, 1, 2)").result.toString()).toBe("0");
        });

        test.todo("ChiLeftOpen half-open (a,b]", () => {
            expect(vm.processInput("ChiLeftOpen(1, 1, 2)").result.toString()).toBe("0");
            expect(vm.processInput("ChiLeftOpen(2, 1, 2)").result.toString()).toBe("1");
        });

        test.todo("ChiRightOpen half-open [a,b)", () => {
            expect(vm.processInput("ChiRightOpen(1, 1, 2)").result.toString()).toBe("1");
            expect(vm.processInput("ChiRightOpen(2, 1, 2)").result.toString()).toBe("0");
        });
    });

    describe("Piecewise Constructor", () => {
        test.todo("Creates piecewise function", () => {
            const input = `
                F := Piecewise(
                    {x -> x^2, x < 0},
                    {x -> x, x >= 0}
                )
            `;
            vm.processInput(input);
            const result = vm.processInput('Type(F, "piecewise")');
            expect(result.result.toString()).toBe("1");
        });
    });

    describe("PiecewiseEval", () => {
        test.todo("Evaluates correct piece for negative", () => {
            vm.processInput(`
                F := Piecewise(
                    {x -> x^2, x < 0},
                    {x -> x, x >= 0}
                )
            `);
            const result = vm.processInput("PiecewiseEval(F, -3)");
            expect(result.result.toString()).toBe("9");
        });

        test.todo("Evaluates correct piece for non-negative", () => {
            vm.processInput(`
                F := Piecewise(
                    {x -> x^2, x < 0},
                    {x -> x, x >= 0}
                )
            `);
            const result = vm.processInput("PiecewiseEval(F, 5)");
            expect(result.result.toString()).toBe("5");
        });

        test.todo("Evaluates at boundary", () => {
            vm.processInput(`
                F := Piecewise(
                    {x -> x^2, x < 0},
                    {x -> x, x >= 0}
                )
            `);
            const result = vm.processInput("PiecewiseEval(F, 0)");
            expect(result.result.toString()).toBe("0");
        });
    });

    describe("Piecewise Arithmetic", () => {
        test.todo("PiecewiseAdd adds two piecewise functions", () => {
            vm.processInput("F := Piecewise({x -> 1, x < 0}, {x -> 2, x >= 0})");
            vm.processInput("G := Piecewise({x -> 3, x < 1}, {x -> 4, x >= 1})");
            vm.processInput("H := PiecewiseAdd(F, G)");
            // At x = -1: F = 1, G = 3, sum = 4
            // At x = 0: F = 2, G = 3, sum = 5
            // At x = 2: F = 2, G = 4, sum = 6
        });

        test.todo("PiecewiseMul multiplies piecewise functions", () => {
            vm.processInput("F := Piecewise({x -> 2, x < 0}, {x -> 3, x >= 0})");
            vm.processInput("G := Piecewise({x -> 4, x < 0}, {x -> 5, x >= 0})");
            vm.processInput("H := PiecewiseMul(F, G)");
            // At x = -1: 2 * 4 = 8
            // At x = 1: 3 * 5 = 15
        });
    });

    describe("Piecewise Properties", () => {
        test.todo("Get breakpoints", () => {
            vm.processInput(`
                F := Piecewise(
                    {x -> x^2, x < -1},
                    {x -> x, -1 <= x < 2},
                    {x -> 4, x >= 2}
                )
            `);
            const result = vm.processInput('Get(F, "breakpoints")');
            // Should be {-1, 2}
        });
    });
});
