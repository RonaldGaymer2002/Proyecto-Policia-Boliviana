-- ==============================================================================
-- SISTEMA DE GESTIÓN DE ACTIVOS DE LA POLICÍA BOLIVIANA
-- ESQUEMA DE BASE DE DATOS REVISADO (PostgreSQL) - Secciones 3.6 y 3.7
-- ==============================================================================

-- Habilitar extensión para UUID si es una versión antigua de Postgres, 
-- aunque gen_random_uuid() es nativo en PG 13+
-- CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 1. TABLAS CATÁLOGO / REFERENCIALES
-- ==============================================================================

CREATE TABLE tbl_roles (
    id_rol UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre_rol VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE tbl_departamentos (
    id_dep UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre_dep VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE tbl_tipos_activos (
    id_tipo UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre_tipo VARCHAR(100) UNIQUE NOT NULL
);

-- ==============================================================================
-- 2. TABLAS PRINCIPALES (SECCIÓN 3.7)
-- ==============================================================================

CREATE TABLE tbl_unidades_policiales (
    id_unidad UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre_unidad VARCHAR(150) NOT NULL,
    ub_geografica VARCHAR(255),
    dep_id UUID REFERENCES tbl_departamentos(id_dep)
);

CREATE TABLE tbl_usuarios_sistema (
    id_usuario UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nom_completo VARCHAR(150) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    pass_hash VARCHAR(255) NOT NULL,
    rol_id UUID REFERENCES tbl_roles(id_rol),
    fecha_ultimo_cambio TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Para validación RNF-01 (90 días)
    activo BOOLEAN DEFAULT TRUE
);

-- ENUM para los estados del activo
CREATE TYPE tipo_estado_activo AS ENUM ('Bueno', 'Malo', 'En Mantenimiento', 'Dado de Baja');

CREATE TABLE tbl_activos (
    id_activo UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cod_patrimonial VARCHAR(50) UNIQUE NOT NULL,
    desc_activo TEXT NOT NULL,
    estado_activo tipo_estado_activo DEFAULT 'Bueno',
    tipo_activo_id UUID REFERENCES tbl_tipos_activos(id_tipo),
    fecha_ingreso DATE DEFAULT CURRENT_DATE,
    unidad_id UUID REFERENCES tbl_unidades_policiales(id_unidad)
);

CREATE TABLE tbl_transaccion_baja (
    id_baja UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_activo UUID NOT NULL REFERENCES tbl_activos(id_activo),
    id_usuario UUID NOT NULL REFERENCES tbl_usuarios_sistema(id_usuario),
    motivo TEXT NOT NULL,
    fecha_baja TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tbl_auditorias_conciliacion (
    id_auditoria UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fecha_auditoria TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_usuario UUID NOT NULL REFERENCES tbl_usuarios_sistema(id_usuario),
    resultado TEXT NOT NULL,
    observaciones TEXT
);

-- ==============================================================================
-- 3. MÓDULO BITÁCORA (AUDITORÍA INMUTABLE) - RF-12
-- ==============================================================================

CREATE TABLE tbl_bitacora_auditoria (
    id_bitacora UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre_tabla VARCHAR(50) NOT NULL,
    operacion VARCHAR(10) NOT NULL CHECK (operacion IN ('INSERT', 'UPDATE', 'DELETE')),
    usuario_db VARCHAR(50) DEFAULT current_user,
    fecha_operacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    datos_anteriores JSONB,
    datos_nuevos JSONB
);

-- Función para el Trigger de Bitácora
CREATE OR REPLACE FUNCTION FN_Registrar_Bitacora()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'DELETE') THEN
        INSERT INTO tbl_bitacora_auditoria(nombre_tabla, operacion, datos_anteriores)
        VALUES (TG_TABLE_NAME, TG_OP, row_to_json(OLD)::jsonb);
        RETURN OLD;
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO tbl_bitacora_auditoria(nombre_tabla, operacion, datos_anteriores, datos_nuevos)
        VALUES (TG_TABLE_NAME, TG_OP, row_to_json(OLD)::jsonb, row_to_json(NEW)::jsonb);
        RETURN NEW;
    ELSIF (TG_OP = 'INSERT') THEN
        INSERT INTO tbl_bitacora_auditoria(nombre_tabla, operacion, datos_nuevos)
        VALUES (TG_TABLE_NAME, TG_OP, row_to_json(NEW)::jsonb);
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Triggers de Bitácora para cada tabla
CREATE TRIGGER TRG_Bitacora_Unidades
AFTER INSERT OR UPDATE OR DELETE ON tbl_unidades_policiales
FOR EACH ROW EXECUTE FUNCTION FN_Registrar_Bitacora();

CREATE TRIGGER TRG_Bitacora_Usuarios
AFTER INSERT OR UPDATE OR DELETE ON tbl_usuarios_sistema
FOR EACH ROW EXECUTE FUNCTION FN_Registrar_Bitacora();

CREATE TRIGGER TRG_Bitacora_Activos
AFTER INSERT OR UPDATE OR DELETE ON tbl_activos
FOR EACH ROW EXECUTE FUNCTION FN_Registrar_Bitacora();

CREATE TRIGGER TRG_Bitacora_Bajas
AFTER INSERT OR UPDATE OR DELETE ON tbl_transaccion_baja
FOR EACH ROW EXECUTE FUNCTION FN_Registrar_Bitacora();

CREATE TRIGGER TRG_Bitacora_Auditorias
AFTER INSERT OR UPDATE OR DELETE ON tbl_auditorias_conciliacion
FOR EACH ROW EXECUTE FUNCTION FN_Registrar_Bitacora();

-- ==============================================================================
-- 4. PROCEDIMIENTOS ALMACENADOS
-- ==============================================================================

-- Procedimiento: SP_Registrar_Baja
CREATE OR REPLACE PROCEDURE SP_Registrar_Baja(
    p_id_activo UUID,
    p_id_usuario UUID,
    p_motivo TEXT
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_estado_actual tipo_estado_activo;
BEGIN
    -- 1. Validar que el activo existe y obtener su estado actual
    SELECT estado_activo INTO v_estado_actual
    FROM tbl_activos
    WHERE id_activo = p_id_activo;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'El activo con ID % no existe.', p_id_activo;
    END IF;

    -- 2. Validar que no esté ya dado de baja
    IF v_estado_actual = 'Dado de Baja' THEN
        RAISE EXCEPTION 'El activo ya se encuentra "Dado de Baja".';
    END IF;

    -- 3. Validar que el usuario existe
    IF NOT EXISTS (SELECT 1 FROM tbl_usuarios_sistema WHERE id_usuario = p_id_usuario) THEN
        RAISE EXCEPTION 'El usuario con ID % no existe.', p_id_usuario;
    END IF;

    -- 4. Registrar la transacción de baja
    INSERT INTO tbl_transaccion_baja (id_activo, id_usuario, motivo)
    VALUES (p_id_activo, p_id_usuario, p_motivo);

    -- 5. Actualizar el estado del activo
    UPDATE tbl_activos
    SET estado_activo = 'Dado de Baja'
    WHERE id_activo = p_id_activo;

    -- La bitácora registrará el INSERT de la transacción y el UPDATE del activo automáticamente.
END;
$$;
