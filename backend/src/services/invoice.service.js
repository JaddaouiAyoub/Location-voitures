const PDFDocument = require('pdfkit');
const RentalModel = require('../models/rental.model');

/**
 * Invoice Service - PDF Generation
 */
const InvoiceService = {
    /**
     * Generate PDF invoice for a rental
     * @param {Number} rentalId - Rental ID
     * @returns {PDFDocument} PDF document stream
     */
    async generateInvoice(rentalId) {
        // Get rental details
        const rental = await RentalModel.findById(rentalId);

        if (!rental) {
            throw new Error('Rental not found');
        }

        // Create PDF document
        const doc = new PDFDocument({ margin: 50 });

        // Company Header
        doc.fontSize(20)
            .font('Helvetica-Bold')
            .text('CAR RENTAL COMPANY', { align: 'center' })
            .fontSize(10)
            .font('Helvetica')
            .text('123 Rental Street, City, Country', { align: 'center' })
            .text('Phone: +1 234 567 890 | Email: contact@carrental.com', { align: 'center' })
            .moveDown(2);

        // Invoice Title
        doc.fontSize(16)
            .font('Helvetica-Bold')
            .text('INVOICE', { align: 'center' })
            .moveDown(1);

        // Invoice Details
        doc.fontSize(10)
            .font('Helvetica')
            .text(`Invoice Number: INV-${rental.id.toString().padStart(6, '0')}`, { align: 'right' })
            .text(`Date: ${new Date(rental.created_at).toLocaleDateString()}`, { align: 'right' })
            .moveDown(2);

        // Customer Information
        doc.fontSize(12)
            .font('Helvetica-Bold')
            .text('CUSTOMER INFORMATION')
            .moveDown(0.5);

        doc.fontSize(10)
            .font('Helvetica')
            .text(`Name: ${rental.user_name}`)
            .text(`Email: ${rental.user_email}`)
            .text(`Phone: ${rental.user_phone || 'N/A'}`)
            .moveDown(2);

        // Rental Details
        doc.fontSize(12)
            .font('Helvetica-Bold')
            .text('RENTAL DETAILS')
            .moveDown(0.5);

        doc.fontSize(10)
            .font('Helvetica')
            .text(`Vehicle: ${rental.brand} ${rental.model} (${rental.year})`)
            .text(`Rental Period: ${new Date(rental.start_date).toLocaleDateString()} - ${new Date(rental.end_date).toLocaleDateString()}`)
            .text(`Status: ${rental.status}`)
            .moveDown(2);

        // Pricing Table
        const tableTop = doc.y;
        const col1 = 50;
        const col2 = 300;
        const col3 = 450;

        // Table Header
        doc.fontSize(10)
            .font('Helvetica-Bold')
            .text('Description', col1, tableTop)
            .text('Days', col2, tableTop)
            .text('Amount', col3, tableTop);

        // Draw line under header
        doc.moveTo(col1, tableTop + 15)
            .lineTo(550, tableTop + 15)
            .stroke();

        // Calculate days
        const days = Math.ceil((new Date(rental.end_date) - new Date(rental.start_date)) / (1000 * 60 * 60 * 24));

        // Table Row
        doc.font('Helvetica')
            .text(`Car Rental (${rental.price_per_day}€/day)`, col1, tableTop + 25)
            .text(days.toString(), col2, tableTop + 25)
            .text(`${rental.total_price.toFixed(2)}€`, col3, tableTop + 25);

        // Subtotal
        const subtotalY = tableTop + 60;
        doc.moveTo(col1, subtotalY)
            .lineTo(550, subtotalY)
            .stroke();

        doc.font('Helvetica-Bold')
            .text('Subtotal:', col2, subtotalY + 10)
            .text(`${rental.total_price.toFixed(2)}€`, col3, subtotalY + 10);

        // VAT (20%)
        const vat = rental.total_price * 0.20;
        doc.font('Helvetica')
            .text('VAT (20%):', col2, subtotalY + 30)
            .text(`${vat.toFixed(2)}€`, col3, subtotalY + 30);

        // Total
        const total = rental.total_price + vat;
        doc.moveTo(col1, subtotalY + 50)
            .lineTo(550, subtotalY + 50)
            .stroke();

        doc.fontSize(12)
            .font('Helvetica-Bold')
            .text('TOTAL:', col2, subtotalY + 60)
            .text(`${total.toFixed(2)}€`, col3, subtotalY + 60);

        // Footer
        doc.fontSize(8)
            .font('Helvetica')
            .text('Thank you for your business!', 50, 700, { align: 'center' })
            .text('For any questions, please contact us at contact@carrental.com', { align: 'center' });

        // Finalize PDF
        doc.end();

        return doc;
    }
};

module.exports = InvoiceService;
