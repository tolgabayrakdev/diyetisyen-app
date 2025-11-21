import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DietPlan {
    id: string;
    title: string;
    description: string | null;
    content: string | null;
    start_date: string | null;
    end_date: string | null;
    created_at: string;
}

interface Client {
    id: string;
    first_name: string;
    last_name: string;
    phone?: string | null;
    email?: string | null;
    birth_date?: string | null;
    gender?: string | null;
    height_cm?: number | null;
    weight_kg?: number | null;
    chronic_conditions?: string | null;
    allergies?: string | null;
    medications?: string | null;
}

interface Dietitian {
    first_name: string;
    last_name: string;
}

interface DietPlanPDFReportProps {
    plan: DietPlan;
    client: Client;
    dietitian: Dietitian;
}

export function DietPlanPDFReport({ plan, client, dietitian }: DietPlanPDFReportProps) {
    
    const generatePDF = () => {
        // PDF için HTML içeriği oluştur
        const htmlContent = generateHTMLContent();
        
        // Yeni bir pencere aç ve içeriği yazdır
        const printWindow = window.open('', '_blank', 'width=800,height=600');
        if (!printWindow) {
            alert('Popup engelleyici nedeniyle PDF oluşturulamadı. Lütfen popup engelleyiciyi kapatıp tekrar deneyin.');
            return;
        }
        
        printWindow.document.write(htmlContent);
        printWindow.document.close();
        
        // İçerik yüklendikten sonra yazdırma dialogunu aç
        setTimeout(() => {
            printWindow.focus();
            setTimeout(() => {
                printWindow.print();
            }, 500);
        }, 500);
    };

    const generateHTMLContent = () => {
        const now = new Date();
        const dateStr = now.toLocaleDateString('tr-TR', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        // Yaş hesapla
        const calculateAge = (birthDate: string | null | undefined): number | null => {
            if (!birthDate) return null;
            const birth = new Date(birthDate);
            const today = new Date();
            let age = today.getFullYear() - birth.getFullYear();
            const monthDiff = today.getMonth() - birth.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
                age--;
            }
            return age;
        };

        // BMI hesapla
        const calculateBMI = (weight: number | null | undefined, height: number | null | undefined): number | null => {
            if (!weight || !height || height === 0) return null;
            const heightInMeters = height / 100;
            return parseFloat((weight / (heightInMeters * heightInMeters)).toFixed(1));
        };

        // BMI kategorisi
        const getBMICategory = (bmi: number | null): string => {
            if (!bmi) return '-';
            if (bmi < 18.5) return 'Zayıf';
            if (bmi < 25) return 'Normal';
            if (bmi < 30) return 'Fazla Kilolu';
            return 'Obez';
        };

        const age = calculateAge(client.birth_date);
        const bmi = calculateBMI(client.weight_kg, client.height_cm);
        const bmiCategory = getBMICategory(bmi);

        return `
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Diyet Planı - ${plan.title}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        @page {
            size: A4;
            margin: 1cm;
        }
        
        @media print {
            body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
            
            .no-print {
                display: none;
            }
            
            .page-break {
                page-break-before: always;
            }
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            color: #1f2937;
            line-height: 1.6;
            background: #ffffff;
        }
        
        .container {
            max-width: 100%;
            padding: 10px;
        }
        
        .header {
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 12px;
            margin-bottom: 15px;
        }
        
        .header h1 {
            font-size: 24px;
            font-weight: 700;
            color: #111827;
            margin-bottom: 4px;
        }
        
        .header .subtitle {
            color: #6b7280;
            font-size: 12px;
            margin-bottom: 0;
        }
        
        .info-section {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 10px;
            margin-bottom: 15px;
            padding: 10px;
            background: #f9fafb;
            border-radius: 6px;
            font-size: 11px;
        }
        
        .client-details-section {
            margin-bottom: 15px;
            padding: 12px;
            background: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 6px;
        }
        
        .client-details-title {
            font-size: 14px;
            font-weight: 600;
            color: #111827;
            margin-bottom: 8px;
            padding-bottom: 6px;
            border-bottom: 1px solid #e5e7eb;
        }
        
        .client-details-compact {
            display: flex;
            flex-direction: column;
            gap: 6px;
            font-size: 11px;
            line-height: 1.6;
        }
        
        .client-details-compact-item {
            display: flex;
            align-items: baseline;
        }
        
        .client-details-compact-label {
            font-weight: 600;
            color: #6b7280;
            margin-right: 8px;
            min-width: 120px;
        }
        
        .client-details-compact-value {
            color: #111827;
        }
        
        .health-info-section {
            margin-bottom: 15px;
            padding: 12px;
            background: #fef3c7;
            border: 1px solid #fcd34d;
            border-radius: 6px;
        }
        
        .health-info-title {
            font-size: 14px;
            font-weight: 600;
            color: #92400e;
            margin-bottom: 8px;
            padding-bottom: 6px;
            border-bottom: 1px solid #fcd34d;
        }
        
        .health-info-item {
            margin-bottom: 6px;
        }
        
        .health-info-label {
            font-size: 11px;
            font-weight: 600;
            color: #78350f;
            margin-bottom: 3px;
        }
        
        .health-info-value {
            font-size: 11px;
            color: #92400e;
            line-height: 1.5;
        }
        
        .info-item {
            display: flex;
            flex-direction: column;
        }
        
        .info-label {
            font-size: 10px;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 0.3px;
            margin-bottom: 3px;
            font-weight: 600;
        }
        
        .info-value {
            font-size: 11px;
            color: #111827;
            font-weight: 500;
        }
        
        .plan-info {
            margin-bottom: 15px;
            padding: 12px;
            background: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 6px;
        }
        
        .plan-info-title {
            font-size: 14px;
            font-weight: 600;
            color: #111827;
            margin-bottom: 8px;
            padding-bottom: 6px;
            border-bottom: 1px solid #e5e7eb;
        }
        
        .plan-description {
            color: #6b7280;
            font-size: 11px;
            line-height: 1.6;
            margin-bottom: 0;
        }
        
        .content-section {
            margin-top: 15px;
            padding: 15px;
            background: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 6px;
        }
        
        .content-title {
            font-size: 18px;
            font-weight: 600;
            color: #111827;
            margin-bottom: 12px;
            padding-bottom: 8px;
            border-bottom: 2px solid #e5e7eb;
        }
        
        .content-body {
            font-size: 12px;
            line-height: 1.8;
            color: #1f2937;
        }
        
        .content-body h1 {
            font-size: 20px;
            font-weight: 700;
            margin: 16px 0 12px 0;
            color: #111827;
        }
        
        .content-body h2 {
            font-size: 18px;
            font-weight: 600;
            margin: 14px 0 10px 0;
            color: #111827;
        }
        
        .content-body h3 {
            font-size: 16px;
            font-weight: 600;
            margin: 12px 0 8px 0;
            color: #111827;
        }
        
        .content-body p {
            margin: 8px 0;
        }
        
        .content-body ul,
        .content-body ol {
            margin: 8px 0;
            padding-left: 24px;
        }
        
        .content-body li {
            margin: 4px 0;
        }
        
        .content-body strong {
            font-weight: 600;
        }
        
        .content-body em {
            font-style: italic;
        }
        
        .footer {
            margin-top: 20px;
            padding-top: 12px;
            border-top: 1px solid #e5e7eb;
            text-align: center;
            color: #9ca3af;
            font-size: 10px;
        }
        
        .dietitian-signature {
            margin-top: 20px;
            padding-top: 12px;
            border-top: 1px solid #e5e7eb;
            text-align: right;
        }
        
        .dietitian-name {
            font-size: 13px;
            font-weight: 600;
            color: #111827;
            margin-bottom: 3px;
        }
        
        .dietitian-title {
            font-size: 11px;
            color: #6b7280;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>${plan.title}</h1>
            <div class="subtitle">Kişisel Diyet Planı</div>
        </div>
        
        <div class="info-section">
            <div class="info-item">
                <div class="info-label">Diyetisyen</div>
                <div class="info-value">${dietitian.first_name} ${dietitian.last_name}</div>
            </div>
            ${plan.start_date ? `
            <div class="info-item">
                <div class="info-label">Başlangıç Tarihi</div>
                <div class="info-value">${new Date(plan.start_date).toLocaleDateString('tr-TR')}</div>
            </div>
            ` : ''}
            ${plan.end_date ? `
            <div class="info-item">
                <div class="info-label">Bitiş Tarihi</div>
                <div class="info-value">${new Date(plan.end_date).toLocaleDateString('tr-TR')}</div>
            </div>
            ` : ''}
            <div class="info-item">
                <div class="info-label">Oluşturulma</div>
                <div class="info-value">${new Date(plan.created_at).toLocaleDateString('tr-TR')}</div>
            </div>
        </div>
        
        <div class="client-details-section">
            <div class="client-details-title">Danışan Bilgileri</div>
            <div class="client-details-compact">
                <div class="client-details-compact-item">
                    <span class="client-details-compact-label">Ad Soyad:</span>
                    <span class="client-details-compact-value">${client.first_name} ${client.last_name}</span>
                </div>
                ${age !== null ? `
                <div class="client-details-compact-item">
                    <span class="client-details-compact-label">Yaş:</span>
                    <span class="client-details-compact-value">${age} yaş</span>
                </div>
                ` : ''}
                ${client.gender ? `
                <div class="client-details-compact-item">
                    <span class="client-details-compact-label">Cinsiyet:</span>
                    <span class="client-details-compact-value">${client.gender === 'male' ? 'Erkek' : client.gender === 'female' ? 'Kadın' : client.gender}</span>
                </div>
                ` : ''}
                ${client.height_cm ? `
                <div class="client-details-compact-item">
                    <span class="client-details-compact-label">Boy:</span>
                    <span class="client-details-compact-value">${client.height_cm} cm</span>
                </div>
                ` : ''}
                ${client.weight_kg ? `
                <div class="client-details-compact-item">
                    <span class="client-details-compact-label">Kilo:</span>
                    <span class="client-details-compact-value">${client.weight_kg} kg</span>
                </div>
                ` : ''}
                ${bmi !== null ? `
                <div class="client-details-compact-item">
                    <span class="client-details-compact-label">BMI:</span>
                    <span class="client-details-compact-value">${bmi} (${bmiCategory})</span>
                </div>
                ` : ''}
                ${client.email ? `
                <div class="client-details-compact-item">
                    <span class="client-details-compact-label">E-posta:</span>
                    <span class="client-details-compact-value">${client.email}</span>
                </div>
                ` : ''}
                ${client.phone ? `
                <div class="client-details-compact-item">
                    <span class="client-details-compact-label">Telefon:</span>
                    <span class="client-details-compact-value">${client.phone}</span>
                </div>
                ` : ''}
            </div>
        </div>
        
        ${(client.medications || client.allergies || client.chronic_conditions) ? `
        <div class="health-info-section">
            <div class="health-info-title">Sağlık Bilgileri</div>
            ${client.medications ? `
            <div class="health-info-item">
                <div class="health-info-label">Kullanılan İlaçlar:</div>
                <div class="health-info-value">${client.medications}</div>
            </div>
            ` : ''}
            ${client.allergies ? `
            <div class="health-info-item">
                <div class="health-info-label">Alerjiler:</div>
                <div class="health-info-value">${client.allergies}</div>
            </div>
            ` : ''}
            ${client.chronic_conditions ? `
            <div class="health-info-item">
                <div class="health-info-label">Kronik Hastalıklar:</div>
                <div class="health-info-value">${client.chronic_conditions}</div>
            </div>
            ` : ''}
        </div>
        ` : ''}
        
        ${plan.description ? `
        <div class="plan-info">
            <div class="plan-info-title">Plan Açıklaması</div>
            <div class="plan-description">${plan.description}</div>
        </div>
        ` : ''}
        
        ${plan.content ? `
        <div class="content-section">
            <div class="content-title">Diyet Planı İçeriği</div>
            <div class="content-body">${plan.content}</div>
        </div>
        ` : ''}
        
        <div class="dietitian-signature">
            <div class="dietitian-name">${dietitian.first_name} ${dietitian.last_name}</div>
            <div class="dietitian-title">Diyetisyen</div>
        </div>
        
        <div class="footer">
            <p>Bu diyet planı ${dateStr} tarihinde oluşturulmuştur.</p>
            <p style="margin-top: 12px; font-weight: 500; color: #6b7280;">diyetka.com tarafından oluşturulmuştur</p>
        </div>
    </div>
</body>
</html>
        `;
    };

    return (
        <Button
            onClick={generatePDF}
            variant="outline"
            className="gap-2"
        >
            <Download className="h-4 w-4" />
            PDF İndir
        </Button>
    );
}
