open Extensions.Date
open System

let encoding        = "0123456789ABCDEFGHJKMNPQRSTVWXYZ"
let encodingLength  = 32L

let (|Positive|NotPositive|) num =
    match num > 0 with
    | true -> Positive
    | _    -> NotPositive

let concatEncoding chars =
    List.fold (fun acc char -> acc + (encoding.Chars char).ToString()) "" chars

let encodeRandom length =
    let rnd = Random();
    List.init length (fun _ -> rnd.Next(0, 31))

let encodeTime timestamp length =
    let rec loop ts len chars =
        match len with
        | Positive    -> let char = ts % 32L
                         let acc = (ts - char) / 32L
                         loop acc (len - 1) ((Convert.ToInt32 char)::chars)
        | NotPositive -> chars

    loop timestamp length []

type Ulid =
    static member private Generate timestamp =
        let time = encodeTime timestamp 10 |> concatEncoding
        let rnd  = encodeRandom 16 |> concatEncoding
        time + rnd

    static member FromTimestamp timestamp =
        Ulid.Generate timestamp

    static member New =
        Ulid.Generate DateTime.UnixTime

[<EntryPoint>]
let main argv =
    printfn "%s" (Ulid.New)
    printfn "%s" (Ulid.FromTimestamp 1469918176385L)
    0