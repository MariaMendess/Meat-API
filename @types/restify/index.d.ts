import {User} from '../../common/users/users.model'

declare module 'restify'{
    export interface Request{
        authenticate: User

    }
}