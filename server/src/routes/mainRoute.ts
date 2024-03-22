import { ResultCode } from "../../../datatypes/result";

export class MainRoute {
    public asyncHandler = (fn: ((req: any, res: any, next: any) => Promise<any>)) => (req: any, res: any, next: any): Promise<any> => {

        return fn(req, res, next)
            .then(
                (data) => {
                    const err = {
                        result: ResultCode.OK,
                        message: 'OK',
                        data: data
                    };
                    res.send(err);
                },
                (error) => {
                    const err = {
                        result: ResultCode.Error,
                        message: error
                    };
                    res.send(err);
                }
            );
    }
}
