import { expect } from "chai";

import NotFoundError from "../../../../src/shared/error/BaseNotFoundError";
import { Repository as UserRepository } from "../../../../src/modules/user/infrastructure/Repository";
import UserService from "../../../../src/modules/user/domain/UserService";

describe("ProductService", function () {
    let repository: UserRepository;
    let service: UserService;

    beforeEach(() => {
        repository = <UserRepository>{};
        service = new UserService(repository);
    });

    it("deleteUserById should throw an error if there is an error deleting the user", async function () {
        // Given
        const userId = "foo";

        repository.deleteUserById = async (userId: string): Promise<boolean> => {
            return false;
        };

        try {
            // When
            await service.deleteUserById(userId);
        } catch (error: any) {
            // Then
            expect(error).instanceOf(NotFoundError);
        }
    });

    it("deleteUserById should return without any error if there is no error deleting the user", async function () {
        // Given
        const userId = "foo";

        repository.deleteUserById = async (userId: string): Promise<boolean> => {
            return true;
        };

        // When
        await service.deleteUserById(userId);
    });
});
