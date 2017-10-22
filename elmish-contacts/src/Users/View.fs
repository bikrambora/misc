module User.View

open Elmish.React
module R = Fable.Helpers.React
//open Fable.Helpers.React.Props
open Types

let placeholder msg =
    R.div [] [ R.str msg ]

let viewUsername user =
    lazyView placeholder user.name

let viewPlaceholder msg =
    R.section [] [
        lazyView placeholder msg
    ]

let viewUsernames users =
    R.section [] [
        R.ul []
            (users |> List.map viewUsername)
    ]
