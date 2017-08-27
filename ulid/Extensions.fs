namespace Ulid.Extensions

open System

[<AutoOpen>]
module Date =
    type DateTime with
        static member UnixTime =
            Convert.ToInt64 (DateTime.UtcNow.Subtract(DateTime(1970, 1, 1)).TotalSeconds)

[<AutoOpen>]
module Random =
    type Random with
        member this.GetSequence(min, max) =
            Seq.initInfinite (fun _ -> this.Next(min, max))