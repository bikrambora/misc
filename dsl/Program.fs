open FParsec
open System

let test p str =
    match run p str with
    | Success(result, _, _)   -> printfn "Success: %A" result
    | Failure(error, _, _) -> printfn "Failure: %s" error

[<EntryPoint>]
let main argv =
    test pfloat "3.2"
    0
