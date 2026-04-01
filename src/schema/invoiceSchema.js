const {z} = require('zod');

const createInvoiceSchema = z.object({
    amount : z.number().int().positive("Amount must be a positive number"),
    clientId : z.string().cuid("Invalid client ID format"),
    status :z.preprocess((value) => (value === "" ? undefined : value), z.enum(['DRAFT', 'SENT', 'PAID'],{errorMap: () =>
        ({message: "Status must be one of: DRAFT, SENT, PAID"})}).optional().default('DRAFT'))
});

const updateInvoiceSchema = z.object({
    amount : z.number().int().positive("Amount must be a positive number").optional(),
    clientId : z.string().cuid("Invalid client ID format").optional(),
    status : z.enum(['DRAFT', 'SENT', 'PAID'],{errorMap: () =>
        ({message: "Status must be one of: DRAFT, SENT, PAID"})}).optional()
});

module.exports = {
    createInvoiceSchema,
    updateInvoiceSchema
};