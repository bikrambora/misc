#r "FSharp.Data.dll"

open FSharp.Data

// type json = JsonProvider<"""[{ "name": "l" }, { "name": 23 }]""">

// let j = json.GetSamples() |> Seq.last

// match j.Name.Number, j.Name.String with
//     | Some num, _ -> printfn "%d" (num + 1)
//     | _, Some str -> printfn "%s" ("Hello " + str)
//     | _, _ -> printfn "No matching type"

type Post = JsonProvider<"""{ "userId": 1, "id": 1, "title": "string", "body": "string"}""">
async {
    let! post = Post.AsyncLoad("https://jsonplaceholder.typicode.com/posts/1")
    printfn "%s" post.Body
} |> Async.Start
System.Console.ReadLine()