import EmailService from "../../shared/integrations/emails/EmailService";
import User from "../domain/User";
import UserService from "../domain/UserService";

import UserData from "./UserData";

interface CreateUserData {
    userData: UserData;
}

class CreateUserInteractor {
    private userService: UserService;
    private emailService: EmailService;

    constructor(userService: UserService, emailService: EmailService) {
        this.userService = userService;
        this.emailService = emailService;
    }

    public async execute(data: CreateUserData): Promise<UserData> {
        const newUser = new User({
            firstName: data.userData.firstName,
            lastName: data.userData.lastName,
            email: data.userData.email,
            role: data.userData.role,
            password: data.userData.password,
        });
        const createdUser = await this.userService.create(newUser);

        this.emailService.sendWelcomeEmail(data.userData.email);

        return UserData.fromModel(createdUser);
    }
}

export type { CreateUserData };
export default CreateUserInteractor;
