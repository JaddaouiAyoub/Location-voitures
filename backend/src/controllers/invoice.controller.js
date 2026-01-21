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
            const fs = require('fs');
            const path = require('path');
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

            const fileName = `invoice-${rentalId}.pdf`;
            const filePath = path.join(__dirname, '../../public/invoices', fileName);

            // Set response headers
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);

            // If file exists, stream it
            if (fs.existsSync(filePath)) {
                return fs.createReadStream(filePath).pipe(res);
            }

            // If not, generate it, store it, and stream it
            const pdfDoc = await InvoiceService.generateInvoice(rentalId);
            pdfDoc.pipe(res);

        } catch (error) {
            next(error);
        }
    }
};

module.exports = InvoiceController;
