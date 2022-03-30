class Avatar {
    readonly id?: string;
    readonly publicId: string;
    readonly url: string;

    constructor({ id, publicId, url }: { id?: string; publicId: string; url: string }) {
        this.id = id;
        this.publicId = publicId;
        this.url = url;
    }
}

export default Avatar;
