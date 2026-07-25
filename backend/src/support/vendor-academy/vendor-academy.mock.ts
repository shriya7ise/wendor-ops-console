import { Course } from './interfaces/vendor-academy.interface';

// PRD 3.2.5 — Vendor Academy
export const MOCK_COURSES: Course[] = [
  { id: 'CRS01', title: 'Getting Started with the Wendor Dashboard', category: 'Onboarding', lessonsTotal: 6, lessonsCompleted: 6, durationMinutes: 32, status: 'Completed' },
  { id: 'CRS02', title: 'Managing Purchase Orders & Vendors', category: 'Stock Management', lessonsTotal: 8, lessonsCompleted: 3, durationMinutes: 48, status: 'In Progress' },
  { id: 'CRS03', title: 'Reading Failure & Machine Analytics', category: 'Analytics', lessonsTotal: 5, lessonsCompleted: 0, durationMinutes: 25, status: 'Not Started' },
  { id: 'CRS04', title: 'Handling Refunds & Cancelled Carts', category: 'Transactions', lessonsTotal: 4, lessonsCompleted: 4, durationMinutes: 20, status: 'Completed' },
  { id: 'CRS05', title: 'Settlements & Wallet Users 101', category: 'Commerce', lessonsTotal: 6, lessonsCompleted: 2, durationMinutes: 30, status: 'In Progress' },
  { id: 'CRS06', title: 'Resolving Service Tickets Efficiently', category: 'Support', lessonsTotal: 5, lessonsCompleted: 0, durationMinutes: 22, status: 'Not Started' },
  { id: 'CRS07', title: 'Invoices, Payments & Credit History', category: 'Billing', lessonsTotal: 4, lessonsCompleted: 0, durationMinutes: 18, status: 'Not Started' },
  { id: 'CRS08', title: 'Using the AI Assistant Effectively', category: 'Analytics', lessonsTotal: 3, lessonsCompleted: 1, durationMinutes: 12, status: 'In Progress' },
];
