-- RLS Policies for health_companion.threads table
-- These policies enforce user-scoped access (users can only access their own threads)
-- Apply these in Supabase SQL Editor

-- Enable Row Level Security on threads table
ALTER TABLE health_companion.threads ENABLE ROW LEVEL SECURITY;

-- Policy 1: SELECT - Users can only view their own threads
CREATE POLICY "Users can view their own threads"
ON health_companion.threads
FOR SELECT
USING (auth.uid() = user_id);

-- Policy 2: INSERT - Users can only create threads for themselves
CREATE POLICY "Users can create their own threads"
ON health_companion.threads
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy 3: UPDATE - Users can only update their own threads
CREATE POLICY "Users can update their own threads"
ON health_companion.threads
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy 4: DELETE - Users can only delete their own threads
CREATE POLICY "Users can delete their own threads"
ON health_companion.threads
FOR DELETE
USING (auth.uid() = user_id);
