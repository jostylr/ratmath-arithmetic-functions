# ArithFuns Package Plan

This document outlines the comprehensive plan for the `arith-funs` package, providing arithmetic functions for rational numbers and integers including polynomials, number-theoretic functions, rational functions, and piecewise operations.

## Package Structure

```
packages/arith-funs/
├── src/
│   ├── index.js              # Main exports and registration
│   ├── ratmath-module.js     # Combined VariableManager module
│   ├── polynomial.js         # Polynomial operations
│   ├── rational-func.js      # Rational function operations
│   ├── piecewise.js          # Piecewise and step functions
│   ├── number-theory.js      # Integer/number-theoretic functions
│   └── core-arith.js         # Core arithmetic (abs, sign, etc.)
├── help/
│   ├── arith-funs.txt        # Main package help
│   ├── polynomial.txt        # Polynomial help
│   ├── rational-func.txt     # Rational function help
│   ├── piecewise.txt         # Piecewise help
│   ├── number-theory.txt     # Number theory help
│   └── synth-div.txt         # Synthetic division detailed help
├── tests/
│   ├── polynomial.test.js
│   ├── rational-func.test.js
│   ├── piecewise.test.js
│   ├── number-theory.test.js
│   └── core-arith.test.js
└── package.json
```

---

## Category 1: Polynomials

### Data Representation

Polynomials are stored as **decorated functions** using the object system:

```
P := x -> 3*x^2 + 2*x + 1
Set(P, "type", "poly")
Set(P, "coeffs", {1, 2, 3})       # constant term first: a₀, a₁, a₂, ...
Set(P, "degree", 2)
Set(P, "var", "x")                # variable name
```

Or using the constructor:

```
P := Poly({1, 2, 3})              # Creates polynomial 1 + 2x + 3x²
P := Poly({1, 2, 3}, "t")         # Uses variable t instead of x
```

### Functions

| Function | Signature | Description |
|----------|-----------|-------------|
| `Poly` | `Poly(coeffs, var?)` | Create polynomial from coefficient sequence |
| `PolyDeg` | `PolyDeg(P)` | Return degree of polynomial |
| `PolyCoeffs` | `PolyCoeffs(P)` | Return coefficient sequence |
| `PolyCoeff` | `PolyCoeff(P, n)` | Return nth coefficient (0-indexed) |
| `PolyEval` | `PolyEval(P, x)` | Evaluate polynomial at x |
| `PolyHorner` | `PolyHorner(P, x, showSteps?)` | Horner's method evaluation |
| `PolyAdd` | `PolyAdd(P, Q)` | Add two polynomials |
| `PolySub` | `PolySub(P, Q)` | Subtract polynomials |
| `PolyMul` | `PolyMul(P, Q)` | Multiply polynomials |
| `PolyDiv` | `PolyDiv(P, Q)` | Divide polynomials, return {quotient, remainder} |
| `PolyMod` | `PolyMod(P, Q)` | Return remainder of P/Q |
| `PolyGCD` | `PolyGCD(P, Q)` | Polynomial GCD |
| `PolyScale` | `PolyScale(P, c)` | Multiply polynomial by scalar |
| `PolyNeg` | `PolyNeg(P)` | Negate polynomial |
| `PolyDer` | `PolyDer(P, n?)` | nth derivative (default n=1) |
| `PolyInt` | `PolyInt(P, c?)` | Indefinite integral with constant c (default 0) |
| `PolyCompose` | `PolyCompose(P, Q)` | P(Q(x)) - compose polynomials |

### Synthetic Division

| Function | Signature | Description |
|----------|-----------|-------------|
| `SynthDiv` | `SynthDiv(P, c, showSteps?)` | Synthetic division by (x - c) |
| `SynthDivPoly` | `SynthDivPoly(P, c)` | Return quotient polynomial from synth div |
| `SynthDivRem` | `SynthDivRem(P, c)` | Return remainder (same as PolyEval) |
| `SynthDivSteps` | `SynthDivSteps(P, c)` | Return detailed step-by-step work |

**Step Output Format:**
```
SynthDivSteps(Poly({6, -5, -12, 4}), 3)
→ {
    divisor: 3,
    coeffs: {4, -12, -5, 6},      # descending order for display
    rows: {
      {4, 0, 0, 0},               # initial row
      {4, 12, 0, 0},              # multiply step
      {4, 0, 0, 0},               # add step
      ...
    },
    quotient: Poly({...}),
    remainder: 6
  }
```

### Taylor Polynomial Rebasing

| Function | Signature | Description |
|----------|-----------|-------------|
| `PolyRebase` | `PolyRebase(P, a)` | Express P(x) as polynomial in (x - a) |
| `PolyTaylor` | `PolyTaylor(P, a, showSteps?)` | Same as PolyRebase with optional steps |
| `PolyRebaseSteps` | `PolyRebaseSteps(P, a)` | Show repeated synthetic division process |

**Example:**
```
P := Poly({1, -6, 12, -8})        # (x-2)³ = x³ - 6x² + 12x - 8 rewritten as 1 - 6x + 12x² - 8x³
PolyRebase(P, 2)                  
→ Poly({1, 0, 0, 0})              # Becomes 1 + 0(x-2) + 0(x-2)² + 0(x-2)³ = 1

# Wait, need to reverse: -8x³ + 12x² - 6x + 1
# Better: store as ascending powers internally
```

### Root Finding & Analysis

| Function | Signature | Description |
|----------|-----------|-------------|
| `PolyRoots` | `PolyRoots(P, precision?)` | Find rational roots (exact) and real roots (interval) |
| `PolyRatRoots` | `PolyRatRoots(P)` | Find all rational roots (Rational Root Theorem) |
| `PolySignChanges` | `PolySignChanges(P)` | Count sign changes in coefficients (Descartes prep) |
| `PolyDescartes` | `PolyDescartes(P)` | Descartes' Rule of Signs analysis |
| `PolyDescartesNeg` | `PolyDescartesNeg(P)` | Descartes' Rule for negative roots P(-x) |
| `PolyBounds` | `PolyBounds(P)` | Cauchy/Lagrange bounds on real roots |

**Descartes Output:**
```
PolyDescartes(Poly({-4, 3, -1, 1}))   # x³ - x² + 3x - 4
→ {
    signChanges: 3,
    maxPositiveRoots: 3,
    possiblePositiveRoots: {3, 1},    # Can be 3 or 1 positive roots
    message: "At most 3 positive real roots (could be 3, 1)"
  }
```

### Extrema (requires oracle/interval support)

| Function | Signature | Description |
|----------|-----------|-------------|
| `PolyMax` | `PolyMax(P, a, b, precision?)` | Maximum of P on [a, b] |
| `PolyMin` | `PolyMin(P, a, b, precision?)` | Minimum of P on [a, b] |
| `PolyCritical` | `PolyCritical(P)` | Find critical points (roots of derivative) |
| `PolyInflection` | `PolyInflection(P)` | Find inflection points |

---

## Category 2: Number Theory & Integer Functions

### Basic Integer Operations

| Function | Signature | Description |
|----------|-----------|-------------|
| `Abs` | `Abs(x)` | Absolute value |
| `Sign` | `Sign(x)` | Sign: -1, 0, or 1 |
| `Floor` | `Floor(x)` | Floor function ⌊x⌋ |
| `Ceil` | `Ceil(x)` | Ceiling function ⌈x⌉ |
| `Round` | `Round(x)` | Round to nearest integer |
| `Trunc` | `Trunc(x)` | Truncate toward zero |
| `Frac` | `Frac(x)` | Fractional part x - ⌊x⌋ |
| `IntPart` | `IntPart(x)` | Integer part (same as Trunc) |

### Divisibility

| Function | Signature | Description |
|----------|-----------|-------------|
| `Gcd` | `Gcd(a, b, ...)` | Greatest common divisor |
| `Lcm` | `Lcm(a, b, ...)` | Least common multiple |
| `ExtGcd` | `ExtGcd(a, b)` | Extended Euclidean: {gcd, x, y} where ax + by = gcd |
| `Divides` | `Divides(a, b)` | Returns 1 if a divides b, 0 otherwise |
| `Mod` | `Mod(a, b)` | a mod b (always non-negative) |
| `Quot` | `Quot(a, b)` | Integer quotient ⌊a/b⌋ |
| `DivMod` | `DivMod(a, b)` | Returns {quotient, remainder} |
| `Coprime` | `Coprime(a, b)` | Returns 1 if gcd(a,b) = 1 |

### Prime Numbers

| Function | Signature | Description |
|----------|-----------|-------------|
| `IsPrime` | `IsPrime(n)` | Primality test |
| `NextPrime` | `NextPrime(n)` | Smallest prime > n |
| `PrevPrime` | `PrevPrime(n)` | Largest prime < n |
| `NthPrime` | `NthPrime(n)` | The nth prime number |
| `PrimePi` | `PrimePi(n)` | Count of primes ≤ n |
| `Primes` | `Primes(a, b?)` | List primes in range [a, b] or first a primes |
| `Factor` | `Factor(n)` | Prime factorization as sequence |
| `Divisors` | `Divisors(n)` | All divisors of n |
| `DivisorCount` | `DivisorCount(n)` | Number of divisors τ(n) |
| `DivisorSum` | `DivisorSum(n, k?)` | Sum of divisors σₖ(n), default k=1 |

### Modular Arithmetic

| Function | Signature | Description |
|----------|-----------|-------------|
| `ModPow` | `ModPow(base, exp, mod)` | base^exp mod m (efficient) |
| `ModInv` | `ModInv(a, m)` | Modular inverse of a mod m |
| `ModMul` | `ModMul(a, b, m)` | a * b mod m |
| `ModAdd` | `ModAdd(a, b, m)` | a + b mod m |
| `ChineseRem` | `ChineseRem(remainders, moduli)` | Chinese Remainder Theorem |
| `EulerPhi` | `EulerPhi(n)` | Euler's totient function φ(n) |
| `Mobius` | `Mobius(n)` | Möbius function μ(n) |
| `Carmichael` | `Carmichael(n)` | Carmichael function λ(n) |

### Combinatorics

| Function | Signature | Description |
|----------|-----------|-------------|
| `Factorial` | `Factorial(n)` | n! |
| `Binomial` | `Binomial(n, k)` | C(n,k) = n choose k |
| `Permutations` | `Permutations(n, k)` | P(n,k) = n!/(n-k)! |
| `Catalan` | `Catalan(n)` | nth Catalan number |
| `Fibonacci` | `Fibonacci(n)` | nth Fibonacci number |
| `Lucas` | `Lucas(n)` | nth Lucas number |

### Special Sequences

| Function | Signature | Description |
|----------|-----------|-------------|
| `Bernoulli` | `Bernoulli(n)` | nth Bernoulli number (rational) |
| `Harmonic` | `Harmonic(n)` | nth Harmonic number (rational) |
| `Stirling1` | `Stirling1(n, k)` | Stirling numbers of 1st kind |
| `Stirling2` | `Stirling2(n, k)` | Stirling numbers of 2nd kind |
| `Bell` | `Bell(n)` | nth Bell number |
| `Partition` | `Partition(n)` | Number of integer partitions |

---

## Category 3: Rational Functions

Rational functions are quotients of polynomials: R(x) = P(x)/Q(x)

### Data Representation

```
R := RatFunc(Poly({1, 2}), Poly({1, 0, 1}))   # (1 + 2x)/(1 + x²)
Set(R, "type", "ratfunc")
Set(R, "numer", P)
Set(R, "denom", Q)
```

### Functions

| Function | Signature | Description |
|----------|-----------|-------------|
| `RatFunc` | `RatFunc(P, Q)` | Create rational function P/Q |
| `RatFuncEval` | `RatFuncEval(R, x)` | Evaluate at x |
| `RatFuncAdd` | `RatFuncAdd(R, S)` | Add rational functions |
| `RatFuncSub` | `RatFuncSub(R, S)` | Subtract |
| `RatFuncMul` | `RatFuncMul(R, S)` | Multiply |
| `RatFuncDiv` | `RatFuncDiv(R, S)` | Divide |
| `RatFuncSimplify` | `RatFuncSimplify(R)` | Cancel common factors |
| `RatFuncNumer` | `RatFuncNumer(R)` | Get numerator polynomial |
| `RatFuncDenom` | `RatFuncDenom(R)` | Get denominator polynomial |
| `RatFuncDer` | `RatFuncDer(R)` | Derivative (quotient rule) |
| `RatFuncPoles` | `RatFuncPoles(R)` | Find poles (roots of denominator) |
| `RatFuncZeros` | `RatFuncZeros(R)` | Find zeros (roots of numerator) |
| `RatFuncAsymp` | `RatFuncAsymp(R)` | Analyze asymptotic behavior |

### Partial Fractions

| Function | Signature | Description |
|----------|-----------|-------------|
| `PartialFrac` | `PartialFrac(R)` | Partial fraction decomposition |
| `PartialFracSteps` | `PartialFracSteps(R)` | Show decomposition steps |

---

## Category 4: Piecewise & Step Functions

### Data Representation

```
F := Piecewise(
    {x -> x^2, x < 0},
    {x -> x, 0 <= x < 2},
    {x -> 4, x >= 2}
)
Set(F, "type", "piecewise")
Set(F, "pieces", {...})
```

### Functions

| Function | Signature | Description |
|----------|-----------|-------------|
| `Piecewise` | `Piecewise(piece1, piece2, ...)` | Create piecewise function |
| `PiecewiseEval` | `PiecewiseEval(F, x)` | Evaluate at x |
| `Step` | `Step(x)` | Heaviside step: 0 if x < 0, 1 if x ≥ 0 |
| `UnitStep` | `UnitStep(x, a?)` | Step at a: 0 if x < a, 1 if x ≥ a |
| `Rect` | `Rect(x, a, b)` | Rectangle: 1 if a ≤ x ≤ b, 0 otherwise |
| `Sgn` | `Sgn(x)` | Sign function alias |
| `Ramp` | `Ramp(x)` | Ramp function: max(0, x) |
| `Clamp` | `Clamp(x, lo, hi)` | Clamp x to [lo, hi] |
| `PiecewiseAdd` | `PiecewiseAdd(F, G)` | Add piecewise functions |
| `PiecewiseMul` | `PiecewiseMul(F, G)` | Multiply piecewise functions |
| `PiecewiseCompose` | `PiecewiseCompose(F, G)` | Compose F(G(x)) |

### Interval Indicator Functions

| Function | Signature | Description |
|----------|-----------|-------------|
| `Chi` | `Chi(x, a, b)` | Characteristic function of [a, b] |
| `ChiOpen` | `ChiOpen(x, a, b)` | Characteristic of (a, b) |
| `ChiLeftOpen` | `ChiLeftOpen(x, a, b)` | Characteristic of (a, b] |
| `ChiRightOpen` | `ChiRightOpen(x, a, b)` | Characteristic of [a, b) |

---

## Category 5: Core Arithmetic

### Basic Functions

| Function | Signature | Description |
|----------|-----------|-------------|
| `Abs` | `Abs(x)` | Absolute value |
| `Sign` | `Sign(x)` | Sign: -1, 0, 1 |
| `Max` | `Max(a, b, ...)` | Maximum |
| `Min` | `Min(a, b, ...)` | Minimum |
| `Numer` | `Numer(x)` | Numerator of rational |
| `Denom` | `Denom(x)` | Denominator of rational |
| `Reduce` | `Reduce(x)` | Reduce fraction to lowest terms |
| `Reciprocal` | `Reciprocal(x)` | 1/x |
| `Neg` | `Neg(x)` | -x |

### Rounding

| Function | Signature | Description |
|----------|-----------|-------------|
| `Floor` | `Floor(x)` | ⌊x⌋ |
| `Ceil` | `Ceil(x)` | ⌈x⌉ |
| `Round` | `Round(x, places?)` | Round to places decimal places |
| `Trunc` | `Trunc(x)` | Truncate toward zero |
| `Frac` | `Frac(x)` | Fractional part |

### Comparison

| Function | Signature | Description |
|----------|-----------|-------------|
| `Cmp` | `Cmp(a, b)` | Compare: -1, 0, 1 |
| `Eq` | `Eq(a, b)` | Equality test (returns 0 or 1) |
| `Lt` | `Lt(a, b)` | Less than |
| `Le` | `Le(a, b)` | Less or equal |
| `Gt` | `Gt(a, b)` | Greater than |
| `Ge` | `Ge(a, b)` | Greater or equal |
| `Between` | `Between(x, a, b)` | a ≤ x ≤ b |

---

## Syntax Design Patterns

### 1. Constructor Pattern
```
P := Poly({1, 2, 3})              # Ascending coefficients
R := RatFunc(P, Q)
F := Piecewise(...)
```

### 2. Method-Style via Decoration
```
P := Poly({1, 2, 3})
Get(P, "degree")                  # → 2
Get(P, "coeffs")                  # → {1, 2, 3}
```

### 3. Functional Operations
```
PolyAdd(P, Q)                     # Returns new polynomial
PolyDer(P)                        # Returns derivative
```

### 4. In-Place Mutation (optional)
```
PolyAdd!(P, Q)                    # Mutates P (if we want to support this)
```

### 5. Show Steps Option
```
SynthDiv(P, 3)                    # Just result
SynthDiv(P, 3, 1)                 # With step-by-step output
SynthDivSteps(P, 3)               # Dedicated function for steps
```

### 6. Precision Parameter
```
PolyRoots(P)                      # Default precision
PolyRoots(P, 1/1000000)           # High precision for irrational roots
```

---

## Decoration Schema

### Polynomial Decorations
```
Set(P, "type", "poly")
Set(P, "coeffs", {a0, a1, a2, ...})   # Ascending powers
Set(P, "degree", n)
Set(P, "var", "x")
Set(P, "monic", 1)                    # If leading coeff is 1
Set(P, "irreducible", 1)              # If known irreducible
```

### Rational Function Decorations
```
Set(R, "type", "ratfunc")
Set(R, "numer", P)
Set(R, "denom", Q)
Set(R, "simplified", 1)               # If in lowest terms
```

### Piecewise Decorations
```
Set(F, "type", "piecewise")
Set(F, "pieces", {...})
Set(F, "continuous", 1)
Set(F, "breakpoints", {a, b, c})
```

---

## Implementation Priority

### Phase 1: Core Arithmetic
- [x] Abs, Sign, Max, Min
- [ ] Floor, Ceil, Round, Trunc, Frac
- [ ] Numer, Denom, Reduce
- [ ] Comparison functions

### Phase 2: Basic Number Theory
- [ ] Gcd, Lcm, ExtGcd
- [ ] Mod, Quot, DivMod
- [ ] IsPrime, NextPrime, Factor
- [ ] Factorial, Binomial

### Phase 3: Polynomials (Core)
- [ ] Poly constructor and storage
- [ ] PolyEval, PolyHorner
- [ ] PolyAdd, PolySub, PolyMul
- [ ] PolyDer, PolyInt

### Phase 4: Polynomials (Advanced)
- [ ] SynthDiv, SynthDivSteps
- [ ] PolyRebase (Taylor)
- [ ] PolyDescartes, PolySignChanges
- [ ] PolyRatRoots

### Phase 5: Rational Functions
- [ ] RatFunc constructor
- [ ] Arithmetic operations
- [ ] Simplification
- [ ] Partial fractions

### Phase 6: Piecewise Functions
- [ ] Piecewise constructor
- [ ] Step, Rect, Ramp, Clamp
- [ ] Evaluation logic

### Phase 7: Advanced Number Theory
- [ ] Modular arithmetic suite
- [ ] EulerPhi, Mobius
- [ ] Special sequences

---

## Test Strategy

### Unit Tests
Each function gets dedicated tests:
```javascript
test("Poly creates polynomial with correct coefficients", () => {...});
test("PolyEval correctly evaluates at given point", () => {...});
test("SynthDiv matches PolyDiv for linear divisors", () => {...});
```

### Property Tests
- `PolyAdd` is commutative: `PolyAdd(P, Q) == PolyAdd(Q, P)`
- `PolyMul` distributes: `PolyMul(P, PolyAdd(Q, R)) == PolyAdd(PolyMul(P,Q), PolyMul(P,R))`
- `SynthDiv` remainder equals `PolyEval`: `SynthDivRem(P, c) == PolyEval(P, c)`

### Integration Tests
- Full workflows: define polynomial → differentiate → find roots → evaluate
- Step-by-step output formatting

---

## Help File Structure

Each help file follows this template:
```
<Category Name> - Brief Description

FUNCTIONS:
  FuncName(args)      - Description

EXAMPLES:
  FuncName(...)       → result

NOTES:
  - Important details
  - Edge cases
```

---

## Dependencies

- `@ratmath/core`: Integer, Rational, RationalInterval
- `@ratmath/stdlib`: Object functions (Get, Set, Type, etc.)
- `@ratmath/algebra`: VariableManager integration

---

## Open Questions

1. **Coefficient Order**: Ascending (a₀, a₁, ...) vs descending (aₙ, ..., a₀)?
   - Recommendation: **Ascending internally**, display descending for traditional notation

2. **Oracle Integration**: How to plug in oracles for root finding?
   - Proposed: Accept oracle as optional parameter, or use interval arithmetic

3. **Variable Names**: Store symbolic variable or assume 'x'?
   - Proposed: Default to 'x', allow override via parameter or decoration

4. **Mutability**: Should polynomial operations mutate or return new?
   - Proposed: Return new (functional style), optional `!` suffix for mutation

5. **Complex Numbers**: Support complex coefficients?
   - Proposed: Not in initial release, add later as extension
