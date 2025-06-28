import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Play, Pause, SkipForward, RefreshCw, ChevronRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface ExecutionTraceProps {
  trace: Array<{
    stack: string[]
    input: string
    action: string
    currentSymbol: string
    matched: boolean
  }>
}

export function ExecutionTrace({ trace }: ExecutionTraceProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState(1000) // ms between steps

  useEffect(() => {
    let timer: NodeJS.Timeout

    if (isPlaying && currentStep < trace.length - 1) {
      timer = setTimeout(() => {
        setCurrentStep((prev) => prev + 1)
      }, playbackSpeed)
    } else if (currentStep >= trace.length - 1) {
      setIsPlaying(false)
    }

    return () => clearTimeout(timer)
  }, [isPlaying, currentStep, trace.length, playbackSpeed])

  const handlePlay = () => {
    if (currentStep >= trace.length - 1) {
      setCurrentStep(0)
    }
    setIsPlaying(true)
  }

  const handlePause = () => {
    setIsPlaying(false)
  }

  const handleNext = () => {
    if (currentStep < trace.length - 1) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handleReset = () => {
    setIsPlaying(false)
    setCurrentStep(0)
  }

  const handleSkipToEnd = () => {
    setIsPlaying(false)
    setCurrentStep(trace.length - 1)
  }

  if (trace.length === 0) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle>Execution Trace</CardTitle>
        <CardDescription>Step-by-step execution of the parsing process</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex flex-wrap gap-2">
          {isPlaying ? (
            <Button size="sm" onClick={handlePause}>
              <Pause className="h-4 w-4 mr-2" />
              Pause
            </Button>
          ) : (
            <Button size="sm" onClick={handlePlay} disabled={currentStep >= trace.length - 1 && trace.length > 0}>
              <Play className="h-4 w-4 mr-2" />
              {currentStep >= trace.length - 1 ? "Restart" : "Play"}
            </Button>
          )}

          <Button size="sm" onClick={handleNext} disabled={currentStep >= trace.length - 1}>
            <ChevronRight className="h-4 w-4 mr-2" />
            Next Step
          </Button>

          <Button size="sm" variant="outline" onClick={handleSkipToEnd} disabled={currentStep >= trace.length - 1}>
            <SkipForward className="h-4 w-4 mr-2" />
            Skip to End
          </Button>

          <Button size="sm" variant="outline" onClick={handleReset}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset
          </Button>

          <div className="flex items-center ml-auto">
            <span className="text-sm mr-2">Speed:</span>
            <select
              value={playbackSpeed}
              onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
              className="text-sm bg-background border rounded px-2 py-1"
            >
              <option value="2000">Slow</option>
              <option value="1000">Normal</option>
              <option value="500">Fast</option>
              <option value="200">Very Fast</option>
            </select>
          </div>

          <Badge variant="outline" className="ml-auto">
            Step {currentStep + 1} of {trace.length}
          </Badge>
        </div>

        <div className="mb-6 p-4 border rounded-md bg-muted">
          <h3 className="font-semibold mb-2">Current Stack</h3>
          <div className="flex flex-wrap gap-2">
            {trace[currentStep] && trace[currentStep].stack.map((symbol, index) => (
              <motion.div
                key={`${index}-${symbol}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className={`
                  px-3 py-1 rounded-md font-mono text-sm
                  ${nonTerminalStyle(symbol)}
                `}
              >
                {symbol}
              </motion.div>
            ))}
          </div>

          <h3 className="font-semibold mt-4 mb-2">Current Input</h3>
          <div className="flex flex-wrap">
            {trace[currentStep] && trace[currentStep].input.split("").map((char, index) => (
              <motion.div
                key={`input-${index}-${char}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`
                  px-2 py-1 font-mono text-sm
                  ${index === 0 ? "bg-yellow-100 dark:bg-yellow-900/30 rounded-md" : ""}
                `}
              >
                {char}
              </motion.div>
            ))}
          </div>

          <h3 className="font-semibold mt-4 mb-2">Action</h3>
          <div
            className={`
            p-2 rounded-md font-mono text-sm
            ${
              trace[currentStep] && trace[currentStep].matched
                ? "bg-green-100 dark:bg-green-900/30"
                : trace[currentStep] && trace[currentStep].action.includes("Error")
                  ? "bg-red-100 dark:bg-red-900/30"
                  : "bg-blue-100 dark:bg-blue-900/30"
            }
          `}
          >
            {trace[currentStep] && trace[currentStep].action}
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Step</TableHead>
                <TableHead>Stack</TableHead>
                <TableHead>Input</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence>
                {trace.slice(0, currentStep + 1).map((step, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0, backgroundColor: "rgba(var(--primary), 0.1)" }}
                    animate={{
                      opacity: 1,
                      backgroundColor:
                        index === currentStep ? "rgba(var(--primary), 0.1)" : "rgba(var(--background), 1)",
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className={index === currentStep ? "bg-primary/10" : ""}
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="font-mono">{step.stack.join(" ")}</TableCell>
                    <TableCell className="font-mono">
                      <span className="relative">
                        {step.input}
                        {index === currentStep && (
                          <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute -bottom-1 left-0 w-2 h-0.5 bg-primary"
                          />
                        )}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={
                          step.matched
                            ? "text-green-600 dark:text-green-400"
                            : step.action.includes("Error")
                              ? "text-red-600 dark:text-red-400"
                              : ""
                        }
                      >
                        {step.action}
                      </span>
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}

function nonTerminalStyle(symbol: string) {
  if (["S", "A", "B", "C", "D"].includes(symbol)) {
    return "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200"
  } else if (symbol === "$") {
    return "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200"
  } else {
    return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200"
  }
}
