import EmailService from "../../shared/integrations/emails/EmailService";
import Interactor from "../../shared/Interactor";
import User from "../domain/User";
import UserService from "../domain/UserService";

import UserData from "./UserData";

interface CreateUserData {
    userData: UserData;
}

class CreateUserInteractor implements Interactor {
    private data: CreateUserData;

    private userService: UserService;
    private emailService: EmailService;

    constructor(data: CreateUserData, userService: UserService, emailService: EmailService) {
        this.data = data;
        this.userService = userService;
        this.emailService = emailService;
    }

    public async execute(): Promise<UserData> {
        const newUser = new User({
            id: null,
            firstName: this.data.userData.firstName,
            lastName: this.data.userData.lastName,
            email: this.data.userData.email,
            role: this.data.userData.role,
            password: this.data.userData.password,
            resetPasswordToken: null,
            resetPasswordExpirationDate: null,
            cart: null,
            avatar: null,
            products: null,
            reviews: null,
            shippingsInfo: null,
        });
        const createdUser = await this.userService.create(newUser);

        await this.emailService.sendWelcomeEmail(this.data.userData.email);

        return UserData.fromModel(createdUser);
    }
}

export type { CreateUserData };
export default CreateUserInteractor;
