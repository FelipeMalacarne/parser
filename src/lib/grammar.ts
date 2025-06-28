/**
 * Definição da Gramática Livre de Contexto (LL1).
 *
 * REGRAS DE PRODUÇÃO:
 * 1. S -> a A | b B
 * 2. A -> c C | d D | ε
 * 3. B -> c C | d D
 * 4. C -> a S
 * 5. D -> b B
 */
export const grammar: Record<string, string[]> = {
  S: ["a A", "b B"],
  A: ["c C", "d D", "ε"],
  B: ["c C", "d D"],
  C: ["a S"],
  D: ["b B"],
};

/**
 * Conjuntos FIRST para cada não-terminal da gramática.
 */
export const firstSets: Record<string, string[]> = {
  S: ["a", "b"],
  A: ["c", "d", "ε"],
  B: ["c", "d"],
  C: ["a"],
  D: ["b"],
};

/**
 * Conjuntos FOLLOW para cada não-terminal da gramática.
 * Nota: Devido à estrutura recursiva, todos os não-terminais
 * acabam tendo apenas '$' em seus conjuntos FOLLOW.
 */
export const followSets: Record<string, string[]> = {
  S: ["$"],
  A: ["$"],
  B: ["$"],
  C: ["$"],
  D: ["$"],
};

/**
 * Tabela de Parsing LL(1) gerada a partir dos conjuntos FIRST e FOLLOW.
 * As células vazias (não definidas) representam erros sintáticos.
 */
export const parsingTable: Record<string, Record<string, string>> = {
  S: {
    a: "a A",
    b: "b B",
  },
  A: {
    c: "c C",
    d: "d D",
    $: "ε", // A -> ε é escolhido quando o lookahead está no FOLLOW(A)
  },
  B: {
    c: "c C",
    d: "d D",
  },
  C: {
    a: "a S",
  },
  D: {
    b: "b B",
  },
};

/**
 * Lista de todos os símbolos terminais da gramática.
 */
export const terminals: string[] = ["a", "b", "c", "d", "$"];

/**
 * Lista de todos os símbolos não-terminais da gramática.
 */
export const nonTerminals: string[] = ["S", "A", "B", "C", "D"];

/**
 * Exemplos de sentenças para validar o parser.
 */
export const exampleSentences = [
  {
    sentence: "a",
    meaning: "Sentença válida (S -> aA -> aε)",
    valid: true,
  },
  {
    sentence: "bcaa",
    meaning: "Sentença válida (S -> bB -> bcC -> bcaS -> bcaaA -> bcaaε)",
    valid: true,
  },
  {
    sentence: "acaa",
    meaning: "Sentença válida (S -> aA -> acC -> acaS -> acaaA -> acaaε)",
    valid: true,
  },
  {
    sentence: "bdbcaa",
    meaning: "Sentença válida com mais recursão.",
    valid: true,
  },
  {
    sentence: "c",
    meaning: "Sentença inválida (deve começar com 'a' ou 'b').",
    valid: false,
  },
  {
    sentence: "ab",
    meaning:
      "Sentença inválida (após 'a', espera-se 'c', 'd' ou fim da sentença).",
    valid: false,
  },
  {
    sentence: "bda",
    meaning: "Sentença inválida (após 'd', a regra D->bB exige um 'b').",
    valid: false,
  },
];

interface TraceStep {
  stack: string[];
  input: string;
  action: string;
  currentSymbol: string;
  matched: boolean;
}

export class LL1Parser {
  private trace: TraceStep[] = [];
  private iterations = 0;
  private stackContent: string[] = [];
  private inputTokens: string[] = [];
  private position = 0;

  private reset() {
    this.trace = [];
    this.iterations = 0;
    this.stackContent = [];
    this.inputTokens = [];
    this.position = 0;
  }

  public parse(inputStr: string): {
    accepted: boolean;
    iterations: number;
    trace: TraceStep[];
  } {
    this.reset();
    this.inputTokens = inputStr.split("").concat("$");
    this.stackContent = ["$", "S"];
    this.position = 0;

    this.trace.push({
      stack: [...this.stackContent],
      input: this.inputTokens.slice(this.position).join(""),
      action: "Initial configuration",
      currentSymbol: "",
      matched: false,
    });

    while (this.stackContent.length > 0) {
      this.iterations++;
      const top = this.stackContent[this.stackContent.length - 1];
      const currentInput = this.inputTokens[this.position];

      if (top === "$" && currentInput === "$") {
        return this.accept();
      }

      if (terminals.includes(top)) {
        if (top === currentInput) {
          this.match(top);
        } else {
          return this.error(
            `Error: Mismatch. Expected ${top}, but found ${currentInput}`,
            currentInput,
          );
        }
      } else if (nonTerminals.includes(top)) {
        if (parsingTable[top] && parsingTable[top][currentInput]) {
          this.expand(top, currentInput);
        } else {
          return this.error(
            `Error: No parsing table entry for Non-Terminal ${top} and Input ${currentInput}`,
            currentInput,
          );
        }
      } else {
        return this.error(`Error: Invalid symbol in stack: ${top}`, top);
      }
    }
    // Fallback in case of unexpected loop exit
    return { accepted: false, iterations: this.iterations, trace: this.trace };
  }

  private accept() {
    this.trace.push({
      stack: [...this.stackContent],
      input: this.inputTokens.slice(this.position).join(""),
      action: "Accept",
      currentSymbol: "$",
      matched: true,
    });
    return { accepted: true, iterations: this.iterations, trace: this.trace };
  }

  private match(top: string) {
    this.stackContent.pop();
    this.position++;
    this.trace.push({
      stack: [...this.stackContent],
      input: this.inputTokens.slice(this.position).join(""),
      action: `Match ${top}`,
      currentSymbol: top,
      matched: true,
    });
  }

  private expand(top: string, currentInput: string) {
    const production = parsingTable[top][currentInput];
    this.stackContent.pop();

    if (production !== "ε") {
      const symbols = production.split(" ").reverse();
      this.stackContent.push(...symbols);
    }

    this.trace.push({
      stack: [...this.stackContent],
      input: this.inputTokens.slice(this.position).join(""),
      action: `Expand ${top} → ${production}`,
      currentSymbol: top,
      matched: true,
    });
  }

  private error(action: string, currentSymbol: string) {
    this.trace.push({
      stack: [...this.stackContent],
      input: this.inputTokens.slice(this.position).join(""),
      action,
      currentSymbol,
      matched: false,
    });
    return { accepted: false, iterations: this.iterations, trace: this.trace };
  }
}

export function generateSentence() {
  const sentence: string[] = [];
  const stack: string[] = ["$", "S"];

  while (stack.length > 0) {
    const top = stack.pop()!;

    if (terminals.includes(top)) {
      sentence.push(top);
    } else if (nonTerminals.includes(top)) {
      const productions = grammar[top];
      const production =
        productions[Math.floor(Math.random() * productions.length)];
      const symbols = production.split(" ").reverse();
      stack.push(...symbols);
    }
  }

  return sentence.join("").replace(/\$/g, "");
}
export function getSentenceDescription(sentence: string) {
  const example = exampleSentences.find(
    (ex) => ex.sentence === sentence && ex.valid,
  );
  return example ? example.meaning : "No valid description found.";
}
