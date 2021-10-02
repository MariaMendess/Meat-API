import {ModelRouter} from '../model-router'
import restify from 'restify'
import {User} from './users.model'
import {authenticate} from '../../security/auth.handler'
import {NotFoundError} from 'restify-errors'
import {authorize} from '../../security/authz.handler'

class UsersRouter extends ModelRouter<User> {

    private corsPlugins: any
    constructor(){
        super(User)
        this.on('beforeRender', document=>{
            document.password = undefined
        })
    }

    findByEmail = (req, resp, netx)=>{
        if(req.query.email){
            User.findByEmail(req.query.email)
            .then(user => user ? [user] : [])
            .then(this.renderAll(resp, netx, {
                pageSize: this.pageSize,
                url: req.url
            }))
            .catch()
        }else{
            netx()
        }
    }

    applyRoutes(application: restify.Server){
        application.get(`/${this.basePath}`, restify.plugins.conditionalHandler([
            { version: '2.0.0', handler: [authorize('admin'), this.findByEmail, this.findAll]},
            { version: '1.0.0', handler: [authorize('admin'), this.findAll]}
            ]))
        //application.get('/users',  this.findAll)
        //application.get('/users:id', [this.valedateId, this.findById])
        application.get(`/${this.basePath}/:id`, [authorize('admin'), this.valedateId, this.findById])
        application.post(`/${this.basePath}`, [authorize('admin'), this.save])
        application.put(`/${this.basePath}/:id`, [authorize('admin'), this.valedateId, this.replace])
        application.patch(`/${this.basePath}/:id`, [authorize('admin'), this.valedateId, this.update])
        application.del(`/${this.basePath}/:id`, [authorize('admin'), this.valedateId, this.delete])

        application.post(`/${this.basePath}/authenticate`, authenticate)

    }
}

export const usersRouter = new UsersRouter()