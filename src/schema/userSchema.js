const { z } = require('zod');

const updateRoleSchema = z.object({
  role: z.enum(['VIEWER', 'ANALYST', 'ADMIN'], {
    errorMap: () => ({ message: "Role must be one of: VIEWER, ANALYST, ADMIN" }),
  }),
});

const updateStatusSchema = z.object({
  isActive: z.boolean({ required_error: "isActive must be a boolean" }),
});

module.exports = { updateRoleSchema, updateStatusSchema };