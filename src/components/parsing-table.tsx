import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { parsingTable, terminals, nonTerminals } from "@/lib/grammar";

export function ParsingTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Parsing Table</CardTitle>
        <CardDescription>
          The LL(1) parsing table used for prediction
        </CardDescription>
      </CardHeader>
      <CardContent className="overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Non-Terminal</TableHead>
              {terminals.concat("$").map((terminal) => (
                <TableHead key={terminal}>{terminal}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {nonTerminals.map((nonTerminal) => (
              <TableRow key={nonTerminal}>
                <TableCell className="font-medium">{nonTerminal}</TableCell>
                {terminals.concat("$").map((terminal) => (
                  <TableCell key={terminal}>
                    {parsingTable[nonTerminal] &&
                    parsingTable[nonTerminal][terminal]
                      ? `${nonTerminal} → ${parsingTable[nonTerminal][terminal]}`
                      : ""}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
