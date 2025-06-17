import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { generateSentence, getSentenceDescription } from "@/lib/grammar"

interface SentenceGeneratorProps {
  onUse: (sentence: string) => void
}

export function SentenceGenerator({ onUse }: SentenceGeneratorProps) {
  const [maxLength, setMaxLength] = useState(10)
  const [generatedSentence, setGeneratedSentence] = useState("")
  const [sentenceMeaning, setSentenceMeaning] = useState("")

  const handleGenerate = () => {
    const sentence = generateSentence(maxLength)
    setGeneratedSentence(sentence)
    setSentenceMeaning(getSentenceDescription(sentence))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generate Sentence</CardTitle>
        <CardDescription>Generate a random valid sentence</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span>Max Length: {maxLength}</span>
          </div>
          <Slider
            value={[maxLength]}
            onValueChange={(value) => setMaxLength(value[0])}
            min={5}
            max={20}
            step={1}
            className="mb-4"
          />
          <div className="flex space-x-2">
            <Button onClick={handleGenerate} className="flex-1">
              Generate
            </Button>
            <Button
              variant="outline"
              onClick={() => onUse(generatedSentence)}
              disabled={!generatedSentence}
              className="flex-1"
            >
              Use This Sentence
            </Button>
          </div>
        </div>
        {generatedSentence && (
          <div className="p-4 border rounded-md bg-muted">
            <div className="font-mono break-all mb-2">{generatedSentence}</div>
            {sentenceMeaning && <div className="text-sm text-muted-foreground italic">Meaning: {sentenceMeaning}</div>}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
