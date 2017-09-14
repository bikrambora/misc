#r "FSharp.Data.dll"

open FSharp.Data

// type json = JsonProvider<"""[{ "name": "l" }, { "name": 23 }]""">

// let j = json.GetSamples() |> Seq.last

// match j.Name.Number, j.Name.String with
//     | Some num, _ -> printfn "%d" (num + 1)
//     | _, Some str -> printfn "%s" ("Hello " + str)
//     | _, _ -> printfn "No matching type"

// type Post = JsonProvider<"""{ "userId": 1, "id": 1, "title": "string", "body": "2"}""">
// try
//     let post = Post.Parse("""{ "userId": 1, "id": 1, "title": "string", "body": "string"}""")
//     printfn "%d" post.Body
// with error -> printfn "error"

type Post = JsonProvider<"""{ "userId": 1, "id": 1, "title": "string", "body": "2"}""">
async {
    try
        let! post = Post.AsyncLoad("https://jsonplaceholder.typicode.com/posts/2")
        printfn "%d" post.Body
    with error -> printfn "error"
}