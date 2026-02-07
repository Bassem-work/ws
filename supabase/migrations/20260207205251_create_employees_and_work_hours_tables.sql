/*
  # Create Time Tracking System Schema

  1. New Tables
    - `employees`
      - `id` (uuid, primary key) - Unique identifier
      - `matricule` (text, unique) - Employee ID number
      - `password` (text) - Hashed password
      - `nom` (text) - Last name
      - `prenom` (text) - First name
      - `created_at` (timestamptz) - Creation timestamp
    
    - `work_hours`
      - `id` (uuid, primary key) - Unique identifier
      - `employee_id` (uuid, foreign key) - Reference to employee
      - `date` (date) - Work date
      - `hours` (numeric) - Number of hours worked
      - `created_at` (timestamptz) - Creation timestamp

  2. Security
    - Enable RLS on both tables
    - Employees can only view and modify their own data
    - Employees can create new work hour entries for themselves
*/

-- Create employees table
CREATE TABLE IF NOT EXISTS employees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  matricule text UNIQUE NOT NULL,
  password text NOT NULL,
  nom text NOT NULL,
  prenom text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create work_hours table
CREATE TABLE IF NOT EXISTS work_hours (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  date date NOT NULL,
  hours numeric NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(employee_id, date)
);

-- Enable RLS
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_hours ENABLE ROW LEVEL SECURITY;

-- RLS Policies for employees table
CREATE POLICY "Employees can view own profile"
  ON employees FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Employees can update own profile"
  ON employees FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

CREATE POLICY "Allow employee registration"
  ON employees FOR INSERT
  TO anon
  WITH CHECK (true);

-- RLS Policies for work_hours table
CREATE POLICY "Employees can view own work hours"
  ON work_hours FOR SELECT
  TO authenticated
  USING (employee_id = auth.uid());

CREATE POLICY "Employees can insert own work hours"
  ON work_hours FOR INSERT
  TO authenticated
  WITH CHECK (employee_id = auth.uid());

CREATE POLICY "Employees can update own work hours"
  ON work_hours FOR UPDATE
  TO authenticated
  USING (employee_id = auth.uid())
  WITH CHECK (employee_id = auth.uid());

CREATE POLICY "Employees can delete own work hours"
  ON work_hours FOR DELETE
  TO authenticated
  USING (employee_id = auth.uid());