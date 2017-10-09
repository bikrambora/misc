module Users.State

open Elmish
open Fable.Import
open Fable.PowerPack
open Fable.PowerPack.Fetch
open Fable.Helpers.React
open Fable.Helpers.React.Props

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
    {users: User list}
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
  { users = [] }, usersFetch

open Fable.Core.JsInterop
open Fable.Helpers.React.Props
open Elmish.React

let placeholder msg =
    div [] [ str msg ]

let viewUsername user =
    lazyView placeholder user.name

let viewNoUsers msg =
    section [] [
        lazyView placeholder msg
    ]

let viewUsernames users =
    section [] [
        ul []
            (users |> List.map(viewUsername))
    ]

let (|NoUsers|Users|) = function
    | [] -> NoUsers
    | _  -> Users

let root model dispatch =
    match model.users with
    | NoUsers -> viewNoUsers "No users found"
    | Users   -> viewUsernames model.users

let update msg model : Model * Cmd<Msg> =
  match msg with
  | FetchedUsers users ->
      printfn "success: %A" (users |> List.head)
      { users = users }, []
  | FetchError err ->
      printfn "error: %A" err
      model, []
