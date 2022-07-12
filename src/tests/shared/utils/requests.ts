import { SuperTest, Test } from "supertest";

import { BASE_VERSION } from "@app/app";

const FAKE_JWT_SECRET = "computadorar";
const FAKE_JWT_USER_ID = "a19a4a35-c507-4755-a20b-08737ea0e94d";
const FAKE_JWT_USER_EMAIL = "foo@bar.com";
const FAKE_JWT_TOKEN =
    "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhMTlhNGEzNS1jNTA3LTQ3NTUtYTIwYi0wODczN2VhMGU5NGQiLCJlbWFpbCI6ImZvb0BiYXIuY29tIn0.g5NGl_iTSQ3mBKyWizBT9_WDPzUioiuOvSagjKCBx0c";

class TestRequest {
    private api: SuperTest<Test>;

    constructor(api: SuperTest<Test>) {
        // Set the JWT secret to be able to parse the token
        process.env.JWT = FAKE_JWT_SECRET;
        this.api = api;
    }

    private call(method: string) {
        return (path: string) => this.api[method](`${BASE_VERSION}${path}`).set({ Authorization: FAKE_JWT_TOKEN });
    }

    public get = this.call("get");

    public post = this.call("post");

    public put = this.call("put");

    public delete = this.call("delete");
}

export { FAKE_JWT_USER_ID, FAKE_JWT_USER_EMAIL };
export default TestRequest;
