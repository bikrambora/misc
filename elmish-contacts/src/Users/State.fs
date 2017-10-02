module Users.State

open Elmish
open Fable.PowerPack
open Fable.PowerPack.Fetch

type User = {
    id: int;
    name: string;
    username: string;
    email: string;
    phone: string;
    website: string;
}
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
      printfn "success: %A" (users |> List.head)
      "", []
  | FetchError err ->
      printfn "error: %A" err
      "", []
