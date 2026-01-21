const { errorResponse } = require('../utils/response');
const InvoiceService = require('../services/invoice.service');
const RentalModel = require('../models/rental.model');

/**
 * Invoice Controller
 */
const InvoiceController = {
    /**
     * Generate and download invoice PDF
     * GET /api/invoices/:rentalId
     */
    async downloadInvoice(req, res, next) {
        try {
            const rentalId = req.params.rentalId;

            // Get rental to check ownership
            const rental = await RentalModel.findById(rentalId);

            if (!rental) {
                return errorResponse(res, 'Rental not found', 404);
            }

            // Check if user owns this rental (unless admin)
            if (req.user.role !== 'ADMIN' && rental.user_id !== req.user.id) {
                return errorResponse(res, 'Unauthorized access', 403);
            }

            // Generate PDF
            const pdfDoc = await InvoiceService.generateInvoice(rentalId);

            // Set response headers
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=invoice-${rentalId}.pdf`);

            // Pipe PDF to response
            pdfDoc.pipe(res);

        } catch (error) {
            next(error);
        }
    }
};

module.exports = InvoiceController;
