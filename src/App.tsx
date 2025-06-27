import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { ParsingTable } from "@/components/parsing-table";
import { SentenceInput } from "@/components/sentence-input";
import { SentenceGenerator } from "@/components/sentence-generator";
import { ParsingResult } from "@/components/parsing-result";
import { ExecutionTrace } from "@/components/execution-trace";
import { ThemeToggle } from "@/components/theme-toggle";
import { LL1Parser, getSentenceDescription } from "@/lib/grammar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import "./App.css";
import {
  GrammarDisplay,
  FirstFollowDisplay,
} from "@/components/grammar-display";

function App() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<{
    accepted: boolean;
    iterations: number;
  } | null>(null);
  const [trace, setTrace] = useState<Array<any>>([]);
  const [activeTab, setActiveTab] = useState("input");
  const [sentenceMeaning, setSentenceMeaning] = useState("");
  const parser = new LL1Parser();

  const handleParse = (parseResult: any, parsedInput: string) => {
    setResult({
      accepted: parseResult.accepted,
      iterations: parseResult.iterations,
    });
    setTrace(parseResult.trace);
    setSentenceMeaning(getSentenceDescription(parsedInput));
  };

  const handleReset = () => {
    setInput("");
    setResult(null);
    setTrace([]);
    setSentenceMeaning("");
  };

  const handleUseGenerated = (sentence: string) => {
    setInput(sentence);
    setActiveTab("input");

    // Automatically parse the generated sentence
    const parseResult = parser.parse(sentence);
    handleParse(parseResult, sentence);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">LL(1) Parser</h1>
          <p className="text-muted-foreground">
            A top-down predictive parser for context-free languages
          </p>
        </div>
        <ThemeToggle />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <GrammarDisplay />
        <FirstFollowDisplay />
      </div>

      <ParsingTable />

      <div className="my-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="input">Manual Input</TabsTrigger>
            <TabsTrigger value="generate">Generate Sentence</TabsTrigger>
          </TabsList>

          <TabsContent value="input">
            <SentenceInput
              onParse={(result, parsedInput) => {
                setInput(parsedInput);
                handleParse(result, parsedInput);
              }}
              onReset={handleReset}
            />
          </TabsContent>

          <TabsContent value="generate">
            <SentenceGenerator onUse={handleUseGenerated} />
          </TabsContent>
        </Tabs>
      </div>

      {sentenceMeaning && result && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Sentence Context</CardTitle>
            <CardDescription>
              The meaning of this sentence in our language
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-lg">{sentenceMeaning}</p>
          </CardContent>
        </Card>
      )}

      <ParsingResult result={result} onReset={handleReset} />

      {trace.length > 0 && <ExecutionTrace trace={trace} />}
    </div>
  );
}
export default App;
