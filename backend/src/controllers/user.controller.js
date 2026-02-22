import * as userRepository from '../repositories/user.repository.js';
import { successResponse, errorResponse } from '../utils/response.util.js';

/**
 * Get user profile
 * GET /api/users/profile
 */
export async function getProfile(req, res, next) {
  try {
    const user = await userRepository.findById(req.user.userId);
    
    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    const { passwordHash, ...userWithoutPassword } = user;
    return successResponse(res, { user: userWithoutPassword }, 'Profile retrieved successfully');
  } catch (error) {
    next(error);
  }
}

/**
 * Get user records (with optional delay for async demo)
 * GET /api/users/records?delay=<ms>
 */
export async function getUserRecords(req, res, next) {
  try {
    const { userId, role } = req.user;

    // Generate dummy records based on role
    const baseRecords = [
      { id: 1, name: 'Financial Report Q1', description: 'Quarterly financial summary', accessLevel: 'Standard', date: '2026-01-15' },
      { id: 2, name: 'Project Proposal', description: 'New project initiative details', accessLevel: 'Standard', date: '2026-01-20' },
      { id: 3, name: 'Team Meeting Notes', description: 'Weekly team sync notes', accessLevel: 'Standard', date: '2026-02-01' },
      { id: 4, name: 'Client Feedback', description: 'Customer satisfaction survey results', accessLevel: 'Standard', date: '2026-02-05' },
      { id: 5, name: 'Marketing Campaign', description: 'Q1 marketing strategy document', accessLevel: 'Standard', date: '2026-02-10' }
    ];

    const adminOnlyRecords = [
      { id: 6, name: 'Salary Information', description: 'Employee compensation data', accessLevel: 'Admin Only', date: '2026-01-10' },
      { id: 7, name: 'Security Audit', description: 'System security assessment report', accessLevel: 'Admin Only', date: '2026-01-25' },
      { id: 8, name: 'Budget Allocation', description: 'Department budget breakdown', accessLevel: 'Admin Only', date: '2026-02-01' },
      { id: 9, name: 'Performance Reviews', description: 'Annual employee evaluations', accessLevel: 'Admin Only', date: '2026-02-08' },
      { id: 10, name: 'Strategic Planning', description: 'Company 5-year strategic plan', accessLevel: 'Admin Only', date: '2026-02-12' },
      { id: 11, name: 'Legal Contracts', description: 'Vendor and partner agreements', accessLevel: 'Admin Only', date: '2026-02-14' },
      { id: 12, name: 'HR Policies', description: 'Updated employee handbook', accessLevel: 'Admin Only', date: '2026-02-15' },
      { id: 13, name: 'Board Meeting Minutes', description: 'Executive board decisions', accessLevel: 'Admin Only', date: '2026-02-16' },
      { id: 14, name: 'System Credentials', description: 'Infrastructure access details', accessLevel: 'Admin Only', date: '2026-02-17' },
      { id: 15, name: 'Acquisition Plans', description: 'Merger and acquisition strategy', accessLevel: 'Admin Only', date: '2026-02-18' },
      { id: 16, name: 'Financial Forecasts', description: 'Revenue projections 2026-2030', accessLevel: 'Admin Only', date: '2026-02-19' },
      { id: 17, name: 'Employee Database', description: 'Complete staff directory', accessLevel: 'Admin Only', date: '2026-02-20' },
      { id: 18, name: 'Risk Assessment', description: 'Enterprise risk management report', accessLevel: 'Admin Only', date: '2026-02-20' },
      { id: 19, name: 'Compliance Report', description: 'Regulatory compliance status', accessLevel: 'Admin Only', date: '2026-02-21' },
      { id: 20, name: 'Executive Dashboard', description: 'Real-time business metrics', accessLevel: 'Admin Only', date: '2026-02-21' }
    ];

    // Return all records for admin, only base records for regular users
    const records = role === 'ADMIN' ? [...baseRecords, ...adminOnlyRecords] : baseRecords;

    return successResponse(res, { records, count: records.length }, 'Records retrieved successfully');
  } catch (error) {
    next(error);
  }
}

/**
 * Get all users (admin only)
 * GET /api/admin/users
 */
export async function getAllUsers(req, res, next) {
  try {
    const users = await userRepository.getAllUsers();
    return successResponse(res, { users, count: users.length }, 'Users retrieved successfully');
  } catch (error) {
    next(error);
  }
}

/**
 * Update user (admin only)
 * PUT /api/admin/users/:userId
 */
export async function updateUser(req, res, next) {
  try {
    const { userId } = req.params;
    const updates = { ...req.body };

    // Don't allow password updates through this method
    delete updates.password;
    delete updates.passwordHash;

    const updatedUser = await userRepository.update(userId, updates);
    
    const { passwordHash, ...userWithoutPassword } = updatedUser;
    return successResponse(res, { user: userWithoutPassword }, 'User updated successfully');
  } catch (error) {
    next(error);
  }
}

/**
 * Delete user (admin only)
 * DELETE /api/admin/users/:userId
 */
export async function deleteUser(req, res, next) {
  try {
    const { userId } = req.params;
    
    // Prevent admin from deleting themselves
    if (userId === req.user.userId) {
      return errorResponse(res, 'Cannot delete your own account', 400);
    }

    await userRepository.deleteUser(userId);
    return successResponse(res, null, 'User deleted successfully');
  } catch (error) {
    next(error);
  }
}
