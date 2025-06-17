import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RefreshCw } from "lucide-react"
import { parseInput } from "@/lib/grammar"
import { exampleSentences } from "@/lib/grammar"

interface SentenceInputProps {
  onParse: (result: any) => void
  onReset: () => void
}

export function SentenceInput({ onParse, onReset }: SentenceInputProps) {
  const [input, setInput] = useState("")

  const handleParse = () => {
    const result = parseInput(input)
    onParse(result)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Input Sentence</CardTitle>
        <CardDescription>Enter a sentence to parse or select an example</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2 mb-4">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter a sentence (e.g., abcd)"
            className="flex-1"
          />
          <Button onClick={handleParse}>Parse</Button>
          <Button variant="outline" onClick={onReset}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-4">
          {exampleSentences.map((example, index) => (
            <Button
              key={index}
              variant="outline"
              onClick={() => setInput(example.sentence)}
              className="justify-start overflow-hidden"
            >
              <span className="truncate">{example.sentence}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
