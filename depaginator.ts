import { NextFunction, Request, Response } from "express";

const gbuffer: any = {};
export function depag(req: Request, res: Response, next: NextFunction): any {
    if (req.body.id && req.body.pageno && req.body.payloadSize && req.body.total &&  req.body.data) {
    validateJsonDataPacket(req, res, next);
}else {next(); }
}

function validateJsonDataPacket(req: Request, res: Response, next: NextFunction): any {
    const packetArray: any[] = [];
    const y: any = req.body;

     // if id is already pesent
    let isInclude: boolean = false;
    if (gbuffer[y.id]) {
        gbuffer[y.id].forEach((element: any ) => {
                if (element.pageno === y.pageno) {
                    isInclude = true;
                }
            });
        // for (let i = 0; i < gbuffer[y.id] ; i += 1) {
        //     // tslint:disable-next-line:triple-equals
        //     if ((gbuffer[y.id])[i].pageno == y.pageno) {
        //         isInclude = true;
        //     }
        // }
        if (isInclude) {
            res.status(400).send({ error: "already in the gbuffer" });
        }
        // tslint:disable-next-line:one-line
        else {
            gbuffer[y.id].push(y);
            // tslint:disable-next-line:triple-equals
            if ((gbuffer[y.id]).length == gbuffer[y.id][0].total) {
                depaginate(gbuffer[y.id], req, res, next);
            } else {
            res.status(200).send({ status: "packet (id:" + y.id + "pageno:" + y.pageno + ") has entered the buffer" });
            }
        }
    }

     // if id is not there
    // tslint:disable-next-line:one-line
    else {
        packetArray.push(y);
        gbuffer[y.id] = packetArray;
        // tslint:disable-next-line:triple-equals
        if (gbuffer[y.id].length == gbuffer[y.id][0].total) {
            depaginate(gbuffer[y.id], req, res, next);
        }
        // tslint:disable-next-line:one-line
        else {
            res.status(200).send({ status: "packet (id:" + y.id + "pageno:" + y.pageno + ") has entered the buffer" });

        }
    }
}

function depaginate(x: any, req: Request, res: Response, next: NextFunction): any {
    let obj: string = "";
    const order: any = [x.length];
    // tslint:disable-next-line:prefer-for-of
    for (let i: any = 0; i < x.length; i += 1) {
        order[x[i].pageno - 1] = x[i].data;

    }
    // tslint:disable-next-line:prefer-for-of
    for (let i: any = 0; i < order.length; i += 1) {
        obj = obj + (order[i]);
     }
    req.body = obj;
    delete gbuffer[req.body.id];
    res.status(200).send({ status: "depaginated at the backend" });
    next();
}
