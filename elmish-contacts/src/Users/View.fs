module User.View

open Elmish.React
module R = Fable.Helpers.React
open Fable.Helpers.React.Props
open Types

let placeholder msg =
    R.div [] [ R.str msg ]

let viewUsername user =
    lazyView placeholder user.name

let viewPlaceholder msg =
    R.section [] [
        lazyView placeholder msg
    ]

let tableHeaders() =
    R.tr []
        [R.td [] [R.str "Name"]
         R.td [] [R.str "Email"]
         R.td [] [R.str "Company"]]

let viewUsers =
    List.map
        (fun x ->
            R.tr []
                [R.td [] [R.str x.name]
                 R.td [] [R.str x.email]
                 R.td [] [R.str x.company.name]])

let viewUsernames users =
    R.table
        [ ClassName "table" ]
        [R.thead [] [tableHeaders()]
         R.tbody [] (viewUsers users)]
