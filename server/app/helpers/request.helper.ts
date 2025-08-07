import { Request } from 'express';

export type GetRequest<ReqParams = any, ReqQuery = any> = Request<ReqParams, any, any, ReqQuery>;
export type PostRequest<ReqBody = any, ReqParams = any> = Request<ReqParams, any, ReqBody>;
export type PutRequest<ReqParams = any, ReqBody = any> = Request<ReqParams, any, ReqBody>;
export type DeleteRequest<ReqParams = any, ReqQuery = any> = Request<ReqParams, any, any, ReqQuery>;
