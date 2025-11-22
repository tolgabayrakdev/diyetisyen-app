/**
 * Profesyonel Email Template Sistemi
 * Tüm email template'leri burada merkezi olarak yönetilir
 * Brand bilgileri landing/app/layout.tsx ile senkronize edilmiştir
 */

// Brand bilgileri - landing/app/layout.tsx ile senkronize
export const BRAND_NAME = "DiyetKa";
export const BRAND_URL = "https://diyetka.com";
export const BRAND_TAGLINE = "Diyetisyenler için akıllı danışan yönetimi";
export const BRAND_DESCRIPTION = "Diyetisyenler için özel tasarlanmış profesyonel yönetim platformu. Danışan yönetimi, diyet planları, ilerleme takibi ve finansal yönetim.";

const BRAND_COLOR = "#2563eb"; // Mavi ton
const BRAND_SECONDARY = "#1e40af";
const TEXT_COLOR = "#1f2937";
const TEXT_SECONDARY = "#6b7280";
const BORDER_COLOR = "#e5e7eb";
const BACKGROUND_COLOR = "#f9fafb";

/**
 * Base email template wrapper
 * Tüm email'ler bu template'i kullanır
 */
function getBaseTemplate(content, options = {}) {
    const { title, preheader } = options;
    
    return `
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>${title || BRAND_NAME}</title>
    ${preheader ? `<style type="text/css">.preheader { display: none !important; visibility: hidden; opacity: 0; color: transparent; height: 0; width: 0; }</style>` : ''}
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: ${BACKGROUND_COLOR};">
    ${preheader ? `<div class="preheader" style="display: none !important; visibility: hidden; opacity: 0; color: transparent; height: 0; width: 0;">${preheader}</div>` : ''}
    
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: ${BACKGROUND_COLOR}; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); overflow: hidden;">
                    
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, ${BRAND_COLOR} 0%, ${BRAND_SECONDARY} 100%); padding: 40px 30px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                                ${BRAND_NAME}
                            </h1>
                            <p style="margin: 8px 0 0 0; color: rgba(255,255,255,0.9); font-size: 14px; font-weight: 400;">
                                ${BRAND_TAGLINE}
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            ${content}
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f9fafb; padding: 30px; border-top: 1px solid ${BORDER_COLOR};">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                    <td align="center" style="padding-bottom: 20px;">
                                        <p style="margin: 0; color: ${TEXT_SECONDARY}; font-size: 12px; line-height: 1.6;">
                                            Bu e-posta <strong><a href="${BRAND_URL}" style="color: ${BRAND_COLOR}; text-decoration: none;">${BRAND_URL}</a></strong> tarafından gönderilmiştir.
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="padding-bottom: 15px;">
                                        <p style="margin: 0; color: ${TEXT_SECONDARY}; font-size: 11px; line-height: 1.5;">
                                            Bu e-postayı siz istemediyseniz, lütfen görmezden gelin.
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center">
                                        <p style="margin: 0; color: ${TEXT_SECONDARY}; font-size: 11px;">
                                            © ${new Date().getFullYear()} ${BRAND_NAME}. Tüm hakları saklıdır.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `.trim();
}

/**
 * Email Doğrulama Kodu Template
 */
export function getEmailVerificationTemplate(firstName, code) {
    const content = `
        <div style="text-align: center; margin-bottom: 30px;">
            <h2 style="margin: 0 0 10px 0; color: ${TEXT_COLOR}; font-size: 24px; font-weight: 600;">
                E-posta Doğrulama
            </h2>
            <p style="margin: 0; color: ${TEXT_SECONDARY}; font-size: 14px;">
                Hesabınızı doğrulamak için aşağıdaki kodu kullanın
            </p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
            <p style="margin: 0 0 15px 0; color: ${TEXT_COLOR}; font-size: 16px; line-height: 1.6;">
                Merhaba <strong>${firstName}</strong>,
            </p>
            <p style="margin: 0 0 25px 0; color: ${TEXT_COLOR}; font-size: 15px; line-height: 1.6;">
                E-posta adresinizi doğrulamak için aşağıdaki doğrulama kodunu kullanın:
            </p>
            
            <!-- Code Box -->
            <div style="background: linear-gradient(135deg, ${BRAND_COLOR}15 0%, ${BRAND_SECONDARY}15 100%); border: 2px dashed ${BRAND_COLOR}; border-radius: 12px; padding: 25px; margin: 30px 0; display: inline-block;">
                <div style="font-size: 36px; font-weight: 700; letter-spacing: 8px; color: ${BRAND_COLOR}; font-family: 'Courier New', monospace;">
                    ${code}
                </div>
            </div>
            
            <p style="margin: 25px 0 0 0; color: ${TEXT_SECONDARY}; font-size: 13px; line-height: 1.6;">
                ⏱️ Bu kod <strong>3 dakika</strong> süreyle geçerlidir.
            </p>
        </div>
        
        <div style="margin-top: 40px; padding-top: 30px; border-top: 1px solid ${BORDER_COLOR};">
            <p style="margin: 0; color: ${TEXT_SECONDARY}; font-size: 12px; line-height: 1.6; text-align: center;">
                <strong>Güvenlik Uyarısı:</strong> Bu kodu kimseyle paylaşmayın. ${BRAND_NAME} ekibi asla sizden bu kodu istemez.
            </p>
        </div>
    `;
    
    return getBaseTemplate(content, {
        title: `E-posta Doğrulama Kodu - ${BRAND_NAME}`,
        preheader: `Doğrulama kodunuz: ${code}`
    });
}

/**
 * Şifre Sıfırlama Template
 */
export function getPasswordResetTemplate(resetLink, expiresInMinutes = 15) {
    const content = `
        <div style="text-align: center; margin-bottom: 30px;">
            <h2 style="margin: 0 0 10px 0; color: ${TEXT_COLOR}; font-size: 24px; font-weight: 600;">
                Şifre Sıfırlama Talebi
            </h2>
            <p style="margin: 0; color: ${TEXT_SECONDARY}; font-size: 14px;">
                Hesabınız için şifre sıfırlama talebi aldık
            </p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
            <p style="margin: 0 0 20px 0; color: ${TEXT_COLOR}; font-size: 15px; line-height: 1.6;">
                Merhaba,
            </p>
            <p style="margin: 0 0 30px 0; color: ${TEXT_COLOR}; font-size: 15px; line-height: 1.6;">
                Hesabınız için şifre sıfırlama talebi aldık. Yeni şifrenizi belirlemek için aşağıdaki butona tıklayın:
            </p>
            
            <!-- CTA Button -->
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 30px auto;">
                <tr>
                    <td align="center" style="border-radius: 6px; background: linear-gradient(135deg, ${BRAND_COLOR} 0%, ${BRAND_SECONDARY} 100%);">
                        <a href="${resetLink}" 
                           style="display: inline-block; padding: 14px 32px; font-size: 16px; font-weight: 600; color: #ffffff; text-decoration: none; border-radius: 6px; letter-spacing: 0.5px;">
                            Şifremi Sıfırla
                        </a>
                    </td>
                </tr>
            </table>
            
            <p style="margin: 30px 0 0 0; color: ${TEXT_SECONDARY}; font-size: 13px; line-height: 1.6;">
                ⏱️ Bu link <strong>${expiresInMinutes} dakika</strong> süreyle geçerlidir.
            </p>
            
            <p style="margin: 20px 0 0 0; color: ${TEXT_SECONDARY}; font-size: 12px; line-height: 1.6;">
                Buton çalışmıyorsa, aşağıdaki linki kopyalayıp tarayıcınıza yapıştırabilirsiniz:
            </p>
            <p style="margin: 10px 0 0 0; word-break: break-all; color: ${BRAND_COLOR}; font-size: 11px; font-family: 'Courier New', monospace;">
                ${resetLink}
            </p>
        </div>
        
        <div style="margin-top: 40px; padding-top: 30px; border-top: 1px solid ${BORDER_COLOR};">
            <p style="margin: 0; color: ${TEXT_SECONDARY}; font-size: 12px; line-height: 1.6; text-align: center;">
                <strong>Güvenlik Uyarısı:</strong> Eğer bu talebi siz yapmadıysanız, bu e-postayı görmezden gelin. Şifreniz değişmeyecektir.
            </p>
        </div>
    `;
    
    return getBaseTemplate(content, {
        title: `Şifre Sıfırlama - ${BRAND_NAME}`,
        preheader: "Hesabınız için şifre sıfırlama talebi"
    });
}

/**
 * Hoş Geldiniz / Kayıt Onayı Template
 */
export function getWelcomeTemplate(firstName, lastName) {
    const fullName = `${firstName} ${lastName}`.trim();
    
    const content = `
        <div style="text-align: center; margin-bottom: 30px;">
            <h2 style="margin: 0 0 10px 0; color: ${TEXT_COLOR}; font-size: 24px; font-weight: 600;">
                Hoş Geldiniz! 🎉
            </h2>
            <p style="margin: 0; color: ${TEXT_SECONDARY}; font-size: 14px;">
                ${BRAND_NAME} ailesine katıldığınız için teşekkür ederiz
            </p>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
            <p style="margin: 0 0 20px 0; color: ${TEXT_COLOR}; font-size: 16px; line-height: 1.6;">
                Merhaba <strong>${fullName}</strong>,
            </p>
            <p style="margin: 0 0 20px 0; color: ${TEXT_COLOR}; font-size: 15px; line-height: 1.6;">
                ${BRAND_NAME}'ya kaydolduğunuz için teşekkür ederiz! ${BRAND_DESCRIPTION}
            </p>
            <p style="margin: 0 0 30px 0; color: ${TEXT_COLOR}; font-size: 15px; line-height: 1.6;">
                Hesabınızı aktifleştirmek için e-posta adresinizi doğrulamanız gerekmektedir.
            </p>
        </div>
        
        <div style="background-color: #f0f9ff; border-left: 4px solid ${BRAND_COLOR}; padding: 20px; margin: 30px 0; border-radius: 4px;">
            <p style="margin: 0; color: ${TEXT_COLOR}; font-size: 14px; line-height: 1.6;">
                <strong>💡 İpucu:</strong> Hesabınızı doğruladıktan sonra müşterilerinizi yönetmeye, diyet planları oluşturmaya ve ilerlemelerini takip etmeye başlayabilirsiniz.
            </p>
        </div>
    `;
    
    return getBaseTemplate(content, {
        title: `Hoş Geldiniz - ${BRAND_NAME}`,
        preheader: `${BRAND_NAME}'ya hoş geldiniz!`
    });
}

/**
 * Genel Bilgilendirme Template
 */
export function getInfoTemplate(title, message, buttonText = null, buttonLink = null) {
    const content = `
        <div style="text-align: center; margin-bottom: 30px;">
            <h2 style="margin: 0 0 10px 0; color: ${TEXT_COLOR}; font-size: 24px; font-weight: 600;">
                ${title}
            </h2>
        </div>
        
        <div style="margin: 30px 0;">
            <div style="color: ${TEXT_COLOR}; font-size: 15px; line-height: 1.8;">
                ${message}
            </div>
            
            ${buttonText && buttonLink ? `
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 30px auto;">
                    <tr>
                        <td align="center" style="border-radius: 6px; background: linear-gradient(135deg, ${BRAND_COLOR} 0%, ${BRAND_SECONDARY} 100%);">
                            <a href="${buttonLink}" 
                               style="display: inline-block; padding: 14px 32px; font-size: 16px; font-weight: 600; color: #ffffff; text-decoration: none; border-radius: 6px; letter-spacing: 0.5px;">
                                ${buttonText}
                            </a>
                        </td>
                    </tr>
                </table>
            ` : ''}
        </div>
    `;
    
    return getBaseTemplate(content, {
        title: `${title} - ${BRAND_NAME}`,
        preheader: title
    });
}

