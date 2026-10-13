import type { PuzzleInput } from "@/lib/types";

export const logic: PuzzleInput[] = [
  {
    slug: "knight-or-knave",
    title: "A Knight, a Knave, and One Sentence",
    category: "logic",
    difficulty: "Easy",
    minutes: 5,
    teaser: "One sentence is enough to settle who is lying.",
    statement: String.raw`On an island, every inhabitant is either a *knight* (always tells the truth) or a *knave* (always lies). You meet two inhabitants, A and B. A says: "At least one of us is a knave."

What are A and B?`,
    hints: [
      String.raw`Suppose A is a knave. Would A's statement be true or false?`,
      String.raw`Once you know A's type, use the truth of A's statement to learn about B.`,
    ],
    answer: String.raw`A is a knight and B is a knave.`,
    answerValue: "A knight, B knave",
    solution: [
      String.raw`Suppose A were a knave. Then A's statement "at least one of us is a knave" would be true, since A is one. But knaves cannot make true statements. Contradiction.`,
      String.raw`So A is a knight and the statement is true: at least one of A and B is a knave.`,
      String.raw`A is a knight, so B must be the knave.`,
    ],
    source: "Classical knights-and-knaves puzzle (popularized by Raymond Smullyan)",
  },
  {
    slug: "nine-coins",
    title: "The Heavy Coin",
    category: "logic",
    difficulty: "Easy",
    minutes: 8,
    teaser: "Nine coins, one heavier, a balance scale. Two weighings suffice. Why?",
    statement: String.raw`Nine coins look identical, but one is slightly heavier than the rest. You have a balance scale (no weights). What is the **smallest number of weighings** that is guaranteed to find the heavy coin?`,
    hints: [
      String.raw`A single weighing has three outcomes: left heavier, right heavier, balanced. How could you use all three?`,
      String.raw`Split the coins into three groups. What does the first weighing tell you about the groups?`,
    ],
    answer: String.raw`$2$ weighings`,
    answerValue: "2",
    solution: [
      String.raw`Split the coins into three groups of three. Weigh group 1 against group 2. If one side is heavier, the heavy coin is in that group; if they balance, it is in group 3.`,
      String.raw`Take the three coins of the identified group and weigh two of them against each other. The heavier one is the culprit; if they balance, it is the third coin.`,
      String.raw`Lower bound: each weighing has at most $3$ outcomes, so $k$ weighings distinguish at most $3^k$ cases. We need $3^k\ge9$, so $k\ge2$. Two weighings are optimal.`,
    ],
    source: "Classical",
  },
  {
    slug: "ten-liars",
    title: "Ten People, Ten Claims",
    category: "logic",
    difficulty: "Medium",
    minutes: 10,
    teaser: "Everyone makes a claim about how many liars are in the room. Who is honest?",
    statement: String.raw`Ten people stand in a room. Person $k$ (for $k=1,2,\dots,10$) announces: "Exactly $k$ of the ten of us are liars." Each person is either always truthful or always lying.

Who is telling the truth?`,
    hints: [
      String.raw`Can two different people both be truthful? Compare their claims.`,
      String.raw`If nobody told the truth, how many liars would there be? Is anyone's statement then true?`,
    ],
    answer: String.raw`Only person $9$ is truthful.`,
    answerValue: "9",
    solution: [
      String.raw`Two different claims "exactly $j$ liars" and "exactly $k$ liars" with $j\ne k$ cannot both be true. So at most one person is truthful.`,
      String.raw`Suppose nobody is truthful. Then all $10$ are liars, which makes person $10$'s claim ("exactly $10$ liars") true. Contradiction.`,
      String.raw`So exactly one person is truthful, hence exactly $9$ are liars. The only claim that is then true is "exactly $9$ liars", made by person $9$.`,
    ],
    source: "Original",
  },
  {
    slug: "birthday-of-the-two-friends",
    title: "When Is the Birthday?",
    category: "logic",
    difficulty: "Hard",
    minutes: 25,
    teaser: "Two friends each hold half the information. Their conversation reveals the rest.",
    statement: String.raw`Ana and Ben want to find their friend Cleo's birthday. Cleo gives them ten possible dates:

May 15, May 16, May 19, June 17, June 18, July 14, July 16, August 14, August 15, August 17.

Cleo privately tells Ana only the **month** and Ben only the **day**. Then:

**Ana:** "I don't know when Cleo's birthday is, but I know that Ben doesn't know either."

**Ben:** "At first I didn't know, but now I do."

**Ana:** "Then I know too."

When is Cleo's birthday?`,
    hints: [
      String.raw`Which days appear in only one date? If Ben were told one of those days, he would know immediately.`,
      String.raw`Ana is *sure* Ben doesn't know. What does that say about her month?`,
      String.raw`After eliminating months, Ben says he now knows. Which days would still leave him with two options?`,
    ],
    answer: String.raw`July 16`,
    answerValue: "July 16",
    solution: [
      String.raw`The days $18$ and $19$ each appear once (June 18, May 19). If Ben had been told $18$ or $19$ he would know the date.`,
      String.raw`Ana says she is certain Ben doesn't know. That means her month contains neither $18$ nor $19$, so the month is not May or June. Remaining: July 14, July 16, August 14, August 15, August 17.`,
      String.raw`Ben now knows, so his day must be unique among these five. The day $14$ appears twice (July and August), so it is out. Remaining: July 16, August 15, August 17.`,
      String.raw`Ana now knows. If her month were August she would still have two options, so her month is July, and the date is July 16.`,
    ],
    source: "Classic logic puzzle (widely circulated); dates and wording adapted",
  },
];
