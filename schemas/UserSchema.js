import pkg from 'mongoose'

const { Schema, model } = pkg;

let $user = new Schema({
    user_id: Number,
    token: String,
    active: Boolean,
    access: Array,
    gs: Array,
    templates: Array
})

export default model('User', $user)