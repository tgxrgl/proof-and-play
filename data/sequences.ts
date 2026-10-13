import type { PuzzleInput } from "@/lib/types";

export const sequences: PuzzleInput[] = [
  {
    slug: "gauss-sum",
    title: "Gauss and the Hundred Numbers",
    category: "sequences",
    difficulty: "Easy",
    minutes: 4,
    teaser: "Add 1 through 100 in under a minute, using pairs.",
    statement: String.raw`Find the value of $1+2+3+\cdots+100$.`,
    hints: [
      String.raw`Write the sum forwards, then backwards underneath. What is each column's total?`,
    ],
    answer: String.raw`$5050$`,
    answerValue: "5050",
    solution: [
      String.raw`Let $S=1+2+\cdots+100$. Writing it in reverse, $S=100+99+\cdots+1$.`,
      String.raw`Adding the two lines column by column, every column sums to $101$, and there are $100$ columns: $2S=100\cdot101$.`,
      String.raw`So $S=\dfrac{100\cdot101}{2}=5050$. In general $1+\cdots+n=\dfrac{n(n+1)}2$.`,
    ],
    source: "Classical (the famous story of young Gauss)",
  },
  {
    slug: "next-pronic",
    title: "What Comes Next?",
    category: "sequences",
    difficulty: "Easy",
    minutes: 5,
    teaser: "2, 6, 12, 20, 30, … find the rule, then the next term.",
    statement: String.raw`Find the next term of the sequence
$$2,\ 6,\ 12,\ 20,\ 30,\ \dots$$`,
    hints: [
      String.raw`Look at the differences between consecutive terms.`,
      String.raw`Can you write each term as a product of two consecutive integers?`,
    ],
    answer: String.raw`$42$`,
    answerValue: "42",
    solution: [
      String.raw`The differences are $4,6,8,10$, increasing by $2$ each time, so the next difference is $12$.`,
      String.raw`Equivalently, the terms are $1\cdot2,\,2\cdot3,\,3\cdot4,\,4\cdot5,\,5\cdot6$, so the $n$th term is $n(n+1)$.`,
      String.raw`The next term is $6\cdot7=42$ (and $30+12=42$ agrees).`,
    ],
    source: "Original",
  },
  {
    slug: "fibonacci-partial-sum",
    title: "Adding Up Fibonacci",
    category: "sequences",
    difficulty: "Medium",
    minutes: 10,
    teaser: "The sum of the first ten Fibonacci numbers is secretly another Fibonacci number.",
    statement: String.raw`The Fibonacci numbers are $F_1=F_2=1$ and $F_{n+2}=F_{n+1}+F_n$. Find $F_1+F_2+\cdots+F_{10}$ and explain a shortcut.`,
    hints: [
      String.raw`Compute the first twelve Fibonacci numbers and compare the running sums with the next terms.`,
      String.raw`Write $F_n=F_{n+2}-F_{n+1}$ and sum.`,
    ],
    answer: String.raw`$143=F_{12}-1$`,
    answerValue: "143",
    solution: [
      String.raw`From the recurrence, $F_n=F_{n+2}-F_{n+1}$.`,
      String.raw`Summing from $n=1$ to $10$ telescopes: $\sum_{n=1}^{10}F_n=F_{12}-F_2=F_{12}-1$.`,
      String.raw`The sequence runs $1,1,2,3,5,8,13,21,34,55,89,144$, so $F_{12}=144$ and the sum is $143$.`,
    ],
    source: "Original",
  },
  {
    slug: "look-and-say",
    title: "Look and Say",
    category: "sequences",
    difficulty: "Medium",
    minutes: 10,
    teaser: "1, 11, 21, 1211, 111221 … read each term aloud to get the next.",
    statement: String.raw`Each term of this sequence describes the previous one:
$$1,\ 11,\ 21,\ 1211,\ 111221,\ 312211,\ 13112221,\ ?$$
What is the next term?`,
    hints: [
      String.raw`Read "1" aloud: "one 1". That gives "11". Read "11": "two 1s". That gives "21".`,
      String.raw`Read $13112221$ aloud by groups of identical digits.`,
    ],
    answer: String.raw`$1113213211$`,
    answerValue: "1113213211",
    solution: [
      String.raw`Each term is obtained by reading the previous term aloud, grouping equal adjacent digits as "count, digit".`,
      String.raw`$13112221$ splits into the groups $1\mid3\mid11\mid222\mid1$.`,
      String.raw`Reading them: one 1, one 3, two 1s, three 2s, one 1 → $11\;13\;21\;32\;11$.`,
      String.raw`So the next term is $1113213211$.`,
    ],
    source: "Conway's look-and-say sequence",
  },
  {
    slug: "josephus-circle",
    title: "The Last One Standing",
    category: "sequences",
    difficulty: "Hard",
    minutes: 25,
    teaser: "Forty-one people in a circle, every second one eliminated. Where do you stand to survive?",
    statement: String.raw`Forty-one people stand in a circle, numbered $1$ to $41$ clockwise. Starting with person $1$, you go around the circle eliminating every second person who is still standing: first person $2$, then person $4$, and so on, continuing around the circle until one person remains.

Which numbered person survives?`,
    hints: [
      String.raw`Solve small cases: with $n$ people, who survives for $n=1,2,3,4,5,6,7,8$? Look for a pattern.`,
      String.raw`When $n$ is a power of $2$, the survivor is person $1$. After one trip around a circle of $2m$ people, you're left with $m$ people and the same problem.`,
    ],
    answer: String.raw`Person $19$`,
    answerValue: "19",
    solution: [
      String.raw`Let $J(n)$ be the survivor with $n$ people. Clearly $J(1)=1$.`,
      String.raw`With $2m$ people, one pass eliminates all even numbers and returns to person $1$ with $m$ people left, numbered $1,3,5,\dots$. The survivor of that smaller circle, in its own numbering $J(m)$, is person $2J(m)-1$ in the original: $J(2m)=2J(m)-1$.`,
      String.raw`With $2m+1$ people, after eliminating $2,4,\dots,2m$ the next person to be eliminated is $1$ (the second one counted after $2m$ is $1$), and the circle restarts at person $3$ with $m$ people $3,5,\dots,2m+1$. The survivor is $2J(m)+1$: $J(2m+1)=2J(m)+1$.`,
      String.raw`Compute: $J(2)=1$, $J(5)=2J(2)+1=3$, $J(10)=2J(5)-1=5$, $J(20)=2J(10)-1=9$, $J(41)=2J(20)+1=19$.`,
      String.raw`Closed form: writing $n=2^a+\ell$ with $0\le\ell<2^a$, the survivor is $2\ell+1$. For $41=32+9$ this gives $2\cdot9+1=19$.`,
    ],
    source: "Classical (the Josephus problem)",
  },
];
