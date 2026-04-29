const db = require('../dataAccess/DatabaseConnector');
const ReportFactory = require('../factories/ReportFactory');

/**
 * Dar de baja un activo.
 * Invoca el Procedimiento Almacenado SP_Registrar_Baja.
 */
const darDeBajaActivo = async (req, res) => {
  const id_usuario = req.user.id; 
  const { id_activo } = req.params;
  const { motivo } = req.body;

  if (!motivo) {
    return res.status(400).json({ message: 'El motivo es obligatorio.' });
  }

  try {
    await db.query(
      `CALL SP_Registrar_Baja($1, $2, $3)`,
      [id_activo, id_usuario, motivo]
    );

    res.status(200).json({
      message: 'Activo dado de baja exitosamente.',
      id_activo
    });

  } catch (error) {
    console.error('Error al dar de baja el activo:', error);
    if (error.code === 'P0001') { 
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

/**
 * Generar Reporte de Activos (Maestro-Detalle) usando Factory Method
 */
const generarReporte = async (req, res) => {
  const { formato } = req.params; // 'pdf', 'excel', 'word'

  try {
    // 1. Obtener datos (Unidades Policiales y sus Activos) - Simulación de Maestro-Detalle
    // En una implementación real, aquí se usaría la función o consulta SQL compleja
    const result = await db.query(`
      SELECT 
        u.id_unidad, u.nombre_unidad,
        a.id_activo, a.cod_patrimonial, a.desc_activo, a.estado_activo
      FROM tbl_unidades_policiales u
      LEFT JOIN tbl_activos a ON u.id_unidad = a.unidad_id
      ORDER BY u.nombre_unidad, a.cod_patrimonial
    `);

    // Organizar en Maestro-Detalle
    const reportData = result.rows.reduce((acc, row) => {
      let unidad = acc.find(u => u.id_unidad === row.id_unidad);
      if (!unidad) {
        unidad = { id_unidad: row.id_unidad, nombre_unidad: row.nombre_unidad, activos: [] };
        acc.push(unidad);
      }
      if (row.id_activo) {
        unidad.activos.push({
          id: row.id_activo,
          codigo: row.cod_patrimonial,
          descripcion: row.desc_activo,
          estado: row.estado_activo
        });
      }
      return acc;
    }, []);

    // 2. Usar el Factory Method para generar el reporte en el formato solicitado
    const generator = ReportFactory.createReportGenerator(formato, reportData);
    const reporte = await generator.generate();

    // 3. Enviar el archivo generado
    res.setHeader('Content-Type', reporte.contentType);
    res.setHeader('Content-Disposition', `attachment; filename=${reporte.fileName}`);
    res.status(200).send(reporte.buffer);

  } catch (error) {
    console.error('Error al generar el reporte (Puede que la BD no esté conectada localmente):', error.message);
    
    // Fallback para demostración: Generar reporte vacío si falla la BD
    const generator = ReportFactory.createReportGenerator(formato, []);
    const reporte = await generator.generate();
    res.setHeader('Content-Type', reporte.contentType);
    res.setHeader('Content-Disposition', `attachment; filename=${reporte.fileName}`);
    res.status(200).send(reporte.buffer);
  }
};

module.exports = {
  darDeBajaActivo,
  generarReporte
};
