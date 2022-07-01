import { hashPassword } from "../../../shared/utils/hashUtils";
import Page from "../../../shared/Page";
import User from "../../domain/User";
import { Repository } from "../Repository";

import UserDocument, { UserDao, UserFullDocument } from "./UserDao";
import { fromUserToDao, updateUserDocument } from "./userParsers";

class UserRepository implements Repository {
    public async insert(user: User): Promise<User> {
        const userToSave: UserDao = fromUserToDao(user);

        const newUserDocument: UserFullDocument = await UserDocument.create(userToSave);

        const newUserModel = newUserDocument.toModel();
        return newUserModel;
    }

    public async insertBatch(users: Array<User>): Promise<Array<User>> {
        const usersToSave: Array<UserDao> = users.map((user) => fromUserToDao(user));

        const newUserDocuments: Array<UserFullDocument> = await UserDocument.insertMany(usersToSave);

        const insertedUsers: Array<User> = newUserDocuments.map((newUserDocument) => newUserDocument.toModel());
        return insertedUsers;
    }

    public async updateUserById(userId: string, user: User): Promise<User | null> {
        const userDocument: UserFullDocument | null = await UserDocument.findOne({ remoteId: userId }).exec();

        if (!userDocument) {
            return null;
        }

        const userDocumentUpdated: UserFullDocument = updateUserDocument(userDocument, user);
        const updatedUserDocument: UserFullDocument = await userDocumentUpdated.save();

        const updatedUser: User = updatedUserDocument.toModel();
        return updatedUser;
    }

    public async updatePassword(user: User, newPassword: string): Promise<void> {
        const userDocument: UserFullDocument | null = await UserDocument.findOne({ remoteId: user.id }).exec();

        if (!userDocument) {
            return null;
        }

        userDocument.password = newPassword;
        userDocument.resetPasswordToken = null;
        userDocument.resetPasswordExpirationDate = null;

        await userDocument.save();
    }

    public async deleteUserById(userId: string): Promise<boolean> {
        const deletedUserDocument: UserFullDocument = await UserDocument.findOneAndDelete({
            remoteId: userId,
        }).exec();

        const success = !!deletedUserDocument;
        return success;
    }

    public async getAllUsers(page: number, itemsPerPage: number): Promise<Page<Array<User>>> {
        const userDocuments: Array<UserFullDocument> = await UserDocument.find()
            .skip((page - 1) * itemsPerPage)
            .limit(itemsPerPage);

        const users: Array<User> = userDocuments.map((userDocument) => userDocument.toModel());
        const totalDocuments: number = users.length;

        return new Page<Array<User>>({
            data: users,
            currentPage: page,
            totalNumberOfDocuments: totalDocuments,
            itemsPerPage: itemsPerPage,
        });
    }

    public async getUserById(userId: string): Promise<User | null> {
        const userDocument: UserFullDocument | null = await UserDocument.findOne({ remoteId: userId }).exec();

        const userModel = userDocument?.toModel();
        return userModel;
    }

    public async getUserByEmail(email: string): Promise<User | null> {
        const userDocument: UserFullDocument | null = await UserDocument.findOne({ email }).exec();

        const userModel = userDocument?.toModel();
        return userModel;
    }
}

export default UserRepository;
