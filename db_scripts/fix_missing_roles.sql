-- =============================================
-- Fix Missing Student Roles
-- =============================================
-- This script adds 'student' role to users who have enrollments but no role assigned
-- Run this if you have users created before the role assignment was added to signup

-- Add 'student' role to users who have enrollments but no role in profile_roles
INSERT INTO public.profile_roles (profile_id, role)
SELECT DISTINCT e.student_id, 'student'::role_type
FROM public.enrollments e
WHERE NOT EXISTS (
  SELECT 1 FROM public.profile_roles pr
  WHERE pr.profile_id = e.student_id
)
ON CONFLICT (profile_id, role) DO NOTHING;

-- Verify the fix
SELECT 
  p.id,
  p.email,
  p.name,
  pr.role,
  COUNT(e.class_id) as enrollment_count
FROM public.profiles p
LEFT JOIN public.profile_roles pr ON p.id = pr.profile_id
LEFT JOIN public.enrollments e ON p.id = e.student_id
GROUP BY p.id, p.email, p.name, pr.role
ORDER BY p.email;

