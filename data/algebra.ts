import type { PuzzleInput } from "@/lib/types";

export const algebra: PuzzleInput[] = [
  {
    slug: "reciprocal-cube",
    title: "The Reciprocal Cube",
    category: "algebra",
    difficulty: "Easy",
    minutes: 5,
    teaser: "One equation about x + 1/x. Can you reach the cubes without solving for x?",
    statement: String.raw`Let $x$ be a real number satisfying
$$x + \frac{1}{x} = 3.$$
What is the value of $x^3 + \dfrac{1}{x^3}$?`,
    hints: [
      String.raw`You don't need to find $x$. What happens if you cube both sides of the equation?`,
      String.raw`The expansion of $\left(x+\frac1x\right)^3$ contains $x^3+\frac1{x^3}$ plus a multiple of $x+\frac1x$.`,
    ],
    answer: String.raw`$18$`,
    answerValue: "18",
    solution: [
      String.raw`Cube both sides: $\left(x+\frac1x\right)^3 = x^3 + 3x + \frac3x + \frac1{x^3}$.`,
      String.raw`Group the middle terms: $\left(x^3+\frac1{x^3}\right) + 3\left(x+\frac1x\right) = 27$.`,
      String.raw`Substitute $x+\frac1x=3$: $x^3+\frac1{x^3} + 9 = 27$, so $x^3+\frac1{x^3}=18$.`,
      String.raw`Such an $x$ exists: $x^2-3x+1=0$ has real roots because its discriminant is $5>0$.`,
    ],
    source: "Original",
  },
  {
    slug: "telescoping-radicals",
    title: "Telescoping Radicals",
    category: "algebra",
    difficulty: "Medium",
    minutes: 10,
    teaser: "Forty-eight ugly fractions collapse into one clean integer.",
    statement: String.raw`Evaluate
$$\sum_{n=1}^{48} \frac{1}{\sqrt{n}+\sqrt{n+1}}.$$`,
    hints: [
      String.raw`Try rationalizing the denominator of a single term, say $n=1$.`,
      String.raw`Each term simplifies to a difference $\sqrt{n+1}-\sqrt{n}$. Write out the first few terms and watch what cancels.`,
    ],
    answer: String.raw`$6$`,
    answerValue: "6",
    solution: [
      String.raw`Multiply numerator and denominator by $\sqrt{n+1}-\sqrt n$. The denominator becomes $(n+1)-n=1$, so $\dfrac{1}{\sqrt n+\sqrt{n+1}}=\sqrt{n+1}-\sqrt n$.`,
      String.raw`The sum is $(\sqrt2-\sqrt1)+(\sqrt3-\sqrt2)+\cdots+(\sqrt{49}-\sqrt{48})$.`,
      String.raw`Every intermediate square root appears once with each sign, so only the ends survive: $\sqrt{49}-\sqrt1 = 7-1 = 6$.`,
    ],
    source: "Original",
  },
  {
    slug: "reciprocal-functional",
    title: "A Function That Talks to Itself",
    category: "algebra",
    difficulty: "Medium",
    minutes: 10,
    teaser: "A function is tied to its own reciprocal. Untie it with two equations.",
    statement: String.raw`A function $f$ is defined for all nonzero real numbers and satisfies
$$f(x) + 2f\!\left(\frac1x\right) = 3x \quad\text{for every } x\neq 0.$$
Find $f(2)$.`,
    hints: [
      String.raw`The equation holds for every $x$, so it also holds when $x$ is replaced by $\tfrac1x$.`,
      String.raw`You now have two linear equations in the two unknowns $f(x)$ and $f(1/x)$. Eliminate one.`,
    ],
    answer: String.raw`$f(2)=-1$`,
    answerValue: "-1",
    solution: [
      String.raw`Replace $x$ with $\tfrac1x$: $f\!\left(\tfrac1x\right)+2f(x)=\tfrac3x$.`,
      String.raw`Double it: $2f\!\left(\tfrac1x\right)+4f(x)=\tfrac6x$. Subtract the original equation: $3f(x)=\tfrac6x-3x$.`,
      String.raw`So $f(x)=\dfrac2x-x$ and $f(2)=1-2=-1$.`,
      String.raw`Check: $f(2)=-1$ and $f(\tfrac12)=4-\tfrac12=\tfrac72$, giving $-1+2\cdot\tfrac72=6=3\cdot2$. ✓`,
    ],
    source: "Original",
  },
  {
    slug: "reciprocal-pairs",
    title: "Reciprocal Pairs",
    category: "algebra",
    difficulty: "Hard",
    minutes: 20,
    teaser: "Count the ordered pairs whose reciprocals add to one twelfth.",
    statement: String.raw`How many ordered pairs $(x,y)$ of **positive integers** satisfy
$$\frac1x+\frac1y=\frac1{12}\,?$$`,
    hints: [
      String.raw`Clear denominators: you get $xy=12x+12y$. Move everything to one side.`,
      String.raw`Add $144$ to both sides so the left side factors as $(x-12)(y-12)$.`,
      String.raw`Careful: the two factors could both be negative. Rule that case out before counting divisors.`,
    ],
    answer: String.raw`$15$`,
    answerValue: "15",
    solution: [
      String.raw`Multiplying by $12xy$ gives $12y+12x=xy$, i.e. $xy-12x-12y=0$. Adding $144$: $(x-12)(y-12)=144$.`,
      String.raw`Both factors are integers with product $144>0$, so they are both positive or both negative.`,
      String.raw`If both are negative, then $x-12\ge-11$ and $y-12\ge-11$ (because $x,y\ge1$), so the product is at most $121<144$. Impossible.`,
      String.raw`So $x-12$ and $y-12$ are positive, and every positive divisor $d$ of $144$ gives exactly one pair $(12+d,\,12+144/d)$.`,
      String.raw`Since $144=2^4\cdot3^2$, it has $(4+1)(2+1)=15$ positive divisors. Hence there are $15$ ordered pairs.`,
    ],
    source: "Original",
  },
];
