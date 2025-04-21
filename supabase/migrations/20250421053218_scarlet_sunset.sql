/*
  # Create Monkeys table

  1. New Tables
    - `Monkeys`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `power_type` (text, not null)
      - `level` (integer, not null)
      - `created_at` (timestamp)
  2. Security
    - Enable RLS on `Monkeys` table
    - Add policies for authenticated users to perform CRUD operations on their own data
*/

CREATE TABLE IF NOT EXISTS public."Monkeys" (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  power_type text NOT NULL,
  level integer NOT NULL,
  user_id uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public."Monkeys" ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to select their own monkeys
CREATE POLICY "Users can view their own monkeys" 
  ON public."Monkeys"
  FOR SELECT 
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow authenticated users to insert their own monkeys
CREATE POLICY "Users can create their own monkeys" 
  ON public."Monkeys"
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow authenticated users to update their own monkeys
CREATE POLICY "Users can update their own monkeys" 
  ON public."Monkeys"
  FOR UPDATE 
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow authenticated users to delete their own monkeys
CREATE POLICY "Users can delete their own monkeys" 
  ON public."Monkeys"
  FOR DELETE 
  TO authenticated
  USING (auth.uid() = user_id);