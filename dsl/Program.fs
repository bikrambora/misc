open FParsec
open System

let test p str =
    match run p str with
    | Success(result, _, _) -> printfn "Success: %A" result
    | Failure(error, _, _)  -> printfn "Failure: %A" error

let betweenStrings str1 str2 p = p |> between (pstring str1) (pstring str2)
let floatBetweenBrackets = pfloat |> betweenStrings "[" "]"

[<EntryPoint>]
let main argv =
    test pfloat "3.2"
    test pint32 "3.4"
    test pfloat "3ee"
    test (floatBetweenBrackets) "[[1.0]]"
    test floatBetweenBrackets "[1.0]"
    test (many floatBetweenBrackets) "[1][2][3]"
    0
