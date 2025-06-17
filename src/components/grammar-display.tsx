import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { grammar, firstSets, followSets } from "@/lib/grammar";

export function GrammarDisplay() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Grammar</CardTitle>
        <CardDescription>The LL(1) grammar used by the parser</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="font-mono text-sm">
          {Object.entries(grammar).map(([nonTerminal, productions]) => (
            <div key={nonTerminal} className="mb-2">
              {nonTerminal} → {productions.join(" | ")}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function FirstFollowDisplay() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>First & Follow Sets</CardTitle>
        <CardDescription>
          First and Follow sets for each non-terminal
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold mb-2">First Sets</h3>
            {Object.entries(firstSets).map(([nonTerminal, symbols]) => (
              <div key={nonTerminal} className="mb-1 font-mono text-sm">
                First({nonTerminal}) = {`{${symbols.join(", ")}}`}
              </div>
            ))}
          </div>
          <div>
            <h3 className="font-semibold mb-2">Follow Sets</h3>
            {Object.entries(followSets).map(([nonTerminal, symbols]) => (
              <div key={nonTerminal} className="mb-1 font-mono text-sm">
                Follow({nonTerminal}) = {`{${symbols.join(", ")}}`}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
