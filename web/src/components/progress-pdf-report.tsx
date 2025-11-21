import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProgressLog {
    id: string;
    log_date: string;
    weight_kg: number | null;
    body_fat_percent: number | null;
    muscle_mass_kg: number | null;
    notes: string | null;
    created_at: string;
}

interface Client {
    id: string;
    first_name: string;
    last_name: string;
    height_cm: number | null;
}

interface ProgressPDFReportProps {
    logs: ProgressLog[];
    client: Client;
    stats?: {
        weight?: {
            first: number;
            last: number;
            avg: number;
            change: number;
            changePercent: string;
            trend: "up" | "down" | "neutral";
        } | null;
        bodyFat?: {
            first: number;
            last: number;
            avg: number;
            change: number;
            changePercent: string;
            trend: "up" | "down" | "neutral";
        } | null;
        muscleMass?: {
            first: number;
            last: number;
            avg: number;
            change: number;
            changePercent: string;
            trend: "up" | "down" | "neutral";
        } | null;
    };
}

export function ProgressPDFReport({ 
    logs, 
    client,
    stats 
}: ProgressPDFReportProps) {
    
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

    const calculateBMI = (weight: number | null) => {
        if (!weight || !client.height_cm) return null;
        const heightInMeters = client.height_cm / 100;
        const bmi = weight / (heightInMeters * heightInMeters);
        return bmi.toFixed(1);
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

        const sortedLogs = [...logs].sort(
            (a, b) => new Date(a.log_date).getTime() - new Date(b.log_date).getTime()
        );

        const firstLog = sortedLogs[0];
        const lastLog = sortedLogs[sortedLogs.length - 1];

        return `
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>İlerleme Raporu - ${client.first_name} ${client.last_name}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        @page {
            size: A4;
            margin: 2cm;
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
            line-height: 1.5;
            background: #ffffff;
        }
        
        .container {
            max-width: 100%;
            padding: 20px;
        }
        
        .header {
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 16px;
            margin-bottom: 24px;
        }
        
        .header h1 {
            font-size: 24px;
            font-weight: 600;
            color: #111827;
            margin-bottom: 4px;
        }
        
        .header .subtitle {
            color: #6b7280;
            font-size: 14px;
            margin-bottom: 8px;
        }
        
        .header .date {
            color: #9ca3af;
            font-size: 11px;
            margin-top: 8px;
        }
        
        .client-info {
            background: #f9fafb;
            border-radius: 6px;
            padding: 12px;
            margin-bottom: 24px;
            border-left: 3px solid #3b82f6;
        }
        
        .client-info-title {
            font-size: 12px;
            font-weight: 600;
            color: #374151;
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .client-info-item {
            font-size: 12px;
            color: #6b7280;
            margin-bottom: 4px;
        }
        
        .client-info-item strong {
            color: #374151;
        }
        
        .summary-section {
            margin-bottom: 24px;
        }
        
        .summary-title {
            font-size: 16px;
            font-weight: 600;
            color: #111827;
            margin-bottom: 12px;
            padding-bottom: 6px;
            border-bottom: 1px solid #e5e7eb;
        }
        
        .summary-cards {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 12px;
            margin-bottom: 16px;
        }
        
        .summary-card {
            border: 1px solid #e5e7eb;
            border-radius: 6px;
            padding: 12px;
            background: #ffffff;
        }
        
        .summary-card-label {
            font-size: 11px;
            color: #6b7280;
            margin-bottom: 4px;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .summary-card-value {
            font-size: 18px;
            font-weight: 600;
            color: #111827;
            margin-bottom: 4px;
        }
        
        .summary-card-change {
            font-size: 11px;
            font-weight: 500;
        }
        
        .summary-card-change.positive {
            color: #059669;
        }
        
        .summary-card-change.negative {
            color: #dc2626;
        }
        
        .table-section {
            margin-top: 24px;
        }
        
        .table-title {
            font-size: 16px;
            font-weight: 600;
            color: #111827;
            margin-bottom: 12px;
            padding-bottom: 6px;
            border-bottom: 1px solid #e5e7eb;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 16px;
            font-size: 11px;
        }
        
        thead {
            background: #f9fafb;
            border-bottom: 2px solid #e5e7eb;
        }
        
        th {
            padding: 10px 8px;
            text-align: left;
            font-weight: 600;
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #6b7280;
        }
        
        td {
            padding: 8px;
            border-bottom: 1px solid #f3f4f6;
        }
        
        tbody tr:nth-child(even) {
            background: #fafafa;
        }
        
        .metric-value {
            font-weight: 600;
            color: #111827;
        }
        
        .metric-empty {
            color: #9ca3af;
            font-style: italic;
        }
        
        .footer {
            margin-top: 32px;
            padding-top: 16px;
            border-top: 1px solid #e5e7eb;
            text-align: center;
            color: #9ca3af;
            font-size: 10px;
        }
        
        .comparison-section {
            margin-top: 24px;
            padding: 16px;
            background: #f9fafb;
            border-radius: 6px;
            border-left: 3px solid #10b981;
        }
        
        .comparison-title {
            font-size: 14px;
            font-weight: 600;
            color: #111827;
            margin-bottom: 12px;
        }
        
        .comparison-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 12px;
        }
        
        .comparison-item {
            background: #ffffff;
            padding: 10px;
            border-radius: 4px;
            border: 1px solid #e5e7eb;
        }
        
        .comparison-item-label {
            font-size: 10px;
            color: #6b7280;
            margin-bottom: 4px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .comparison-item-value {
            font-size: 14px;
            font-weight: 600;
            color: #111827;
        }
        
        .comparison-item-change {
            font-size: 10px;
            margin-top: 4px;
            font-weight: 500;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>İlerleme Kayıtları Raporu</h1>
            <div class="subtitle">${client.first_name} ${client.last_name}</div>
            <div class="date">Oluşturulma: ${dateStr}</div>
        </div>
        
        <div class="client-info">
            <div class="client-info-title">Danışan Bilgileri</div>
            <div class="client-info-item"><strong>Ad Soyad:</strong> ${client.first_name} ${client.last_name}</div>
            ${client.height_cm ? `<div class="client-info-item"><strong>Boy:</strong> ${client.height_cm} cm</div>` : ''}
            ${firstLog?.weight_kg ? `<div class="client-info-item"><strong>Başlangıç Kilosu:</strong> ${firstLog.weight_kg} kg</div>` : ''}
            ${lastLog?.weight_kg ? `<div class="client-info-item"><strong>Son Kilo:</strong> ${lastLog.weight_kg} kg</div>` : ''}
            ${firstLog?.weight_kg && client.height_cm ? `<div class="client-info-item"><strong>Başlangıç BMI:</strong> ${calculateBMI(firstLog.weight_kg)}</div>` : ''}
            ${lastLog?.weight_kg && client.height_cm ? `<div class="client-info-item"><strong>Son BMI:</strong> ${calculateBMI(lastLog.weight_kg)}</div>` : ''}
        </div>
        
        ${stats && (stats.weight || stats.bodyFat || stats.muscleMass) ? `
        <div class="summary-section">
            <div class="summary-title">İlerleme Özeti</div>
            <div class="summary-cards">
                ${stats.weight ? `
                <div class="summary-card">
                    <div class="summary-card-label">Kilo</div>
                    <div class="summary-card-value">${stats.weight.last} kg</div>
                    <div class="summary-card-change ${stats.weight.change < 0 ? 'positive' : stats.weight.change > 0 ? 'negative' : ''}">
                        ${stats.weight.change > 0 ? '+' : ''}${stats.weight.change.toFixed(1)} kg (${stats.weight.changePercent}%)
                    </div>
                </div>
                ` : ''}
                ${stats.bodyFat ? `
                <div class="summary-card">
                    <div class="summary-card-label">Vücut Yağı</div>
                    <div class="summary-card-value">%${stats.bodyFat.last}</div>
                    <div class="summary-card-change ${stats.bodyFat.change < 0 ? 'positive' : stats.bodyFat.change > 0 ? 'negative' : ''}">
                        ${stats.bodyFat.change > 0 ? '+' : ''}${stats.bodyFat.change.toFixed(1)}% (${stats.bodyFat.changePercent}%)
                    </div>
                </div>
                ` : ''}
                ${stats.muscleMass ? `
                <div class="summary-card">
                    <div class="summary-card-label">Kas Kütlesi</div>
                    <div class="summary-card-value">${stats.muscleMass.last} kg</div>
                    <div class="summary-card-change ${stats.muscleMass.change > 0 ? 'positive' : stats.muscleMass.change < 0 ? 'negative' : ''}">
                        ${stats.muscleMass.change > 0 ? '+' : ''}${stats.muscleMass.change.toFixed(1)} kg (${stats.muscleMass.changePercent}%)
                    </div>
                </div>
                ` : ''}
            </div>
        </div>
        ` : ''}
        
        <div class="table-section">
            <div class="table-title">İlerleme Kayıtları (${logs.length} kayıt)</div>
            <table>
                <thead>
                    <tr>
                        <th>Tarih</th>
                        <th>Kilo (kg)</th>
                        <th>Vücut Yağı (%)</th>
                        <th>Kas Kütlesi (kg)</th>
                        ${client.height_cm ? '<th>BMI</th>' : ''}
                        <th>Notlar</th>
                    </tr>
                </thead>
                <tbody>
                    ${sortedLogs.map((log, index) => {
                        const previousLog = index > 0 ? sortedLogs[index - 1] : null;
                        return `
                        <tr>
                            <td>${new Date(log.log_date).toLocaleDateString('tr-TR', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                            })}</td>
                            <td class="metric-value">${log.weight_kg ? `${log.weight_kg} kg${previousLog?.weight_kg ? ` <span style="color: ${log.weight_kg > previousLog.weight_kg ? '#dc2626' : '#059669'}; font-size: 9px;">(${log.weight_kg > previousLog.weight_kg ? '+' : ''}${(log.weight_kg - previousLog.weight_kg).toFixed(1)})</span>` : ''}` : '<span class="metric-empty">-</span>'}</td>
                            <td class="metric-value">${log.body_fat_percent ? `%${log.body_fat_percent}${previousLog?.body_fat_percent ? ` <span style="color: ${log.body_fat_percent < previousLog.body_fat_percent ? '#059669' : '#dc2626'}; font-size: 9px;">(${log.body_fat_percent > previousLog.body_fat_percent ? '+' : ''}${(log.body_fat_percent - previousLog.body_fat_percent).toFixed(1)})</span>` : ''}` : '<span class="metric-empty">-</span>'}</td>
                            <td class="metric-value">${log.muscle_mass_kg ? `${log.muscle_mass_kg} kg${previousLog?.muscle_mass_kg ? ` <span style="color: ${log.muscle_mass_kg > previousLog.muscle_mass_kg ? '#059669' : '#dc2626'}; font-size: 9px;">(${log.muscle_mass_kg > previousLog.muscle_mass_kg ? '+' : ''}${(log.muscle_mass_kg - previousLog.muscle_mass_kg).toFixed(1)})</span>` : ''}` : '<span class="metric-empty">-</span>'}</td>
                            ${client.height_cm ? `<td class="metric-value">${log.weight_kg ? calculateBMI(log.weight_kg) : '<span class="metric-empty">-</span>'}</td>` : ''}
                            <td style="max-width: 200px; word-wrap: break-word;">${log.notes || '<span class="metric-empty">-</span>'}</td>
                        </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        </div>
        
        <div class="footer">
            <p>Bu rapor ${dateStr} tarihinde oluşturulmuştur.</p>
            <p>Toplam ${logs.length} ilerleme kaydı gösterilmektedir.</p>
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
            PDF Raporu İndir
        </Button>
    );
}

