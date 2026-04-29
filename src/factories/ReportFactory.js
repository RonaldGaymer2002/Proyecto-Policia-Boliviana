const PDFDocument = require('pdfkit');

/**
 * Base class para Generadores de Reportes
 */
class ReportGenerator {
  constructor(data) {
    this.data = data; // Datos Maestro-Detalle (Unidades y Activos)
  }

  async generate() {
    throw new Error('El método generate() debe ser implementado por la subclase');
  }
}

/**
 * Generador de PDF usando pdfkit
 */
class PdfReportGenerator extends ReportGenerator {
  async generate() {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument();
        const buffers = [];
        
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
          const pdfData = Buffer.concat(buffers);
          resolve({
            format: 'PDF',
            contentType: 'application/pdf',
            buffer: pdfData,
            fileName: `Reporte_Activos_${Date.now()}.pdf`
          });
        });

        // Escribir contenido en el PDF
        doc.fontSize(20).text('SISTEMA DE GESTIÓN DE ACTIVOS', { align: 'center' });
        doc.fontSize(14).text('Policía Boliviana - Reporte Maestro-Detalle', { align: 'center' });
        doc.moveDown(2);

        if (this.data && this.data.length > 0) {
          this.data.forEach(unidad => {
            doc.fontSize(14).fillColor('blue').text(`Unidad: ${unidad.nombre_unidad || 'Desconocida'}`);
            doc.fillColor('black');
            if (unidad.activos && unidad.activos.length > 0) {
              unidad.activos.forEach(activo => {
                doc.fontSize(10).text(`  - [${activo.codigo}] ${activo.descripcion} (${activo.estado})`);
              });
            } else {
              doc.fontSize(10).text(`  - No hay activos registrados.`);
            }
            doc.moveDown();
          });
        } else {
          doc.fontSize(12).text('No hay datos de activos disponibles para el reporte.');
        }

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }
}

/**
 * Generador de Excel
 */
class ExcelReportGenerator extends ReportGenerator {
  async generate() {
    console.log('Generando reporte Excel con los datos:', this.data);
    return {
      format: 'EXCEL',
      contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      buffer: Buffer.from('Excel Content Data (Requiere exceljs para archivo real)'),
      fileName: `Reporte_Activos_${Date.now()}.xlsx`
    };
  }
}

/**
 * Generador de Word
 */
class WordReportGenerator extends ReportGenerator {
  async generate() {
    console.log('Generando reporte Word con los datos:', this.data);
    return {
      format: 'WORD',
      contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      buffer: Buffer.from('Word Content Data (Requiere docx para archivo real)'),
      fileName: `Reporte_Activos_${Date.now()}.docx`
    };
  }
}

/**
 * Patrón Factory Method (Sección 3.6.1)
 * Instancia dinámicamente el generador adecuado según el formato solicitado.
 */
class ReportFactory {
  static createReportGenerator(format, data) {
    switch (format.toUpperCase()) {
      case 'PDF':
        return new PdfReportGenerator(data);
      case 'EXCEL':
        return new ExcelReportGenerator(data);
      case 'WORD':
        return new WordReportGenerator(data);
      default:
        throw new Error(`Formato de reporte no soportado: ${format}`);
    }
  }
}

module.exports = ReportFactory;
