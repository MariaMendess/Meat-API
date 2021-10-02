import * as restify from 'restify'
import {ForbiddenError} from 'restify-errors'

export const authorize: (...profiles: string[]) => restify.RequestHandler = (...profiles)=>{
    return (req, resp, next)=>{
        if(req.authenticate !== undefined && req.authenticate.hasAny(...profiles)){
            req.log.debug('User %s is authorized with profiles %s. Required profiles %j',
            req.authenticate._id, req.authenticate.profiles, req.path(),profiles)
            next()
        }else{
            if(req.authenticate){
            req.log.debug('Permission denied for %s. Required profiles: %j. User profiles: %j',
            req.authenticate._id, profiles, req.authenticate.profiles)
            }
            next(new ForbiddenError('Permission denied'))
        }
    }
}