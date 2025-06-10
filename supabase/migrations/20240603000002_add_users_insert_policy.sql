-- Enable RLS on users table if not already enabled
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Enable insert for new user registration" ON public.users;

-- Create policy to allow inserts during registration
CREATE POLICY "Enable insert for new user registration"
    ON public.users
    FOR INSERT
    WITH CHECK (
        -- Allow if the id matches the authenticated user's id
        auth.uid() = id
        OR
        -- OR if this is a new registration (id is not null)
        id IS NOT NULL
    );

-- Create policy to allow users to view their own data
CREATE POLICY "Users can view own data"
    ON public.users
    FOR SELECT
    USING (auth.uid() = id);

-- Create policy to allow users to update their own data
CREATE POLICY "Users can update own data"
    ON public.users
    FOR UPDATE
    USING (auth.uid() = id); 