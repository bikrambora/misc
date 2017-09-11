#r "FSharp.Data.dll"

open FSharp.Data

let data = WorldBankData.GetDataContext()

data
    .Countries.``Argentina``
    .Indicators.``Account, primary education or less (% ages 15+)``
    |> Seq.head