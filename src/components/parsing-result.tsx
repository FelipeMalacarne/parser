import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, RefreshCw } from "lucide-react"

interface ParsingResultProps {
  result: {
    accepted: boolean
    iterations: number
  } | null
  onReset: () => void
}

export function ParsingResult({ result, onReset }: ParsingResultProps) {
  if (!result) return null

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Result</CardTitle>
        <CardDescription>Parsing completed with {result.iterations} iterations</CardDescription>
      </CardHeader>
      <CardContent>
        <Alert
          variant={result.accepted ? "default" : "destructive"}
          className={result.accepted ? "bg-green-50 dark:bg-green-950/20" : "bg-red-50 dark:bg-red-950/20"}
        >
          {result.accepted ? (
            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
          ) : (
            <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
          )}
          <AlertTitle>{result.accepted ? "Sentence Accepted" : "Sentence Rejected"}</AlertTitle>
          <AlertDescription>
            {result.accepted
              ? "The input sentence is valid according to the grammar."
              : "The input sentence is not valid according to the grammar."}
          </AlertDescription>
        </Alert>
        <div className="flex justify-end mt-4">
          <Button variant="outline" onClick={onReset}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Start Over
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
