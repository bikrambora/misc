namespace FsharpEmpty.Tests

open Xunit
open Amazon.Lambda.TestUtilities
open Amazon.Lambda.APIGatewayEvents

open FsharpEmpty


module FunctionTest =

    [<Fact>]
    let ``Invoke ToDynamo Lambda Function``() =
        let lambdaFunction = Function()
        let context = TestLambdaContext()
        let request = 
            APIGatewayProxyRequest(
                QueryStringParameters = dict["id", "a061ca4d-b46c-fec7-5b0b-5f9f1add4564"]
            )
        // "a061ca4d-b46c-fec7-5b0b-5f9f1add4564"
        let item = lambdaFunction.FunctionHandler request context

        printfn "%s" item.Body

        Assert.Equal(1, 1)
    
    [<EntryPoint>]
    let main argv = 0    