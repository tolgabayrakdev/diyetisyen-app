import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FinancialRecord {
    id: string;
    client_id: string;
    first_name: string;
    last_name: string;
    amount: number;
    currency: string;
    payment_date: string | null;
    status: string;
    payment_method: string | null;
    description: string | null;
    created_at: string;
}

interface FinancialPDFReportProps {
    records: FinancialRecord[];
    totalAmount: number;
    paidAmount: number;
    pendingAmount: number;
    overdueAmount: number;
    filters?: {
        searchTerm?: string;
        statusFilter?: string;
        clientFilter?: string;
        clientName?: string;
        timeFilter?: string;
    };
}

export function FinancialPDFReport({ 
    records, 
    totalAmount, 
    paidAmount, 
    pendingAmount, 
    overdueAmount,
    filters 
}: FinancialPDFReportProps) {
    
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

        const statusLabels: Record<string, string> = {
            paid: 'Ödendi',
            pending: 'Beklemede',
            overdue: 'Gecikmiş'
        };

        return `
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Finansal Rapor - ${dateStr}</title>
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
            border-bottom: 1px solid #e5e7eb;
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
            font-size: 13px;
        }
        
        .header .date {
            color: #9ca3af;
            font-size: 11px;
            margin-top: 8px;
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
            grid-template-columns: repeat(4, 1fr);
            gap: 12px;
            margin-bottom: 16px;
        }
        
        .summary-card {
            border: 1px solid #e5e7eb;
            border-radius: 6px;
            padding: 12px;
            background: #ffffff;
        }
        
        .summary-card.total {
            border-color: #d1d5db;
        }
        
        .summary-card.paid {
            border-color: #d1d5db;
        }
        
        .summary-card.pending {
            border-color: #d1d5db;
        }
        
        .summary-card.overdue {
            border-color: #d1d5db;
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
            font-size: 20px;
            font-weight: 600;
            color: #111827;
        }
        
        .summary-card.total .summary-card-value {
            color: #111827;
        }
        
        .summary-card.paid .summary-card-value {
            color: #059669;
        }
        
        .summary-card.pending .summary-card-value {
            color: #d97706;
        }
        
        .summary-card.overdue .summary-card-value {
            color: #dc2626;
        }
        
        .filters-section {
            margin-bottom: 20px;
            padding: 12px;
            background: #f9fafb;
            border-radius: 6px;
            border-left: 2px solid #d1d5db;
        }
        
        .filters-title {
            font-size: 12px;
            font-weight: 600;
            color: #374151;
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .filter-item {
            font-size: 11px;
            color: #6b7280;
            margin-bottom: 4px;
        }
        
        .filter-item strong {
            color: #374151;
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
        
        .status-badge {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 10px;
            font-weight: 500;
        }
        
        .status-paid {
            background: #f0fdf4;
            color: #059669;
        }
        
        .status-pending {
            background: #fffbeb;
            color: #d97706;
        }
        
        .status-overdue {
            background: #fef2f2;
            color: #dc2626;
        }
        
        .amount {
            font-weight: 600;
            color: #111827;
        }
        
        .footer {
            margin-top: 32px;
            padding-top: 16px;
            border-top: 1px solid #e5e7eb;
            text-align: center;
            color: #9ca3af;
            font-size: 10px;
        }
        
        .total-row {
            background: #f9fafb !important;
            font-weight: 600;
        }
        
        .total-row td {
            padding: 12px 8px;
            border-top: 1px solid #d1d5db;
            border-bottom: 1px solid #d1d5db;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Finansal Kayıtlar Raporu</h1>
            <div class="subtitle">${filters && filters.timeFilter !== 'all' ? 
                (filters.timeFilter === 'weekly' ? 'Son 7 Gün' :
                 filters.timeFilter === 'monthly' ? 'Son 1 Ay' :
                 filters.timeFilter === 'yearly' ? 'Son 1 Yıl' : '') + ' - ' : ''}Finansal Kayıtlar</div>
            <div class="date">Oluşturulma: ${dateStr}</div>
        </div>
        
        <div class="summary-section">
            <div class="summary-title">Özet Bilgiler</div>
            <div class="summary-cards">
                <div class="summary-card total">
                    <div class="summary-card-label">Toplam</div>
                    <div class="summary-card-value">${totalAmount.toFixed(2)} ₺</div>
                </div>
                <div class="summary-card paid">
                    <div class="summary-card-label">Ödenen</div>
                    <div class="summary-card-value">${paidAmount.toFixed(2)} ₺</div>
                </div>
                <div class="summary-card pending">
                    <div class="summary-card-label">Bekleyen</div>
                    <div class="summary-card-value">${pendingAmount.toFixed(2)} ₺</div>
                </div>
                <div class="summary-card overdue">
                    <div class="summary-card-label">Gecikmiş</div>
                    <div class="summary-card-value">${overdueAmount.toFixed(2)} ₺</div>
                </div>
            </div>
        </div>
        
        ${filters && (filters.searchTerm || filters.statusFilter !== 'all' || filters.clientFilter !== 'all' || filters.timeFilter !== 'all') ? `
        <div class="filters-section">
            <div class="filters-title">Uygulanan Filtreler</div>
            ${filters.searchTerm ? `<div class="filter-item"><strong>Arama:</strong> ${filters.searchTerm}</div>` : ''}
            ${filters.statusFilter && filters.statusFilter !== 'all' ? `<div class="filter-item"><strong>Durum:</strong> ${statusLabels[filters.statusFilter] || filters.statusFilter}</div>` : ''}
            ${filters.clientFilter !== 'all' && filters.clientName ? `<div class="filter-item"><strong>Danışan:</strong> ${filters.clientName}</div>` : ''}
            ${filters.timeFilter !== 'all' ? `<div class="filter-item"><strong>Zaman Aralığı:</strong> ${
                filters.timeFilter === 'weekly' ? 'Son 7 Gün' :
                filters.timeFilter === 'monthly' ? 'Son 1 Ay' :
                filters.timeFilter === 'yearly' ? 'Son 1 Yıl' : filters.timeFilter
            }</div>` : ''}
        </div>
        ` : ''}
        
        <div class="table-section">
            <div class="table-title">Finansal Kayıtlar (${records.length} kayıt)</div>
            <table>
                <thead>
                    <tr>
                        <th>Danışan</th>
                        <th>Tutar</th>
                        <th>Durum</th>
                        <th>Ödeme Tarihi</th>
                        <th>Ödeme Yöntemi</th>
                        <th>Açıklama</th>
                        <th>Oluşturulma</th>
                    </tr>
                </thead>
                <tbody>
                    ${records.map(record => `
                        <tr>
                            <td>${record.first_name} ${record.last_name}</td>
                            <td class="amount">${Number(record.amount).toFixed(2)} ${record.currency}</td>
                            <td>
                                <span class="status-badge status-${record.status}">
                                    ${statusLabels[record.status] || record.status}
                                </span>
                            </td>
                            <td>${record.payment_date ? new Date(record.payment_date).toLocaleDateString('tr-TR') : '-'}</td>
                            <td>${record.payment_method || '-'}</td>
                            <td>${record.description || '-'}</td>
                            <td>${new Date(record.created_at).toLocaleDateString('tr-TR')}</td>
                        </tr>
                    `).join('')}
                    <tr class="total-row">
                        <td colspan="1"><strong>TOPLAM</strong></td>
                        <td><strong>${totalAmount.toFixed(2)} ₺</strong></td>
                        <td colspan="5"></td>
                    </tr>
                </tbody>
            </table>
        </div>
        
        <div class="footer">
            <p>Bu rapor ${dateStr} tarihinde oluşturulmuştur.</p>
            <p>Toplam ${records.length} kayıt gösterilmektedir.</p>
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

