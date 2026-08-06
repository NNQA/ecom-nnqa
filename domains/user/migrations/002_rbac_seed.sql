INSERT INTO permissions (code, name, description) VALUES
  ('category:read', 'Read categories', 'View category data'),
  ('category:create', 'Create categories', 'Create categories'),
  ('category:update', 'Update categories', 'Update categories'),
  ('category:delete', 'Delete categories', 'Delete categories'),
  ('order:read', 'Read orders', 'View orders'),
  ('order:manage', 'Manage orders', 'Create and update orders'),
  ('user:manage', 'Manage users', 'Manage users and their roles')
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;
INSERT INTO roles (code, name) VALUES ('ADMIN', 'Administrator'), ('STAFF', 'Staff'), ('CUSTOMER', 'Customer')
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r CROSS JOIN permissions p WHERE r.code = 'ADMIN'
ON CONFLICT DO NOTHING;
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r JOIN permissions p ON p.code IN ('category:read', 'category:create', 'category:update', 'order:read', 'order:manage') WHERE r.code = 'STAFF'
ON CONFLICT DO NOTHING;
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r JOIN permissions p ON p.code IN ('category:read', 'order:read') WHERE r.code = 'CUSTOMER'
ON CONFLICT DO NOTHING;