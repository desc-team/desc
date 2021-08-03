import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import * as middleware from './user-model-middleware';
const Schema = mongoose.Schema;

const ALLOWED_ROLES = ['admin', 'approver', 'requestor', 'volunteer', 'unknown'];
const PROGRAMS = {
    housing: 'Housing First',
    integrated: 'Integrated Services',
    survival: 'Survival Services',
    health: 'Health Services',
    employment: 'Employment Services',
    research_innovation: 'Research & Innovation'
};

const userSchema = new Schema(
    {
        name: {
            first: { type: String, trim: true, required: true },
            last: { type: String, trim: true, required: true }
        },
        email: { type: String, trim: true, required: true, unique: true },
        program: {
            type: String,
            trim: true,
            lowercase: true,
            required: true,
            enum: Object.keys(PROGRAMS)
        },
        password: { type: String, required: true },
        passwordLastUpdatedAt: { type: Date },
        passwordResetToken: { type: String },
        passwordResetTokenExpiresAt: { type: Date },
        lastLoginAt: { type: Date, default: Date.now() },
        emailVerificationToken: { type: String },
        isEmailVerified: { type: Boolean, default: false },
        roles: {
            type: [String],
            enum: ALLOWED_ROLES,
            default: ['requestor']
        }
    },
    { timestamps: true }
);

userSchema.pre('save', middleware.hashPassword);
userSchema.post('save', middleware.checkForErrors);

userSchema.methods.verifyPassword = function(password) {
    if (password == null || password == undefined) return false;
    return bcrypt.compareSync(password, this.password);
};

userSchema.methods.isAdmin = function() {
    return this.roles.includes('admin');
};

userSchema.methods.addRole = function(role) {
    if (ALLOWED_ROLES.includes(role) && !this.roles.includes(role)) {
        this.roles.push(role);
    }
};

userSchema.methods.removeRole = function(role) {
    var roleIndex = this.roles.indexOf(role);
    if (roleIndex !== -1) {
        this.roles.splice(roleIndex, 1);
    }
};

userSchema.methods.toClientJSON = function() {
    let userDataForClient = {
        _id: this._id,
        name: {
            first: this.name.first,
            last: this.name.last
        },
        email: this.email,
        program: this.program,
        roles: this.roles
    };

    return userDataForClient;
};

const User = mongoose.model('User', userSchema);

export default User;
