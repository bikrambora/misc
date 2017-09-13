#r "FSharp.Data.dll"

open FSharp.Data

// type json = JsonProvider<"""[{ "name": "l" }, { "name": 23 }]""">

// let j = json.GetSamples() |> Seq.last

// match j.Name.Number, j.Name.String with
//     | Some num, _ -> printfn "%d" (num + 1)
//     | _, Some str -> printfn "%s" ("Hello " + str)
//     | _, _ -> printfn "No matching type"

// type Post = JsonProvider<"""{ "userId": 1, "id": 1, "title": "string", "body": "string"}""">
async {
    //System.Net.ServicePointManager.ServerCertificateValidationCallback += (o, certificate, chain, errors) => true;
    let req = System.Net.WebRequest.Create("https://jsonplaceholder.typicode.com/posts/1")
    let! res = req.AsyncGetResponse()
    printfn "%d" res.ContentLength
} |> Async.RunSynchronously
System.Console.ReadLine()