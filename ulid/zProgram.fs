open Ulid
open System

[<EntryPoint>]
let main argv =
    printfn "%s" (Ulid.New)
    printfn "%s" (Ulid.FromTimestamp 1469918176385L)
    0