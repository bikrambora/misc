module Users.State

open Elmish
open Fable.Import
open Fable.PowerPack
open Fable.PowerPack.Fetch
open Fable.Helpers.React.Props
module R = Fable.Helpers.React

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
type Model =
    {users: User list;
     error: bool}
type Msg =
    | FetchUsersSuccess of User list
    | FetchUsersError of System.Exception

let fetchUsers url =
    promise {
        return! fetchAs<User list> url []
    }

let usersFetch =
    Cmd.ofPromise fetchUsers "https://jsonplaceholder.typicode.com/users" FetchUsersSuccess FetchUsersError

let init () : Model * Cmd<Msg> =
  { users = []; error = false }, usersFetch

open Fable.Core.JsInterop
open Fable.Helpers.React.Props
open Elmish.React

let placeholder msg =
    R.div [] [ R.str msg ]

let viewUsername user =
    lazyView placeholder user.name

let viewNoUsers msg =
    R.section [] [
        lazyView placeholder msg
    ]

let viewUsernames users =
    R.section [] [
        R.ul []
            (users |> List.map viewUsername)
    ]

let (|Error|NoUsers|Users|) = function
    | { error = true }  -> Error("Error fetching")
    | { users = [] }    -> NoUsers("No users found")
    | { users = users } -> Users(users)

let root model dispatch =
    match model with
    | Error(msg)   -> viewNoUsers msg
    | NoUsers(msg) -> viewNoUsers msg
    | Users(users) -> viewUsernames users

let update msg model : Model * Cmd<Msg> =
  match msg with
  | FetchUsersSuccess users ->
      printfn "success: %A" (users |> List.head)
      {model with
        users = users;
        error = false}, []
  | FetchUsersError ex ->
      printfn "error: %A" ex
      {model with
        error = true;
        users = []}, []
