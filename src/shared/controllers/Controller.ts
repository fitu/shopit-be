import { Router } from "express";

abstract class Controller {
    path: string;
    router: Router = Router();

    protected abstract initializeRoutes: () => void;
}

export default Controller;
