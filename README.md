# @ratmath/arith-funs

Arithmetic functions for RatMath: polynomials, number theory, rational functions, and piecewise operations.

## Installation

```bash
LOAD arith-funs
```

## Categories

### 1. Polynomials
Create and manipulate polynomials with exact rational coefficients.

```
P := Poly({1, 2, 3})        # 1 + 2x + 3x²
PolyEval(P, 2)              → 17
SynthDiv(P, 1)              → {quotient, remainder}
PolyRebase(P, a)            → Taylor expansion at x=a
PolyDescartes(P)            → Sign change analysis
PolyRatRoots(P)             → Find rational roots
```

### 2. Number Theory
Integer and number-theoretic functions.

```
Gcd(48, 18)                 → 6
Factor(60)                  → {2, 2, 3, 5}
IsPrime(17)                 → 1
ModPow(3, 100, 7)           → 4
Binomial(10, 3)             → 120
Fibonacci(10)               → 55
```

### 3. Rational Functions
Quotients of polynomials with partial fraction decomposition.

```
R := RatFunc(P, Q)          # P(x)/Q(x)
RatFuncEval(R, x)           → Evaluate
PartialFrac(R)              → Decomposition
```

### 4. Piecewise & Step Functions
Define and evaluate piecewise functions.

```
Step(x)                     # Heaviside: 0 if x<0, 1 if x≥0
Rect(x, a, b)               # 1 if a≤x≤b
Clamp(x, lo, hi)            # Clamp to [lo, hi]
Chi(x, a, b)                # Characteristic of [a,b]
```

### 5. Core Arithmetic
Basic operations on rationals.

```
Abs(-5)                     → 5
Sign(-3)                    → -1
Floor(7/3)                  → 2
Max(3, 7, 2)                → 7
Numer(3/4)                  → 3
```

## Function Reference

See `PLAN.md` for complete function specifications.

| Category | Functions |
|----------|-----------|
| Polynomials | `Poly`, `PolyEval`, `PolyHorner`, `PolyAdd`, `PolySub`, `PolyMul`, `PolyDer`, `PolyInt`, `SynthDiv`, `PolyRebase`, `PolyDescartes`, `PolyRatRoots` |
| Number Theory | `Gcd`, `Lcm`, `ExtGcd`, `IsPrime`, `Factor`, `Divisors`, `ModPow`, `ModInv`, `EulerPhi`, `Factorial`, `Binomial`, `Fibonacci` |
| Rational Funcs | `RatFunc`, `RatFuncEval`, `PartialFrac` |
| Piecewise | `Step`, `UnitStep`, `Rect`, `Ramp`, `Clamp`, `Chi`, `Piecewise` |
| Core | `Abs`, `Sign`, `Max`, `Min`, `Floor`, `Ceil`, `Round`, `Numer`, `Denom` |

## Help

```
HELP arith-funs             # Package overview
HELP polynomial             # Polynomial operations
HELP synth-div              # Synthetic division
HELP number-theory          # Number-theoretic functions
HELP piecewise              # Piecewise functions
```

## Testing

```bash
bun test packages/arith-funs/tests/
```
