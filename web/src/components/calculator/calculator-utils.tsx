export const getBMIColor = (bmi: number) => {
    if (bmi < 18.5) return "text-blue-600";
    if (bmi < 25) return "text-green-600";
    if (bmi < 30) return "text-yellow-600";
    return "text-red-600";
};

export const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
        case "very_low":
        case "low":
            return "text-green-600";
        case "medium":
            return "text-yellow-600";
        case "high":
            return "text-orange-600";
        case "very_high":
            return "text-red-600";
        default:
            return "text-primary";
    }
};

export const getRiskBadgeVariant = (riskLevel: string): "default" | "secondary" | "outline" | "destructive" => {
    switch (riskLevel) {
        case "very_low":
        case "low":
            return "default";
        case "medium":
            return "secondary";
        case "high":
            return "outline";
        case "very_high":
            return "destructive";
        default:
            return "outline";
    }
};

