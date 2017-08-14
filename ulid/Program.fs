open System

let encoding        = "0123456789ABCDEFGHJKMNPQRSTVWXYZ"
let encodingLength  = 32UL

let (|Positive|NotPositive|) num =
    match num > 0 with
    | true -> Positive
    | _    -> NotPositive

let concatEncoding pos =
    List.fold (fun acc ele -> acc + (encoding.Chars ele).ToString()) "" pos

let rec encodeTime (now:uint64) len positions =
    match len with
    | Positive    -> let pos = now % 32UL
                     let acc = (now - pos) / 32UL
                     encodeTime acc (len - 1) ((Convert.ToInt32 pos)::positions)
    | NotPositive -> positions

[<EntryPoint>]
let main argv =
    let q = encodeTime 1470118279201UL 8 [] |> concatEncoding
    printfn "%s" q
    0
