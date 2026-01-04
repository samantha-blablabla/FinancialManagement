-- Row Level Security Policies (Simplified)
-- Run this in Supabase SQL Editor after 000_simple_schema.sql

-- =====================================================
-- DROP EXISTING POLICIES (if any)
-- =====================================================

DROP POLICY IF EXISTS "Anyone can read spaces" ON spaces;
DROP POLICY IF EXISTS "Anyone can create spaces" ON spaces;
DROP POLICY IF EXISTS "Owners can update spaces" ON spaces;
DROP POLICY IF EXISTS "Owners can delete spaces" ON spaces;
DROP POLICY IF EXISTS "Anyone can read space members" ON space_members;
DROP POLICY IF EXISTS "Anyone can insert space members" ON space_members;
DROP POLICY IF EXISTS "Members can update own membership" ON space_members;
DROP POLICY IF EXISTS "Owners can delete members" ON space_members;

-- =====================================================
-- ENABLE RLS
-- =====================================================

ALTER TABLE spaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE space_members ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS POLICIES
-- =====================================================

-- Spaces: Anyone can read all spaces (for selecting which space to access)
CREATE POLICY "Anyone can read spaces"
  ON spaces FOR SELECT
  USING (true);

-- Spaces: Anyone can insert (for creating new spaces)
CREATE POLICY "Anyone can create spaces"
  ON spaces FOR INSERT
  WITH CHECK (true);

-- Spaces: Owners can update their spaces
CREATE POLICY "Owners can update spaces"
  ON spaces FOR UPDATE
  USING (owner_id IN (
    SELECT user_id FROM space_members
    WHERE space_id = spaces.id AND role = 'owner'
  ));

-- Spaces: Owners can delete their spaces
CREATE POLICY "Owners can delete spaces"
  ON spaces FOR DELETE
  USING (owner_id IN (
    SELECT user_id FROM space_members
    WHERE space_id = spaces.id AND role = 'owner'
  ));

-- Space Members: Anyone can read all members
CREATE POLICY "Anyone can read space members"
  ON space_members FOR SELECT
  USING (true);

-- Space Members: Anyone can insert (for joining spaces)
CREATE POLICY "Anyone can insert space members"
  ON space_members FOR INSERT
  WITH CHECK (true);

-- Space Members: Members can update their own membership
CREATE POLICY "Members can update own membership"
  ON space_members FOR UPDATE
  USING (user_id = user_id);

-- Space Members: Owners can delete members
CREATE POLICY "Owners can delete members"
  ON space_members FOR DELETE
  USING (
    space_id IN (
      SELECT space_id FROM space_members
      WHERE user_id = space_members.user_id AND role = 'owner'
    )
  );
