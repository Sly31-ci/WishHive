-- Backfill missing slugs for existing wishlists
DO $$
DECLARE
    r RECORD;
    new_slug TEXT;
BEGIN
    FOR r IN SELECT id, title FROM wishlists WHERE slug IS NULL OR slug = '' LOOP
        -- 1. Simple slug generation: lower case, replace non-alphanumeric with dash
        -- Note: unaccent() would be better but requires extension. This is a basic fallback.
        new_slug := lower(regexp_replace(r.title, '[^a-zA-Z0-9]+', '-', 'g'));
        
        -- 2. Remove leading/trailing dashes
        new_slug := trim(both '-' from new_slug);
        
        -- 3. Handle empty slug if title was only special chars
        IF new_slug = '' THEN
            new_slug := 'wishlist';
        END IF;

        -- 4. Append random 4-char suffix (using md5 of random)
        new_slug := new_slug || '-' || substr(md5(random()::text), 1, 4);
        
        -- 5. Update the record
        UPDATE wishlists SET slug = new_slug WHERE id = r.id;
    END LOOP;
END $$;
