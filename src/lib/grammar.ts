export const grammar: Record<string, string[]> = {
  S: ["A B"],
  A: ["a A c", "B d"],
  B: ["b B", "C"],
  C: ["c C", "ε"],
  D: ["d D", "d b D", "a d"],
}

// First sets
export const firstSets = {
  S: ["a", "b", "c", "d"],
  A: ["a", "b", "c", "d"],
  B: ["b", "c", "ε"],
  C: ["c", "ε"],
  D: ["d", "a"],
}

// Follow sets
export const followSets = {
  S: ["$"],
  A: ["b", "c", "$"],
  B: ["$", "d"],
  C: ["$", "d"],
  D: ["$", "d"],
}

// Parsing table
export const parsingTable: Record<string, Record<string, string>> = {
  S: {
    a: "A B",
    b: "A B",
    c: "A B",
    d: "A B",
  },
  A: {
    a: "a A c",
    b: "B d",
    c: "B d",
    d: "B d",
  },
  B: {
    b: "b B",
    c: "C",
    $: "C",
  },
  C: {
    c: "c C",
    $: "ε",
    d: "ε",
  },
  D: {
    d: "d D",
    a: "a d",
  },
}

// Terminal symbols
export const terminals = ["a", "b", "c", "d", "$"]

// Non-terminal symbols
export const nonTerminals = ["S", "A", "B", "C", "D"]

// Example sentences with context
export const exampleSentences = [
  {
    sentence: "abccd",
    meaning: "A simple greeting in our language",
    valid: true,
  },
  {
    sentence: "abcd",
    meaning: "A question about the weather",
    valid: true,
  },
  {
    sentence: "acbcd",
    meaning: "Asking for directions",
    valid: true,
  },
  {
    sentence: "abd",
    meaning: "A farewell expression",
    valid: true,
  },
  {
    sentence: "aaccd",
    meaning: "Expressing gratitude",
    valid: true,
  },
  {
    sentence: "abc",
    meaning: "Incomplete expression (invalid)",
    valid: false,
  },
  {
    sentence: "aad",
    meaning: "Incorrect grammar structure (invalid)",
    valid: false,
  },
]

// Parse the input string
export class LL1Parser {
  private trace: Array<{
    stack: string[]
    input: string
    action: string
    currentSymbol: string
    matched: boolean
  }> = []
  private iterations = 0
  private stackContent: string[] = []
  private inputTokens: string[] = []
  private position = 0

  private reset() {
    this.trace = []
    this.iterations = 0
    this.stackContent = []
    this.inputTokens = []
    this.position = 0
  }

  public parse(
    inputStr: string,
  ): { accepted: boolean; iterations: number; trace: typeof this.trace } {
    this.reset()
    this.inputTokens = inputStr.split("").concat("$")
    this.stackContent = ["$", "S"]
    this.position = 0

    this.trace.push({
      stack: [...this.stackContent],
      input: this.inputTokens.slice(this.position).join(""),
      action: "Initial configuration",
      currentSymbol: "",
      matched: false,
    })

    while (this.stackContent.length > 0) {
      this.iterations++
      const top = this.stackContent[this.stackContent.length - 1]
      const currentInput = this.inputTokens[this.position]

      if (top === "$" && currentInput === "$") {
        return this.accept()
      }

      if (terminals.includes(top)) {
        if (top === currentInput) {
          this.match(top)
        } else {
          return this.error(
            `Error: Mismatch. Expected ${top}, but found ${currentInput}`,
            currentInput,
          )
        }
      } else if (nonTerminals.includes(top)) {
        if (parsingTable[top] && parsingTable[top][currentInput]) {
          this.expand(top, currentInput)
        } else {
          return this.error(
            `Error: No parsing table entry for Non-Terminal ${top} and Input ${currentInput}`,
            currentInput,
          )
        }
      } else {
        return this.error(`Error: Invalid symbol in stack: ${top}`, top)
      }
    }
    // Fallback in case of unexpected loop exit
    return { accepted: false, iterations: this.iterations, trace: this.trace }
  }

  private accept() {
    this.trace.push({
      stack: [...this.stackContent],
      input: this.inputTokens.slice(this.position).join(""),
      action: "Accept",
      currentSymbol: "$",
      matched: true,
    })
    return { accepted: true, iterations: this.iterations, trace: this.trace }
  }

  private match(top: string) {
    this.stackContent.pop()
    this.position++
    this.trace.push({
      stack: [...this.stackContent],
      input: this.inputTokens.slice(this.position).join(""),
      action: `Match ${top}`,
      currentSymbol: top,
      matched: true,
    })
  }

  private expand(top: string, currentInput: string) {
    const production = parsingTable[top][currentInput]
    this.stackContent.pop()

    if (production !== "ε") {
      const symbols = production.split(" ").reverse()
      this.stackContent.push(...symbols)
    }

    this.trace.push({
      stack: [...this.stackContent],
      input: this.inputTokens.slice(this.position).join(""),
      action: `Expand ${top} → ${production}`,
      currentSymbol: top,
      matched: true,
    })
  }

  private error(action: string, currentSymbol: string) {
    this.trace.push({
      stack: [...this.stackContent],
      input: this.inputTokens.slice(this.position).join(""),
      action,
      currentSymbol,
      matched: false,
    })
    return { accepted: false, iterations: this.iterations, trace: this.trace }
  }
}

export function generateSentence(maxLength: number) {
  const sentence: string[] = []
  const stack: string[] = ["$", "S"]

  while (stack.length > 0) {
    const top = stack.pop()!

    if (terminals.includes(top)) {
      sentence.push(top)
    } else if (nonTerminals.includes(top)) {
      const productions = grammar[top]
      const production = productions[Math.floor(Math.random() * productions.length)]
      const symbols = production.split(" ").reverse()
      stack.push(...symbols)
    }
  }

  return sentence.join("").replace(/\$/g, "")
}
export function getSentenceDescription(sentence: string) {
  const example = exampleSentences.find(
    (ex) => ex.sentence === sentence && ex.valid,
  )
  return example ? example.meaning : "No valid description found."
}

