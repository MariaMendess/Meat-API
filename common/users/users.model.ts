import * as mongoose from 'mongoose'
import {validateCPF} from '../validators'
import { environment } from '../environment'
import * as bcrypt from 'bcryptjs'


export interface User extends mongoose.Document{
    name: string,
    email: string,
    password: string,
    gender: string,
    cpf: string,
    profiles: string[],
    matches(password: string): boolean,
    hasAny(...profiles: string[]): boolean
    //hasAny('admn', 'user')
}

export interface UserModel extends mongoose.Model<User> {
    findByEmail(email: string, projection?: string): Promise<User>
}

const userSchema = new mongoose.Schema<User, mongoose.Model<User>>({
    name: {
        type: String,
        required: true,
        maxlength: 80,
        minlength: 3
    },
    email: {
        type: String,
        unique: true,
        match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        required: true
    },
    password: {
        type: String,
        select: false,
        required: true
    },
    gender: {
        type: String,
        required: false,
        enum: ['Male', 'Female']
    },
    cpf: {
        type: String,
        required: false,
        validate: {
            validator: validateCPF,
            message: '{PATH}: Invalid CPF ({VALUE})'
          }
    },
    profile: {
        type: [String],
        required: false,
        
    }

})

userSchema.statics.findByEmail = function(email: string, projection: string){
    return this.findOne({email}, projection)
}

userSchema.methods.matches = function(password: string): boolean{
    return bcrypt.compareSync(password, this.password)
    //return password === this.password
}

userSchema.methods.hasAny = function(...profiles: string[]) : boolean {
    return profiles.some(profile => this.profiles.indexOf(profile) !== -1)
}

const hashPassword = (obj, next)=>{
    bcrypt.hash(obj.password, environment.security.saltRounds)
    .then(hash=>{
        obj.password = hash
        next()
    }).catch(next)
}


const saveMiddleware = function (next){
    //@ts-ignore
    const user: User = (<any>this)
    if(!user.isModified('password')){
      next()
    }else{
      hashPassword(user, next)
    }
  }
  
  const updateMiddleware = function (next){
      //@ts-ignore
    if(!this.getUpdate().password){
      next()
    }else{
        //@ts-ignore
      hashPassword(this.getUpdate(), next)
    }
  }
  
  userSchema.pre('save', saveMiddleware)
  userSchema.pre('findOneAndUpdate', updateMiddleware)
  userSchema.pre('update', updateMiddleware)

export const User = mongoose.model<User, UserModel>('User', userSchema)