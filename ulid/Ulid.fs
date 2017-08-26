namespace Ulid

open Ulid.Extensions

open System

[<AutoOpen>]
module Ulid =
    let encoding        = "0123456789ABCDEFGHJKMNPQRSTVWXYZ"
    let encodingLength  = 32L

    let (|Positive|NotPositive|) num =
        match num > 0 with
        | true -> Positive
        | _    -> NotPositive

    let concatEncoding chars =
        List.fold (fun acc char -> acc + (encoding.Chars char).ToString()) "" chars

    let encodeRandom length min max =
        let rnd = Random();
        List.init length (fun _ -> rnd.Next(min,max))

    let encodeTime timestamp length =
        let rec loop ts len chars =
            match len with
            | Positive    -> let char = ts % encodingLength
                             let acc = (ts - char) / encodingLength
                             loop acc (len - 1) ((Convert.ToInt32 char)::chars)
            | NotPositive -> chars

        loop timestamp length []

    type Ulid =
        static member private Generate timestamp =
            let time = encodeTime timestamp 10 |> concatEncoding
            let rnd  = encodeRandom 16 0 31 |> concatEncoding
            time + rnd

        static member FromTimestamp timestamp =
            Ulid.Generate timestamp

        static member New =
            Ulid.Generate DateTime.UnixTime