-- Enable RLS on User table
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read their own data
CREATE POLICY "Users can view own data" ON "User"
    FOR SELECT USING (auth.uid() = id);

-- Create policy to allow users to insert their own data
CREATE POLICY "Users can insert own data" ON "User"
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Create policy to allow users to update their own data
CREATE POLICY "Users can update own data" ON "User"
    FOR UPDATE USING (auth.uid() = id);

-- Enable RLS on Entry table
ALTER TABLE "Entry" ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read their own entries
CREATE POLICY "Users can view own entries" ON "Entry"
    FOR SELECT USING (auth.uid() = "userId");

-- Create policy to allow users to insert their own entries
CREATE POLICY "Users can insert own entries" ON "Entry"
    FOR INSERT WITH CHECK (auth.uid() = "userId");

-- Create policy to allow users to update their own entries
CREATE POLICY "Users can update own entries" ON "Entry"
    FOR UPDATE USING (auth.uid() = "userId");

-- Create policy to allow users to delete their own entries
CREATE POLICY "Users can delete own entries" ON "Entry"
    FOR DELETE USING (auth.uid() = "userId");

-- Enable RLS on ChatMessage table
ALTER TABLE "ChatMessage" ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read their own chat messages
CREATE POLICY "Users can view own chat messages" ON "ChatMessage"
    FOR SELECT USING (auth.uid() = "userId");

-- Create policy to allow users to insert their own chat messages
CREATE POLICY "Users can insert own chat messages" ON "ChatMessage"
    FOR INSERT WITH CHECK (auth.uid() = "userId");

-- Create policy to allow users to update their own chat messages
CREATE POLICY "Users can update own chat messages" ON "ChatMessage"
    FOR UPDATE USING (auth.uid() = "userId");

-- Create policy to allow users to delete their own chat messages
CREATE POLICY "Users can delete own chat messages" ON "ChatMessage"
    FOR DELETE USING (auth.uid() = "userId"); 