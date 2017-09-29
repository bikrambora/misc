module Home.State

open Elmish
open Types
open Fable.PowerPack
open Fable.PowerPack.Fetch

let fetchTest url =
    promise {
        return! fetchAs<Post> url []
    }

let testFetch =
    Cmd.ofPromise fetchTest "https://jsonplaceholder.typicode.com/posts/2" FetchedPost FetchError

let init () : Model * Cmd<Msg> =
  "", testFetch

let update msg model : Model * Cmd<Msg> =
  match msg with
  | ChangeStr str ->
      str, []
  | FetchedPost post ->
      printfn "%A" post
      "", []
  | FetchError err ->
      printfn "%A" err
      "", []
