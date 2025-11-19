-- Adds template_id reference to diet_plans so that the same template
-- cannot be assigned to the same client multiple times.

ALTER TABLE diet_plans
    ADD COLUMN IF NOT EXISTS template_id UUID REFERENCES diet_templates(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_diet_plans_template_id ON diet_plans(template_id);

