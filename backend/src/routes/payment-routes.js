import express from "express";
import PayTRController from "../controller/paytr-controller.js";
import { verifyToken } from "../middleware/verify-token.js";

const router = express.Router();
const paytrController = new PayTRController();

// PayTR token oluşturma (giriş gerekli)
router.post("/paytr-token", verifyToken, paytrController.getToken.bind(paytrController));

// Ödeme başarılı olduğunda subscription'ı manuel oluştur (callback gelmediğinde)
router.post("/verify-payment", verifyToken, paytrController.verifyAndCreateSubscription.bind(paytrController));

// PayTR callback (giriş gerekmez - PayTR'den gelir, rate limit yok)
// Not: PayTR callback'i için CSRF ve rate limit koruması kaldırıldı
router.post("/paytr-callback", 
    express.urlencoded({ extended: true, limit: "50mb" }),
    paytrController.handleCallback.bind(paytrController)
);

export default router;

