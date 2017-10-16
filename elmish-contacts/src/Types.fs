module App.Types

open Global

type Msg =
  | CounterMsg of Counter.Types.Msg
  | HomeMsg of Home.Types.Msg
  | UsersMsg of User.State.Msg

type Model = {
    currentPage: Page;
    counter: Counter.Types.Model;
    home: Home.Types.Model;
    users: User.State.Model;
}
