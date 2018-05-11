namespace FsharpEmpty

open Amazon
open Amazon.DynamoDBv2
open Amazon.Lambda.Core
open Amazon.Lambda.APIGatewayEvents
open Amazon.Runtime

open FSharp.AWS.DynamoDB

open System

// Assembly attribute to enable the Lambda function's JSON input to be converted into a .NET class.
[<assembly: LambdaSerializer(typeof<Amazon.Lambda.Serialization.Json.JsonSerializer>)>]
()

[<AutoOpen>]
module Extensions =
    type AWSCredentials with
        static member FromEnvironmentVariables() : AWSCredentials =
            let accessKey = "AWS_ACCESS_KEY_ID"
            let secretKey = "AWS_SECRET_ACCESS_KEY"
            let getEnv = Environment.GetEnvironmentVariable

            match getEnv accessKey, getEnv secretKey with
                | null, null -> sprintf "Missing AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY environment variables" |> invalidOp
                | null, _ -> sprintf "Missing AWS_ACCESS_KEY_ID environment variable" |> invalidOp
                | _, null -> sprintf "Missing AWS_SECRET_ACCESS_KEY environment variable" |> invalidOp
                | aK, sK -> new BasicAWSCredentials(aK, sK) :> _

type Message = {
    [<HashKey>]
    id : Guid;
    info : string;
    text : string;
    authorId : Guid option;
    createdAt : DateTimeOffset option;
    updatedAt : DateTimeOffset option;
}

type Function() =
    member _this.FunctionHandler (req: APIGatewayProxyRequest) (ctx: ILambdaContext) =
        ctx.Logger.LogLine (sprintf "Request: %s" req.Path)

        let ddb = new AmazonDynamoDBClient(RegionEndpoint.USEast1)
        let table = TableContext.Create<Message>(ddb, "appsync-demo-messages", createIfNotExists = true)
        // let message = { 
        //     id = Guid.NewGuid(); 
        //     info = info; 
        //     text = "this is a message from F#";
        //     authorId = None;
        //     createdAt = Some DateTimeOffset.Now;
        //     updatedAt = None;
        // }

        let key = TableKey.Hash (Guid.Parse "")
        let item = table.GetItem key
        item
