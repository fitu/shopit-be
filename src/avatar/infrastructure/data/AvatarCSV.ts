import Avatar from "../../domain/Avatar";

class AvatarCSV {
    constructor(public id: number, public publicId: string | null, public url: string | null) {}

    static toModel(avatarCSV: AvatarCSV): Avatar {
        return {
            id: avatarCSV.id,
            publicId: avatarCSV.publicId,
            url: avatarCSV.url,
        };
    }
}

export default AvatarCSV;
