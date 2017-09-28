module App.Types

open Global

type CounterModel = {
    count: Counter.Types.Model
}

type Msg =
  | CounterMsg of Counter.Types.Msg
  | HomeMsg of Home.Types.Msg

type Model = {
    currentPage: Page;
    counter: CounterModel;
    home: Home.Types.Model
}
