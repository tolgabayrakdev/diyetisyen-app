export interface FoodCategory {
    id: string;
    name: string;
    description: string | null;
    icon: string | null;
    color: string | null;
    sort_order: number;
    food_count: number;
}

export interface FoodNutrients {
    energy_kcal?: number | null;
    energy_kj?: number | null;
    protein_g?: number | null;
    carbohydrates_g?: number | null;
    fat_g?: number | null;
    saturated_fat_g?: number | null;
    trans_fat_g?: number | null;
    fiber_g?: number | null;
    sugar_g?: number | null;
    sodium_mg?: number | null;
    salt_g?: number | null;
    potassium_mg?: number | null;
    calcium_mg?: number | null;
    iron_mg?: number | null;
    magnesium_mg?: number | null;
    phosphorus_mg?: number | null;
    zinc_mg?: number | null;
    vitamin_a_mcg?: number | null;
    vitamin_c_mg?: number | null;
    vitamin_d_mcg?: number | null;
    vitamin_e_mg?: number | null;
    vitamin_k_mcg?: number | null;
    thiamin_mg?: number | null;
    riboflavin_mg?: number | null;
    niacin_mg?: number | null;
    vitamin_b6_mg?: number | null;
    folate_mcg?: number | null;
    vitamin_b12_mcg?: number | null;
    biotin_mcg?: number | null;
    pantothenic_acid_mg?: number | null;
    cholesterol_mg?: number | null;
    caffeine_mg?: number | null;
}

export interface Food {
    id: string;
    category_id: string | null;
    name: string;
    description: string | null;
    unit: string;
    image_url: string | null;
    is_active: boolean;
    category_name?: string | null;
    category_icon?: string | null;
    category_color?: string | null;
    nutrients?: FoodNutrients | null;
}

export interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

