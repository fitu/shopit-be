import Avatar from "@avatar/domain/Avatar";
import AvatarDao from "@avatar/infrastructure/sql/AvatarDao";

const fromAvatarDaoToModel = (avatarDao: AvatarDao): Avatar => {
    const avatar = new Avatar({
        id: avatarDao.id,
        publicId: avatarDao.publicId,
        url: avatarDao.url,
    });

    return avatar;
};

export { fromAvatarDaoToModel };
