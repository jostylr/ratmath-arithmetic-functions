import { describe, test, expect, beforeEach } from "bun:test";
import { VariableManager } from "@ratmath/algebra";
import { Integer, Rational } from "@ratmath/core";

describe("Core Arithmetic Functions", () => {
    let vm;

    beforeEach(() => {
        vm = new VariableManager();
        // TODO: Load arith-funs module when implemented
    });

    describe("Abs", () => {
        test.todo("Abs of positive integer", () => {
            expect(vm.processInput("Abs(5)").result.toString()).toBe("5");
        });

        test.todo("Abs of negative integer", () => {
            expect(vm.processInput("Abs(-5)").result.toString()).toBe("5");
        });

        test.todo("Abs of zero", () => {
            expect(vm.processInput("Abs(0)").result.toString()).toBe("0");
        });

        test.todo("Abs of positive rational", () => {
            expect(vm.processInput("Abs(3/4)").result.toString()).toBe("3/4");
        });

        test.todo("Abs of negative rational", () => {
            expect(vm.processInput("Abs(-3/4)").result.toString()).toBe("3/4");
        });
    });

    describe("Sign", () => {
        test.todo("Sign of positive", () => {
            expect(vm.processInput("Sign(5)").result.toString()).toBe("1");
            expect(vm.processInput("Sign(1/2)").result.toString()).toBe("1");
        });

        test.todo("Sign of negative", () => {
            expect(vm.processInput("Sign(-5)").result.toString()).toBe("-1");
            expect(vm.processInput("Sign(-1/2)").result.toString()).toBe("-1");
        });

        test.todo("Sign of zero", () => {
            expect(vm.processInput("Sign(0)").result.toString()).toBe("0");
        });
    });

    describe("Max and Min", () => {
        test.todo("Max of two numbers", () => {
            expect(vm.processInput("Max(3, 7)").result.toString()).toBe("7");
            expect(vm.processInput("Max(-3, -7)").result.toString()).toBe("-3");
        });

        test.todo("Max of multiple numbers", () => {
            expect(vm.processInput("Max(3, 7, 2, 9, 4)").result.toString()).toBe("9");
        });

        test.todo("Max with rationals", () => {
            expect(vm.processInput("Max(1/2, 2/3)").result.toString()).toBe("2/3");
        });

        test.todo("Min of two numbers", () => {
            expect(vm.processInput("Min(3, 7)").result.toString()).toBe("3");
        });

        test.todo("Min of multiple numbers", () => {
            expect(vm.processInput("Min(3, 7, 2, 9, 4)").result.toString()).toBe("2");
        });
    });

    describe("Numer and Denom", () => {
        test.todo("Numer extracts numerator", () => {
            expect(vm.processInput("Numer(3/4)").result.toString()).toBe("3");
            expect(vm.processInput("Numer(-3/4)").result.toString()).toBe("-3");
        });

        test.todo("Denom extracts denominator", () => {
            expect(vm.processInput("Denom(3/4)").result.toString()).toBe("4");
        });

        test.todo("Numer of integer returns integer", () => {
            expect(vm.processInput("Numer(5)").result.toString()).toBe("5");
        });

        test.todo("Denom of integer returns 1", () => {
            expect(vm.processInput("Denom(5)").result.toString()).toBe("1");
        });
    });

    describe("Reduce", () => {
        test.todo("Reduce simplifies fraction", () => {
            // Note: rationals are usually auto-reduced, but this tests explicit reduction
            expect(vm.processInput("Reduce(6/8)").result.toString()).toBe("3/4");
        });
    });

    describe("Reciprocal and Neg", () => {
        test.todo("Reciprocal of rational", () => {
            expect(vm.processInput("Reciprocal(3/4)").result.toString()).toBe("4/3");
        });

        test.todo("Reciprocal of integer", () => {
            expect(vm.processInput("Reciprocal(5)").result.toString()).toBe("1/5");
        });

        test.todo("Reciprocal of zero throws", () => {
            expect(() => vm.processInput("Reciprocal(0)")).toThrow();
        });

        test.todo("Neg negates value", () => {
            expect(vm.processInput("Neg(5)").result.toString()).toBe("-5");
            expect(vm.processInput("Neg(-3/4)").result.toString()).toBe("3/4");
        });
    });

    describe("Comparison Functions", () => {
        test.todo("Cmp returns comparison result", () => {
            expect(vm.processInput("Cmp(3, 5)").result.toString()).toBe("-1");
            expect(vm.processInput("Cmp(5, 5)").result.toString()).toBe("0");
            expect(vm.processInput("Cmp(7, 5)").result.toString()).toBe("1");
        });

        test.todo("Eq tests equality", () => {
            expect(vm.processInput("Eq(3, 3)").result.toString()).toBe("1");
            expect(vm.processInput("Eq(3, 4)").result.toString()).toBe("0");
            expect(vm.processInput("Eq(1/2, 2/4)").result.toString()).toBe("1");
        });

        test.todo("Lt tests less than", () => {
            expect(vm.processInput("Lt(3, 5)").result.toString()).toBe("1");
            expect(vm.processInput("Lt(5, 5)").result.toString()).toBe("0");
            expect(vm.processInput("Lt(7, 5)").result.toString()).toBe("0");
        });

        test.todo("Le tests less or equal", () => {
            expect(vm.processInput("Le(3, 5)").result.toString()).toBe("1");
            expect(vm.processInput("Le(5, 5)").result.toString()).toBe("1");
            expect(vm.processInput("Le(7, 5)").result.toString()).toBe("0");
        });

        test.todo("Gt tests greater than", () => {
            expect(vm.processInput("Gt(7, 5)").result.toString()).toBe("1");
            expect(vm.processInput("Gt(5, 5)").result.toString()).toBe("0");
        });

        test.todo("Ge tests greater or equal", () => {
            expect(vm.processInput("Ge(7, 5)").result.toString()).toBe("1");
            expect(vm.processInput("Ge(5, 5)").result.toString()).toBe("1");
            expect(vm.processInput("Ge(3, 5)").result.toString()).toBe("0");
        });

        test.todo("Between tests range inclusion", () => {
            expect(vm.processInput("Between(5, 3, 7)").result.toString()).toBe("1");
            expect(vm.processInput("Between(3, 3, 7)").result.toString()).toBe("1");
            expect(vm.processInput("Between(7, 3, 7)").result.toString()).toBe("1");
            expect(vm.processInput("Between(2, 3, 7)").result.toString()).toBe("0");
            expect(vm.processInput("Between(8, 3, 7)").result.toString()).toBe("0");
        });
    });
});
