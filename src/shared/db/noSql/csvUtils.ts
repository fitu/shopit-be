
// FIXME: remove this
// TODO: There was an error populating the db: ValidationError: _id: Cast to ObjectId failed for value "003cd546-75a7-40c4-8e0c-7763a8b25a74" (type string) at path "_id"

// const convertUUIDToId = (uuid: string): string => uuid.split("-").join("").substring(0, 24);

const convertUUIDToId = (uuid: string): string => uuid;

export { convertUUIDToId };
