#r "FSharp.Data.dll"

open FSharp.Data

// type json = JsonProvider<"""[{ "name": "l" }, { "name": 23 }]""">

// let j = json.GetSamples() |> Seq.last

// match j.Name.Number, j.Name.String with
//     | Some num, _ -> printfn "%d" (num + 1)
//     | _, Some str -> printfn "%s" ("Hello " + str)
//     | _, _ -> printfn "No matching type"

type Post = JsonProvider<"""{ "userId": "1", "id": "1", "title": "string", "body": "string"}""">
async {
    try
        let! post = Post.AsyncLoad("https://jsonplaceholder.typicode.com/posts/2")
        printfn "%s" post.Title
    with error -> printfn "error"
} |> Async.Start

type ErrPost = JsonProvider<"""{ "userId": 1, "id": 1, "title": "string", "body": "2"}""">
async {
    try
        let! post = ErrPost.AsyncLoad("https://jsonplaceholder.typicode.com/posts/2")
        printfn "%A" post.Body
    with error -> printfn "%A" error
} |> Async.Start