open Ulid
open System

[<EntryPoint>]
let main argv =
    printfn "%A" (Ulid.New)
    printfn "%A" (Ulid.FromTimestamp 1469918176385L)
    0