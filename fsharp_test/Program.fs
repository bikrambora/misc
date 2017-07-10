open System

type Move = Up | Down | Left | Right
type Position = { x: int; y: int }
type Robot = { position: Position }
type Board = { size: Position }
type State = { robot: Robot; board: Board }

let flip f x y = f y x
let inc = (+) 1
let dec = flip (-) 1

let (|ValidUp|_|) (y, maxY) (_:Move) = if inc y <= maxY then Some(inc y) else None
let (|ValidDown|_|) (y, minY) (_:Move) = if dec y >= minY then Some(dec y) else None
let (|ValidLeft|_|) (x, minX) (_:Move) = if dec x <= minX then Some(dec x) else None
let (|ValidRight|_|) (x, maxX) (_:Move) = if inc x <= maxX then Some(inc x) else None

let moveTo board (move:Move) robot =
    let { x = x; y = y } = robot.position
    let { x = maxX; y = maxY } = board.size
    let verticalMove newY = { position = { x = x; y = newY } }
    let horizontalMove newX = { position = { x = newX; y = y } }
    match move with
    | Up    & ValidUp (y, maxY) newY | Down  & ValidDown (y, 0) newY        -> verticalMove newY
    | Left  & ValidLeft (x, 0) newX  | Right & ValidRight (x, maxX) newX    -> horizontalMove newX
    | _                                                                     -> robot

let (|Arrow|_|) = function
    | ConsoleKey.UpArrow    -> Some(Up)
    | ConsoleKey.DownArrow  -> Some(Down)
    | ConsoleKey.LeftArrow  -> Some(Left)
    | ConsoleKey.RightArrow -> Some(Right)
    | _                     -> None

[<EntryPoint>]
let main argv =
    let robot = { position = { x = 0; y = 0 } }
    let board: Board = { size = { x = 4; y = 4 } }
    let initialState = { robot = robot; board = board }

    let rec game (state: State) =
        match Console.ReadKey(true).Key with
        | Arrow direction    -> printfn "%s" (string direction)
                                let newState = state
                                game(newState)
        | ConsoleKey.Escape  -> printfn "exiting"
                                state
        | _                  -> printfn "wrong input"
                                game(state)

    let result = game(initialState)
    printfn "%s" (string result.robot.position)
    0
