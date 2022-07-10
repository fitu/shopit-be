import { expect } from "chai";

import DeleteUserByIdInteractor, { DeleteUserByIdData } from "../../../src/user/application/DeleteUserByIdInteractor";
import UserService from "../../../src/user/domain/UserService";
import NotFoundError from "../../../src/shared/error/NotFoundError";
import NotAllowError from "../../../src/shared/error/NotAllowError";
import UserNotFoundError from "../../../src/user/application/error/UserNotFoundError";

describe("DeleteUserByIdInteractor", function () {
    let service: UserService;
    let interactor: DeleteUserByIdInteractor;

    beforeEach(() => {
        service = <UserService>{};
        interactor = new DeleteUserByIdInteractor(service);
    });

    it("deleteProductById should throw NotAllowError if user is not admin", async function () {
        // Given
        service.isAdmin = async (productId: string): Promise<boolean> => {
            return false;
        };

        const inputData: DeleteUserByIdData = { userId: "foo", userToDelete: "bar" };

        try {
            // When
            await interactor.execute(inputData);
        } catch (error: any) {
            // Then
            expect(error).instanceOf(NotAllowError);
        }
    });

    it("deleteProductById should throw NotFoundError if user is admin but user to delete is not found", async function () {
        // Given
        service.isAdmin = async (productId: string): Promise<boolean> => {
            return true;
        };

        service.deleteUserById = async (userId: string): Promise<void> => {
            throw new UserNotFoundError();
        };

        const inputData: DeleteUserByIdData = { userId: "foo", userToDelete: "bar" };

        try {
            // When
            await interactor.execute(inputData);
        } catch (error: any) {
            // Then
            expect(error).instanceOf(NotFoundError);
        }
    });

    it("deleteProductById should return without any error if user is admin and user to delete is found", async function () {
        // Given
        service.isAdmin = async (productId: string): Promise<boolean> => {
            return true;
        };

        const errorMessage = "foo";
        service.deleteUserById = async (userId: string): Promise<void> => {
            return;
        };

        const inputData: DeleteUserByIdData = { userId: "foo", userToDelete: "bar" };

        // When
        await interactor.execute(inputData);

        // Then
    });
});
