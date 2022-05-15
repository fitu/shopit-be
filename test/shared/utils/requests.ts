import { SuperTest, Test } from "supertest";
import { BASE_VERSION } from "../../../src/app";

class TestRequest {
    private api: SuperTest<Test>;

    constructor(api: SuperTest<Test>) {
        // Set the JWT secret
        process.env.JWT = 'computadorar';

        this.api = api;
    }

    private call(method: string) {
        return (path: string) => this.api[method](`${BASE_VERSION}${path}`)
            .set({ Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJmb28iLCJlbWFpbCI6ImZvb0BiYXIuY29tIn0.tW25xY9DtLTNXV5dq6dQEo9j2WIM26n9mrKxZ2qSSPM' });
    }

    public get = this.call('get');

    public post = this.call('post');


    public put = this.call('put');

    public delete = this.call('delete');
}

export default TestRequest;
