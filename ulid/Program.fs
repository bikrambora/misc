open System

let encoding        = "0123456789ABCDEFGHJKMNPQRSTVWXYZ"
let encodingLength  = 32UL

let (|Positive|NotPositive|) num =
    match num > 0 with
    | true -> Positive
    | _    -> NotPositive

let concatEncoding pos =
    List.fold (fun acc ele -> acc + (encoding.Chars ele).ToString()) "" pos

let rec testy (now:uint64) len positions =
    match len with
    | Positive    -> let pos = now % 32UL
                     let acc = (now - pos) / 32UL
                     testy acc (len - 1) ((Convert.ToInt32 pos)::positions)
    | NotPositive -> positions

[<EntryPoint>]
let main argv =
    printfn "Hello World from F#!"
    let q = testy 1470118279201UL 8 [] |> concatEncoding
    0
