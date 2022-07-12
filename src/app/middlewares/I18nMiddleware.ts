import { Application } from "express";
import i18next from "i18next";
import { LanguageDetector, handle } from "i18next-http-middleware";

import Middleware from "@shared/middlewares/Middleware";
import enBaseTranslations from "@shared/resources/locales/en/translation.json";
import enAvatarTranslations from "@avatar/resources/locales/en/translation.json";
import enCartTranslations from "@cart/resources/locales/en/translation.json";
import enCartItemTranslations from "@cartItem/resources/locales/en/translation.json";
import enOrderTranslations from "@order/resources/locales/en/translation.json";
import enOrderItemTranslations from "@orderItem/resources/locales/en/translation.json";
import enPaymentInfoTranslations from "@paymentInfo/resources/locales/en/translation.json";
import enPaymentOrderTranslations from "@paymentOrder/resources/locales/en/translation.json";
import enProductTranslations from "@product/resources/locales/en/translation.json";
import enReviewTranslations from "@review/resources/locales/en/translation.json";
import enShippingInfoTranslations from "@shippingInfo/resources/locales/en/translation.json";
import enUserTranslations from "@user/resources/locales/en/translation.json";
import esBaseTranslations from "@shared/resources/locales/es/translation.json";
import esAvatarTranslations from "@avatar/resources/locales/es/translation.json";
import esCartTranslations from "@cart/resources/locales/es/translation.json";
import esCartItemTranslations from "@cartItem/resources/locales/es/translation.json";
import esOrderTranslations from "@order/resources/locales/es/translation.json";
import esOrderItemTranslations from "@orderItem/resources/locales/es/translation.json";
import esPaymentInfoTranslations from "@paymentInfo/resources/locales/es/translation.json";
import esPaymentOrderTranslations from "@paymentOrder/resources/locales/es/translation.json";
import esProductTranslations from "@product/resources/locales/es/translation.json";
import esReviewTranslations from "@review/resources/locales/es/translation.json";
import esShippingInfoTranslations from "@shippingInfo/resources/locales/es/translation.json";
import esUserTranslations from "@user/resources/locales/es/translation.json";

const DEFAULT_LANGUAGE = "en";
const ACCEPTED_LANGUAGES = [DEFAULT_LANGUAGE, "es"];

class I18nMiddleware implements Middleware {
    public async init(app: Application): Promise<void> {
        i18next.use(LanguageDetector).init({
            resources: {
                en: {
                    translation: {
                        ...enBaseTranslations,
                        ...enAvatarTranslations,
                        ...enCartTranslations,
                        ...enCartItemTranslations,
                        ...enOrderTranslations,
                        ...enOrderItemTranslations,
                        ...enPaymentInfoTranslations,
                        ...enPaymentOrderTranslations,
                        ...enProductTranslations,
                        ...enReviewTranslations,
                        ...enShippingInfoTranslations,
                        ...enUserTranslations,
                    },
                },
                es: {
                    translation: {
                        ...esBaseTranslations,
                        ...esAvatarTranslations,
                        ...esCartTranslations,
                        ...esCartItemTranslations,
                        ...esOrderTranslations,
                        ...esOrderItemTranslations,
                        ...esPaymentInfoTranslations,
                        ...esPaymentOrderTranslations,
                        ...esProductTranslations,
                        ...esReviewTranslations,
                        ...esShippingInfoTranslations,
                        ...esUserTranslations,
                    },
                },
            },
            fallbackLng: DEFAULT_LANGUAGE,
            preload: ACCEPTED_LANGUAGES,
        });

        app.use(handle(i18next));
    }
}

export default I18nMiddleware;
