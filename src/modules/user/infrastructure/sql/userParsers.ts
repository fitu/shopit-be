import User from "@user/domain/User";
import UserDao from "@user/infrastructure/sql/UserDao";

const fromUserDaoToModel = (userDao: UserDao): User => {
    const user = new User({
        id: userDao.id,
        firstName: userDao.firstName,
        lastName: userDao.lastName,
        email: userDao.email,
        role: userDao.role,
        password: userDao.password,
        resetPasswordToken: userDao.resetPasswordToken,
        resetPasswordExpirationDate: userDao.resetPasswordExpirationDate,
        cart: userDao.cart?.toModel(),
        avatar: userDao.avatar?.toModel(),
        products: userDao.products?.map((product) => product.toModel()),
        reviews: userDao.reviews?.map((review) => review.toModel()),
        shippingsInfo: userDao.shippingsInfo?.map((shippingsInfo) => shippingsInfo.toModel()),
    });

    return user;
};

export { fromUserDaoToModel };
