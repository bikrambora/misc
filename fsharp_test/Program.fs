open System

type Move = Up | Down | Left | Right
type Position = { x: int; y: int }
type Robot = { position: Position }
type Board = { size: Position }
type State = { robot: Robot; board: Board }
type Action = Place of Position | Move of Move
type KeyAction =
    | ArrowKey of Move
    | ExitKey
    | InvalidKey

let flip f x y = f y x
let inc = (+) 1
let dec = flip (-) 1

let (|ValidUp|_|) (newY:int, maxY:int) (_:Move) = if newY <= maxY then Some newY else None
let (|ValidDown|_|) (newY:int, minY:int) (_:Move) = if newY >= minY then Some newY else None
let (|ValidLeft|_|) (newX:int, minX:int) (_:Move) = if newX >= minX then Some newX else None
let (|ValidRight|_|) (newX:int, maxX:int) (_:Move) = if newX <= maxX then Some newX else None

let (|ValidMove|_|) (position:int, min:int, max:int) (_:Move) = if position >= min && position <= max then Some position else None

let (|ArrowKey|ExitKey|InvalidKey|) = function
    | ConsoleKey.UpArrow    -> ArrowKey Up
    | ConsoleKey.DownArrow  -> ArrowKey Down
    | ConsoleKey.LeftArrow  -> ArrowKey Left
    | ConsoleKey.RightArrow -> ArrowKey Right
    | ConsoleKey.Escape     -> ExitKey
    | _                     -> InvalidKey

let moveTo state move =
    let { x = x; y = y } = state.robot.position
    let { x = maxX; y = maxY } = state.board.size
    let moveY newY = { state with robot = { position = { x = x; y = newY } } }
    let moveX newX = { state with robot = { position = { x = newX; y = y } } }
    match move with
    | Up    & ValidMove (inc y, 0, maxY) newY
    | Down  & ValidMove (dec y, 0, maxY) newY  -> moveY newY
    | Left  & ValidMove (dec x, 0, maxX) newX
    | Right & ValidMove (inc x, 0, maxX) newX  -> moveX newX
    | _                                        -> state

[<EntryPoint>]
let main argv =
    let robot = { position = { x = 0; y = 0 } }
    let board: Board = { size = { x = 4; y = 4 } }
    let initialState = { robot = robot; board = board }

    let rec gameLoop (state: State) =
        match Console.ReadKey(true).Key with
        | ArrowKey direction -> printfn "%s" (string direction)
                                moveTo state direction |> gameLoop
        | ExitKey            -> printfn "exiting"
                                state
        | InvalidKey         -> printfn "wrong input"
                                gameLoop state

    printfn ""
    printfn "> Use arrow keys to move the robot"
    printfn "> Exit at any time by pressing ESC key"
    printfn ""
    let result = gameLoop initialState
    printfn "%A" result.robot.position
    0
