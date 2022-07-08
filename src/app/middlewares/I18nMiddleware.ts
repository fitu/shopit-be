import { Application } from "express";
import i18next from "i18next";
import { LanguageDetector, handle } from "i18next-http-middleware";

import enTranslations from "../../locales/en/translation.json";
import esTranslations from "../../locales/es/translation.json";
import Middleware from "../../shared/Middleware";

class I18nMiddleware implements Middleware {
    public async init(app: Application): Promise<void> {
        const DEFAULT_LANGUAGE = "en";

        i18next.use(LanguageDetector).init({
            resources: {
                en: {
                    translation: enTranslations,
                },
                es: {
                    translation: esTranslations,
                },
            },
            fallbackLng: DEFAULT_LANGUAGE,
            preload: [DEFAULT_LANGUAGE, "es"],
        });

        app.use(handle(i18next));
    }
}

export default I18nMiddleware;
