open System

let encoding        = "0123456789ABCDEFGHJKMNPQRSTVWXYZ"
let encodingLength  = 32UL

let (|Positive|NotPositive|) num =
    match num > 0 with
    | true -> Positive
    | _    -> NotPositive

let concatEncoding chars =
    List.fold (fun acc char -> acc + (encoding.Chars char).ToString()) "" chars

let encodeTime timestamp length =
    let rec loop ts len chars =
        match len with
        | Positive    -> let char = ts % 32UL
                         let acc = (ts - char) / 32UL
                         loop acc (len - 1) ((Convert.ToInt32 char)::chars)
        | NotPositive -> chars

    loop timestamp length []

[<EntryPoint>]
let main argv =
    let q = [(1470118279201UL, 8); (1470118279201UL, 8)] |> List.map(fun tpl -> encodeTime 1470118279201UL 8) |> List.map concatEncoding
    printfn "%A" q
    0
