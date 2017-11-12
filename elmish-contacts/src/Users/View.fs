module User.View

open Elmish.React
module R = Fable.Helpers.React
open Fable.Helpers.React.Props
open Types

let headers =
    ["Name"; "Email"; "Company"; "Username"; "City"]

let placeholder msg =
    R.div [] [ R.str msg ]

let viewUsername user =
    lazyView placeholder user.name

let viewPlaceholder msg =
    R.section [] [
        lazyView placeholder msg
    ]

let tableHeaders =
    List.map (fun x -> R.td [] [R.str x])

let viewUsers =
    List.map
        (fun x ->
            R.tr []
                [R.td [] [R.str x.name]
                 R.td [] [R.str x.email]
                 R.td [] [R.str x.company.name]
                 R.td [] [R.str x.username]
                 R.td [] [R.str x.address.city]])

let viewUsernames users =
    R.table
        [ ClassName "table" ]
        [R.thead [] [R.tr [] (tableHeaders headers)]
         R.tbody [] (viewUsers users)]
