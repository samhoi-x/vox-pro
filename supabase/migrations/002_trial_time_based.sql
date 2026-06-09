-- Migration: add trial_started_at for time-based 3-day all-access trial
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS trial_started_at TIMESTAMPTZ DEFAULT NULL;

COMMENT ON COLUMN public.profiles.trial_started_at IS 'When the user first accessed the dashboard (starts 3-day trial)';
