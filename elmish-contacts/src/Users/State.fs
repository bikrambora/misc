module Users.State

open Elmish
//open Types
open Fable.PowerPack
open Fable.PowerPack.Fetch

type User = { name: string }
type Model = string
type Msg =
    | FetchedUsers of User list
    | FetchError of System.Exception

let fetchUsers url =
    promise {
        return! fetchAs<User list> url []
    }

let testFetch =
    Cmd.ofPromise fetchUsers "https://jsonplaceholder.typicode.com/users" FetchedUsers FetchError

let init () : Model * Cmd<Msg> =
  "", testFetch

let update msg model : Model * Cmd<Msg> =
  match msg with
  | FetchedUsers users ->
      printfn "success: %A" users
      "", []
  | FetchError err ->
      printfn "error: %A" err
      "", []
