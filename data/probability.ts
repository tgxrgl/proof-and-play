import type { PuzzleInput } from "@/lib/types";

export const probability: PuzzleInput[] = [
  {
    slug: "six-in-four-rolls",
    title: "At Least One Six",
    category: "probability",
    difficulty: "Easy",
    minutes: 6,
    teaser: "Roll a die four times. Is a six more likely than not?",
    statement: String.raw`A fair six-sided die is rolled four times. What is the probability that at least one roll shows a six? Is it more or less than one half?`,
    hints: [
      String.raw`"At least one" is awkward to count directly. What is the opposite event?`,
      String.raw`The rolls are independent, so probabilities multiply.`,
    ],
    answer: String.raw`$\dfrac{671}{1296}\approx0.518$, slightly more than one half`,
    answerValue: "671/1296",
    solution: [
      String.raw`The complement is "no sixes in four rolls". Each roll avoids a six with probability $\tfrac56$, and the rolls are independent, so this has probability $\left(\tfrac56\right)^4=\tfrac{625}{1296}$.`,
      String.raw`Hence $P(\text{at least one six})=1-\tfrac{625}{1296}=\tfrac{671}{1296}\approx0.518$.`,
      String.raw`This is just over $\tfrac12$. (With only three rolls it would be $1-\tfrac{125}{216}\approx0.421$, below one half.)`,
    ],
    source: "Classical (the Chevalier de Méré's problem)",
  },
  {
    slug: "monty-hall",
    title: "Switch or Stay?",
    category: "probability",
    difficulty: "Medium",
    minutes: 10,
    teaser: "Three doors, one prize, and a host who knows more than you.",
    statement: String.raw`A prize is hidden uniformly at random behind one of three doors. You pick a door. The host, who knows where the prize is, then opens one of the *other* two doors that does not hide the prize (choosing at random if he has two options), and offers you the chance to switch to the remaining closed door.

If you always switch, what is the probability that you win the prize?`,
    hints: [
      String.raw`When does switching win? Think about what your *first* pick must have been.`,
      String.raw`If your first pick was wrong, the host's move is forced. Where does the prize have to be then?`,
    ],
    answer: String.raw`$\dfrac23$`,
    answerValue: "2/3",
    solution: [
      String.raw`Your first pick is right with probability $\tfrac13$ and wrong with probability $\tfrac23$.`,
      String.raw`If it was wrong, the prize is behind one of the other two doors. The host must open the other empty door, so the remaining closed door hides the prize. Switching wins.`,
      String.raw`If it was right, switching loses.`,
      String.raw`So switching wins exactly when the first pick was wrong: probability $\tfrac23$. Staying wins only $\tfrac13$ of the time.`,
    ],
    source: "Classical (the Monty Hall problem)",
  },
  {
    slug: "shared-birthdays",
    title: "The Birthday Threshold",
    category: "probability",
    difficulty: "Medium",
    minutes: 15,
    teaser: "How many people until two probably share a birthday? Fewer than you'd think.",
    statement: String.raw`Assume every person's birthday is equally likely to be any of $365$ days, independently of everyone else. What is the smallest number of people such that the probability that **at least two share a birthday** exceeds $\tfrac12$?`,
    hints: [
      String.raw`Compute the probability that all $n$ birthdays are *different*.`,
      String.raw`That probability is $\dfrac{365}{365}\cdot\dfrac{364}{365}\cdots\dfrac{365-n+1}{365}$. Find when it first drops below $\tfrac12$.`,
    ],
    answer: String.raw`$23$`,
    answerValue: "23",
    solution: [
      String.raw`Let $q_n=\prod_{i=0}^{n-1}\dfrac{365-i}{365}$ be the probability that $n$ people all have different birthdays.`,
      String.raw`Using $\ln(1-x)\approx-x$, $\ln q_n\approx-\dfrac{n(n-1)}{2\cdot365}$, which equals $\ln\tfrac12$ near $n(n-1)\approx506$, i.e. $n\approx23$.`,
      String.raw`Exact values: $q_{22}\approx0.524$ and $q_{23}\approx0.493$. So with $22$ people the chance of a shared birthday is about $47.6\%$, and with $23$ it is about $50.7\%$.`,
      String.raw`The smallest group is $23$. The intuition: there are $\binom{23}{2}=253$ pairs of people, each a chance for a match.`,
    ],
    source: "Classical (the birthday problem)",
  },
  {
    slug: "broken-stick-triangle",
    title: "The Broken Stick",
    category: "probability",
    difficulty: "Hard",
    minutes: 25,
    teaser: "Snap a stick in two random places. Can the pieces form a triangle?",
    statement: String.raw`A stick of length $1$ is broken at two points chosen independently and uniformly at random. What is the probability that the three resulting pieces can be assembled into a triangle?`,
    hints: [
      String.raw`Three lengths form a (non-degenerate) triangle exactly when each is less than the sum of the others. For total length $1$, what does that say about each piece?`,
      String.raw`Picture the two break points as a point $(x,y)$ in the unit square. Split into the cases $x<y$ and $x>y$ and draw the allowed region.`,
    ],
    answer: String.raw`$\dfrac14$`,
    answerValue: "1/4",
    solution: [
      String.raw`The triangle inequality, with total length $1$, says every piece is shorter than $\tfrac12$.`,
      String.raw`Take the break points as $(x,y)$ in the unit square, and consider the half where $x<y$. The pieces have lengths $x$, $y-x$ and $1-y$. The conditions are $x<\tfrac12$, $y-x<\tfrac12$, $y>\tfrac12$.`,
      String.raw`This region is the triangle with vertices $\left(0,\tfrac12\right)$, $\left(\tfrac12,\tfrac12\right)$, $\left(\tfrac12,1\right)$, of area $\tfrac12\cdot\tfrac12\cdot\tfrac12=\tfrac18$.`,
      String.raw`The half $x>y$ is symmetric and contributes another $\tfrac18$. Total area (= probability): $\tfrac14$.`,
    ],
    source: "Classical",
  },
];
