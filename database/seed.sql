-- Car Rental Management System - Seed Data
-- Mock data for testing and demonstration

-- Insert Users (passwords are hashed for 'password123')
-- Note: In production, use bcrypt to hash passwords. These are pre-hashed with bcrypt rounds=10
INSERT INTO users (email, password, name, role, phone) VALUES
('admin@carrental.com', '$2b$10$rKvVJZy5ZqJxGxGxGxGxGO5YqJxGxGxGxGxGxGxGxGxGxGxGxGxGx', 'Admin User', 'ADMIN', '+33 1 23 45 67 89'),
('agent@carrental.com', '$2b$10$rKvVJZy5ZqJxGxGxGxGxGO5YqJxGxGxGxGxGxGxGxGxGxGxGxGxGx', 'Agent Smith', 'AGENT', '+33 1 23 45 67 90'),
('client@carrental.com', '$2b$10$rKvVJZy5ZqJxGxGxGxGxGO5YqJxGxGxGxGxGxGxGxGxGxGxGxGxGx', 'John Doe', 'CLIENT', '+33 6 12 34 56 78'),
('marie@example.com', '$2b$10$rKvVJZy5ZqJxGxGxGxGxGO5YqJxGxGxGxGxGxGxGxGxGxGxGxGxGx', 'Marie Dupont', 'CLIENT', '+33 6 98 76 54 32'),
('pierre@example.com', '$2b$10$rKvVJZy5ZqJxGxGxGxGxGO5YqJxGxGxGxGxGxGxGxGxGxGxGxGxGx', 'Pierre Martin', 'CLIENT', '+33 6 11 22 33 44');

-- Insert Cars with GPS coordinates (simulated locations in Paris, France area)
INSERT INTO cars (brand, model, year, price_per_day, status, image_url, latitude, longitude) VALUES
-- Available Cars
('Mercedes-Benz', 'C-Class', 2023, 85.00, 'Available', 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800', 48.8566, 2.3522),
('BMW', 'X5', 2022, 120.00, 'Available', 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800', 48.8606, 2.3376),
('Audi', 'A4', 2023, 75.00, 'Available', 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800', 48.8529, 2.3499),
('Tesla', 'Model 3', 2024, 95.00, 'Available', 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800', 48.8584, 2.2945),
('Volkswagen', 'Golf', 2022, 50.00, 'Available', 'https://images.unsplash.com/photo-1622353219448-46a009f0d44f?w=800', 48.8738, 2.2950),
('Peugeot', '3008', 2023, 65.00, 'Available', 'https://images.unsplash.com/photo-1542362567-b07e54358753?w=800', 48.8499, 2.3654),
('Renault', 'Clio', 2022, 45.00, 'Available', 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800', 48.8434, 2.3488),
('Ford', 'Mustang', 2023, 110.00, 'Available', 'https://images.unsplash.com/photo-1584345604476-8ec5f5d3e0c0?w=800', 48.8656, 2.3212),
('Toyota', 'Camry', 2023, 70.00, 'Available', 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800', 48.8400, 2.3200),
('Honda', 'Civic', 2022, 60.00, 'Available', 'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800', 48.8700, 2.3100),

-- Rented Cars
('Porsche', '911', 2024, 250.00, 'Rented', 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800', 48.8534, 2.3488),
('Range Rover', 'Evoque', 2023, 130.00, 'Rented', 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800', 48.8610, 2.3387),
('Jaguar', 'F-Type', 2023, 180.00, 'Rented', 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800', 48.8450, 2.3600),

-- Maintenance Cars
('Lexus', 'RX', 2022, 100.00, 'Maintenance', 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800', 48.8750, 2.3300),
('Mazda', 'CX-5', 2023, 68.00, 'Maintenance', 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800', 48.8300, 2.3700),

-- More Available Cars
('Nissan', 'Altima', 2023, 62.00, 'Available', 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800', 48.8800, 2.3400),
('Hyundai', 'Tucson', 2022, 58.00, 'Available', 'https://images.unsplash.com/photo-1611859266238-4b98091d9d9b?w=800', 48.8350, 2.3150),
('Kia', 'Sportage', 2023, 64.00, 'Available', 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800', 48.8900, 2.3800),
('Volvo', 'XC60', 2023, 115.00, 'Available', 'https://images.unsplash.com/photo-1617654112368-307921291f42?w=800', 48.8250, 2.3050),
('Mini', 'Cooper', 2022, 55.00, 'Available', 'https://images.unsplash.com/photo-1554744512-d6c603f27c54?w=800', 48.8950, 2.3950);

-- Insert Sample Rentals
INSERT INTO rentals (user_id, car_id, start_date, end_date, total_price, status) VALUES
-- Active Rentals
(3, 11, '2026-01-20', '2026-01-25', 1250.00, 'Active'),
(4, 12, '2026-01-19', '2026-01-24', 650.00, 'Active'),
(5, 13, '2026-01-21', '2026-01-26', 900.00, 'Active'),

-- Completed Rentals
(3, 1, '2026-01-10', '2026-01-15', 425.00, 'Completed'),
(4, 3, '2026-01-05', '2026-01-08', 225.00, 'Completed'),
(5, 5, '2025-12-20', '2025-12-25', 250.00, 'Completed'),
(3, 7, '2025-12-15', '2025-12-18', 135.00, 'Completed'),
(4, 9, '2026-01-12', '2026-01-16', 280.00, 'Completed'),

-- Cancelled Rental
(5, 10, '2026-01-08', '2026-01-10', 120.00, 'Cancelled');

-- Display summary
SELECT 'Database seeded successfully!' as Message;
SELECT COUNT(*) as 'Total Users' FROM users;
SELECT COUNT(*) as 'Total Cars' FROM cars;
SELECT COUNT(*) as 'Total Rentals' FROM rentals;
SELECT status, COUNT(*) as count FROM cars GROUP BY status;
