import { run } from 'jest-cli'
import {Server} from './server/server'
import {environment} from './common/environment'
import {usersRouter} from './common/users/users.router'
import {reviewsRouter} from './reviews/reviews.router'
import {User} from './common/users/users.model'
import {Review} from './reviews/reviews.model'

let server: Server

const beforeAllTests = ()=>{
    environment.db.url = process.env.DB_URL || 'mongodb://localhost/meat-api-test-db'
    environment.server.port = process.env.SERVER_PORT || 3334
    server = new Server()
    return server.bootstrap([usersRouter, reviewsRouter])
                 .then(()=>User.remove({}).exec())
                 .then(()=>Review.remove({}).exec())
}

const afterAllTests = ()=>{
    return server.shutdown()
}

beforeAllTests()
.then(()=>run())
.then(()=>afterAllTests())
.catch(console.error)