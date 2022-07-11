import { Application } from "express";
import i18next from "i18next";
import { LanguageDetector, handle } from "i18next-http-middleware";

import enBaseTranslations from "../../shared/resources/locales/en/translation.json";
import enAvatarTranslations from "../../modules/avatar/resources/locales/en/translation.json";
import enCartTranslations from "../../modules/cart/resources/locales/en/translation.json";
import enCartItemTranslations from "../../modules/cartItem/resources/locales/en/translation.json";
import enOrderTranslations from "../../modules/order/resources/locales/en/translation.json";
import enOrderItemTranslations from "../../modules/orderItem/resources/locales/en/translation.json";
import enPaymentInfoTranslations from "../../modules/paymentInfo/resources/locales/en/translation.json";
import enPaymentOrderTranslations from "../../modules/paymentOrder/resources/locales/en/translation.json";
import enProductTranslations from "../../modules/product/resources/locales/en/translation.json";
import enReviewTranslations from "../../modules/review/resources/locales/en/translation.json";
import enShippingInfoTranslations from "../../modules/shippingInfo/resources/locales/en/translation.json";
import enUserTranslations from "../../modules/user/resources/locales/en/translation.json";
import esBaseTranslations from "../../shared/resources/locales/es/translation.json";
import esAvatarTranslations from "../../modules/avatar/resources/locales/es/translation.json";
import esCartTranslations from "../../modules/cart/resources/locales/es/translation.json";
import esCartItemTranslations from "../../modules/cartItem/resources/locales/es/translation.json";
import esOrderTranslations from "../../modules/order/resources/locales/es/translation.json";
import esOrderItemTranslations from "../../modules/orderItem/resources/locales/es/translation.json";
import esPaymentInfoTranslations from "../../modules/paymentInfo/resources/locales/es/translation.json";
import esPaymentOrderTranslations from "../../modules/paymentOrder/resources/locales/es/translation.json";
import esProductTranslations from "../../modules/product/resources/locales/es/translation.json";
import esReviewTranslations from "../../modules/review/resources/locales/es/translation.json";
import esShippingInfoTranslations from "../../modules/shippingInfo/resources/locales/es/translation.json";
import esUserTranslations from "../../modules/user/resources/locales/es/translation.json";
import Middleware from "../../shared/middlewares/Middleware";

const DEFAULT_LANGUAGE = "en";
const ACCEPTED_LANGUAGES = [DEFAULT_LANGUAGE, "es"];

class I18nMiddleware implements Middleware {
    public async init(app: Application): Promise<void> {
        i18next.use(LanguageDetector).init({
            resources: {
                en: {
                    translation: [
                        enBaseTranslations,
                        enAvatarTranslations,
                        enCartTranslations,
                        enCartItemTranslations,
                        enOrderTranslations,
                        enOrderItemTranslations,
                        enPaymentInfoTranslations,
                        enPaymentOrderTranslations,
                        enProductTranslations,
                        enReviewTranslations,
                        enShippingInfoTranslations,
                        enUserTranslations,
                    ],
                },
                es: {
                    translation: [
                        esBaseTranslations,
                        esAvatarTranslations,
                        esCartTranslations,
                        esCartItemTranslations,
                        esOrderTranslations,
                        esOrderItemTranslations,
                        esPaymentInfoTranslations,
                        esPaymentOrderTranslations,
                        esProductTranslations,
                        esReviewTranslations,
                        esShippingInfoTranslations,
                        esUserTranslations,
                    ],
                },
            },
            fallbackLng: DEFAULT_LANGUAGE,
            preload: ACCEPTED_LANGUAGES,
        });

        app.use(handle(i18next));
    }
}

export default I18nMiddleware;
