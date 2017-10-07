module Users.State

open Elmish
open Fable.PowerPack
open Fable.PowerPack.Fetch

type Geo =
    {lat: string;
     lng: string}
type Address = 
    {street: string;
     suite: string;
     city: string;
     zipcode: string;
     geo: Geo}
type Company =
    {name: string;
     catchPhrase: string;
     bs: string}
type User =
    {id: int;
     name: string;
     username: string;
     email: string;
     phone: string;
     website: string;
     address: Address;
     company: Company}
type Model = string
type Msg =
    | FetchedUsers of User list
    | FetchError of System.Exception

let fetchUsers url =
    promise {
        return! fetchAs<User list> url []
    }

let usersFetch =
    Cmd.ofPromise fetchUsers "https://jsonplaceholder.typicode.com/users" FetchedUsers FetchError

let init () : Model * Cmd<Msg> =
  "", usersFetch

let update msg model : Model * Cmd<Msg> =
  match msg with
  | FetchedUsers users ->
      printfn "success: %A" (users |> List.head)
      "", []
  | FetchError err ->
      printfn "error: %A" err
      "", []