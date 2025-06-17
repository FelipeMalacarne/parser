export const grammar = {
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
export const parsingTable = {
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
export const terminals = ["a", "b", "c", "d"]

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
export function parseInput(inputStr: string) {
  const inputTokens = inputStr.split("").concat("$")
  let stackContent = ["$", "S"]
  let position = 0
  let iterations = 0
  const trace: Array<{
    stack: string[]
    input: string
    action: string
    currentSymbol: string
    matched: boolean
  }> = []

  trace.push({
    stack: [...stackContent],
    input: inputTokens.slice(position).join(""),
    action: "Initial configuration",
    currentSymbol: "",
    matched: false,
  })

  while (stackContent.length > 0) {
    iterations++
    const top = stackContent[stackContent.length - 1]
    const currentInput = inputTokens[position]

    if (top === "$" && currentInput === "$") {
      // Successful parse
      trace.push({
        stack: [...stackContent],
        input: inputTokens.slice(position).join(""),
        action: "Accept",
        currentSymbol: "$",
        matched: true,
      })
      return { accepted: true, iterations, trace }
    }

    if (terminals.includes(top) || top === "$") {
      if (top === currentInput) {
        stackContent.pop()
        position++
        trace.push({
          stack: [...stackContent],
          input: inputTokens.slice(position).join(""),
          action: `Match ${top}`,
          currentSymbol: top,
          matched: true,
        })
      } else {
        // Error: terminal mismatch
        trace.push({
          stack: [...stackContent],
          input: inputTokens.slice(position).join(""),
          action: `Error: expected ${top}, found ${currentInput}`,
          currentSymbol: currentInput,
          matched: false,
        })
        return { accepted: false, iterations, trace }
      }
    } else if (nonTerminals.includes(top)) {
      if (parsingTable[top] && parsingTable[top][currentInput]) {
        const production = parsingTable[top][currentInput]
        stackContent.pop()

        if (production !== "ε") {
          // Push production in reverse order
          const productionSymbols = production.split(" ").reverse()
          stackContent = stackContent.concat(productionSymbols)
        }

        trace.push({
          stack: [...stackContent],
          input: inputTokens.slice(position).join(""),
          action: `Expand ${top} → ${production}`,
          currentSymbol: top,
          matched: true,
        })
      } else {
        // Error: no production rule
        trace.push({
          stack: [...stackContent],
          input: inputTokens.slice(position).join(""),
          action: `Error: no production for ${top} with input ${currentInput}`,
          currentSymbol: currentInput,
          matched: false,
        })
        return { accepted: false, iterations, trace }
      }
    } else {
      // Error: unknown symbol
      trace.push({
        stack: [...stackContent],
        input: inputTokens.slice(position).join(""),
        action: `Error: unknown symbol ${top}`,
        currentSymbol: top,
        matched: false,
      })
      return { accepted: false, iterations, trace }
    }

    // Safety check to prevent infinite loops
    if (iterations > 100) {
      trace.push({
        stack: [...stackContent],
        input: inputTokens.slice(position).join(""),
        action: "Error: too many iterations",
        currentSymbol: "",
        matched: false,
      })
      return { accepted: false, iterations, trace }
    }
  }

  // If we get here, there's an error
  trace.push({
    stack: [...stackContent],
    input: inputTokens.slice(position).join(""),
    action: "Error: unexpected end of input",
    currentSymbol: "",
    matched: false,
  })
  return { accepted: false, iterations, trace }
}

// Generate a random sentence
export function generateSentence(maxLength: number) {
  let sentence = ""
  const currentSymbol = "S"
  let depth = 0

  const expand = (symbol: string): string => {
    if (depth > maxLength) {
      // Choose the shortest path to termination
      if (symbol === "C") return ""
      if (symbol === "B") return "c"
      if (symbol === "A") return "bd"
      if (symbol === "D") return "ad"
    }

    depth++

    if (terminals.includes(symbol)) {
      return symbol
    }

    if (symbol === "ε") {
      return ""
    }

    const productions = grammar[symbol]
    // Choose a random production
    const production = productions[Math.floor(Math.random() * productions.length)]

    return production
      .split(" ")
      .map((s) => expand(s))
      .join("")
  }

  sentence = expand(currentSymbol)
  return sentence
}

// Get a description for a sentence
export function getSentenceDescription(sentence: string) {
  const example = exampleSentences.find((ex) => ex.sentence === sentence)
  if (example) {
    return example.meaning
  }

  // Generate a contextual meaning based on patterns
  if (sentence.startsWith("a") && sentence.includes("c")) {
    return "A formal statement or declaration"
  } else if (sentence.startsWith("ab")) {
    return "A question or inquiry"
  } else if (sentence.includes("bd")) {
    return "A request or command"
  } else if (sentence.length > 6) {
    return "A complex expression or detailed statement"
  } else {
    return "A simple expression in our language"
  }
}

