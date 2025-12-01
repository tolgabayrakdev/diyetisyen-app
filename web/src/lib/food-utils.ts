// Renk seçenekleri
export const AVAILABLE_COLORS = [
    { name: "Mavi", value: "text-blue-600", bg: "bg-blue-600" },
    { name: "Yeşil", value: "text-green-600", bg: "bg-green-600" },
    { name: "Kırmızı", value: "text-red-600", bg: "bg-red-600" },
    { name: "Turuncu", value: "text-orange-600", bg: "bg-orange-600" },
    { name: "Mor", value: "text-purple-600", bg: "bg-purple-600" },
    { name: "Pembe", value: "text-pink-600", bg: "bg-pink-600" },
    { name: "Cyan", value: "text-cyan-600", bg: "bg-cyan-600" },
    { name: "Sarı", value: "text-yellow-600", bg: "bg-yellow-600" },
    { name: "İndigo", value: "text-indigo-600", bg: "bg-indigo-600" },
    { name: "Gri", value: "text-gray-600", bg: "bg-gray-600" },
];

// Renk değerini text- formatından bg- formatına çevir
export const getBackgroundColor = (colorValue: string | null): string => {
    if (!colorValue) return "bg-primary";

    // Eğer zaten bg- formatındaysa direkt döndür
    if (colorValue.startsWith("bg-")) {
        return colorValue;
    }

    // text- formatındaysa bg- formatına çevir
    if (colorValue.startsWith("text-")) {
        return colorValue.replace("text-", "bg-");
    }

    // AVAILABLE_COLORS'dan bul
    const color = AVAILABLE_COLORS.find(c => c.value === colorValue);
    return color ? color.bg : "bg-primary";
};

// Renk değerini text- formatına çevir (Badge için)
export const getTextColor = (colorValue: string | null): string => {
    if (!colorValue) return "text-primary";

    // Eğer zaten text- formatındaysa direkt döndür
    if (colorValue.startsWith("text-")) {
        return colorValue;
    }

    // bg- formatındaysa text- formatına çevir
    if (colorValue.startsWith("bg-")) {
        return colorValue.replace("bg-", "text-");
    }

    // AVAILABLE_COLORS'dan bul
    const color = AVAILABLE_COLORS.find(c => c.bg === colorValue || c.value === colorValue);
    return color ? color.value : "text-primary";
};

