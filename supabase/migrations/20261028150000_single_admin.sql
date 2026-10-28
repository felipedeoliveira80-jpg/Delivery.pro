-- Applied remotely via migration enforce_single_delivery_admin.
CREATE UNIQUE INDEX IF NOT EXISTS users_single_admin
ON public.users (role) WHERE role='admin';
