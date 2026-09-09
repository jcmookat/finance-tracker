-- Seed existing users with today's hardcoded subcategory options, so their
-- dropdowns aren't empty once the form switches from the old static
-- lib/constants array to this table.
INSERT INTO "TransactionOption" ("id", "userId", "kind", "name", "icon", "updatedAt")
SELECT gen_random_uuid(), "id", 'SUB_CATEGORY', v.name, v.icon, CURRENT_TIMESTAMP
FROM "User"
CROSS JOIN (
    VALUES
        ('Online', 'Router'),
        ('Gas & Electricity', 'Zap'),
        ('Water', 'ShowerHead'),
        ('Drinking Water', 'GlassWater'),
        ('Transportation', 'Bus'),
        ('Mobile', 'Smartphone'),
        ('Internet', 'Wifi'),
        ('Health Insurance', 'HeartPulse'),
        ('Eating Out', 'ForkKnife'),
        ('Travel', 'Train'),
        ('House Rent', 'House'),
        ('Bank Transfer', 'BanknoteArrowUp'),
        ('Bank Transaction Fee', 'BanknoteArrowUp'),
        ('Income Tax', 'Briefcase'),
        ('Residence Tax', 'Briefcase'),
        ('Pension', 'Briefcase'),
        ('Employment Insurance', 'Briefcase'),
        ('Apparel', 'Shirt')
) AS v(name, icon);
