open FParsec
open System

let test p str =
    match run p str with
    | Success(result, _, state) -> printfn "Success: %A - State: %A" result state
    | Failure(error, _, _) -> printfn "Failure: %A" error

[<EntryPoint>]
let main argv =
    test pfloat "3.2"
    test pint32 "3.4"
    test pfloat "3ee"
    0
