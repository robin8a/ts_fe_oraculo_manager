/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import { APITypes } from "../API";
type GeneratedSubscription<InputType, OutputType> = string & {
  __generatedSubscriptionInput: InputType;
  __generatedSubscriptionOutput: OutputType;
};

export const onCreateModelAI = /* GraphQL */ `subscription OnCreateModelAI($filter: ModelSubscriptionModelAIFilterInput) {
  onCreateModelAI(filter: $filter) {
    id
    name
    description
    document_link
    api_link
    version
    is_approved
    tokens_cost
    cost_tokens
    calculations {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateModelAISubscriptionVariables,
  APITypes.OnCreateModelAISubscription
>;
export const onUpdateModelAI = /* GraphQL */ `subscription OnUpdateModelAI($filter: ModelSubscriptionModelAIFilterInput) {
  onUpdateModelAI(filter: $filter) {
    id
    name
    description
    document_link
    api_link
    version
    is_approved
    tokens_cost
    cost_tokens
    calculations {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateModelAISubscriptionVariables,
  APITypes.OnUpdateModelAISubscription
>;
export const onDeleteModelAI = /* GraphQL */ `subscription OnDeleteModelAI($filter: ModelSubscriptionModelAIFilterInput) {
  onDeleteModelAI(filter: $filter) {
    id
    name
    description
    document_link
    api_link
    version
    is_approved
    tokens_cost
    cost_tokens
    calculations {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteModelAISubscriptionVariables,
  APITypes.OnDeleteModelAISubscription
>;
export const onCreateCalculation = /* GraphQL */ `subscription OnCreateCalculation(
  $filter: ModelSubscriptionCalculationFilterInput
) {
  onCreateCalculation(filter: $filter) {
    id
    polygon
    start_date
    end_date
    satellite_TIF
    result_TIF
    result_PNG
    is_to_block_chain
    modelAI {
      id
      name
      description
      document_link
      api_link
      version
      is_approved
      tokens_cost
      cost_tokens
      createdAt
      updatedAt
      __typename
    }
    user {
      id
      createdAt
      updatedAt
      __typename
    }
    createdAt
    updatedAt
    modelAICalculationsId
    userCalculationsId
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateCalculationSubscriptionVariables,
  APITypes.OnCreateCalculationSubscription
>;
export const onUpdateCalculation = /* GraphQL */ `subscription OnUpdateCalculation(
  $filter: ModelSubscriptionCalculationFilterInput
) {
  onUpdateCalculation(filter: $filter) {
    id
    polygon
    start_date
    end_date
    satellite_TIF
    result_TIF
    result_PNG
    is_to_block_chain
    modelAI {
      id
      name
      description
      document_link
      api_link
      version
      is_approved
      tokens_cost
      cost_tokens
      createdAt
      updatedAt
      __typename
    }
    user {
      id
      createdAt
      updatedAt
      __typename
    }
    createdAt
    updatedAt
    modelAICalculationsId
    userCalculationsId
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateCalculationSubscriptionVariables,
  APITypes.OnUpdateCalculationSubscription
>;
export const onDeleteCalculation = /* GraphQL */ `subscription OnDeleteCalculation(
  $filter: ModelSubscriptionCalculationFilterInput
) {
  onDeleteCalculation(filter: $filter) {
    id
    polygon
    start_date
    end_date
    satellite_TIF
    result_TIF
    result_PNG
    is_to_block_chain
    modelAI {
      id
      name
      description
      document_link
      api_link
      version
      is_approved
      tokens_cost
      cost_tokens
      createdAt
      updatedAt
      __typename
    }
    user {
      id
      createdAt
      updatedAt
      __typename
    }
    createdAt
    updatedAt
    modelAICalculationsId
    userCalculationsId
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteCalculationSubscriptionVariables,
  APITypes.OnDeleteCalculationSubscription
>;
export const onCreateUser = /* GraphQL */ `subscription OnCreateUser($filter: ModelSubscriptionUserFilterInput) {
  onCreateUser(filter: $filter) {
    id
    user_model_packages {
      nextToken
      __typename
    }
    calculations {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateUserSubscriptionVariables,
  APITypes.OnCreateUserSubscription
>;
export const onUpdateUser = /* GraphQL */ `subscription OnUpdateUser($filter: ModelSubscriptionUserFilterInput) {
  onUpdateUser(filter: $filter) {
    id
    user_model_packages {
      nextToken
      __typename
    }
    calculations {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateUserSubscriptionVariables,
  APITypes.OnUpdateUserSubscription
>;
export const onDeleteUser = /* GraphQL */ `subscription OnDeleteUser($filter: ModelSubscriptionUserFilterInput) {
  onDeleteUser(filter: $filter) {
    id
    user_model_packages {
      nextToken
      __typename
    }
    calculations {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteUserSubscriptionVariables,
  APITypes.OnDeleteUserSubscription
>;
export const onCreateModelPackage = /* GraphQL */ `subscription OnCreateModelPackage(
  $filter: ModelSubscriptionModelPackageFilterInput
) {
  onCreateModelPackage(filter: $filter) {
    id
    tokenAmount
    user_model_packages {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateModelPackageSubscriptionVariables,
  APITypes.OnCreateModelPackageSubscription
>;
export const onUpdateModelPackage = /* GraphQL */ `subscription OnUpdateModelPackage(
  $filter: ModelSubscriptionModelPackageFilterInput
) {
  onUpdateModelPackage(filter: $filter) {
    id
    tokenAmount
    user_model_packages {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateModelPackageSubscriptionVariables,
  APITypes.OnUpdateModelPackageSubscription
>;
export const onDeleteModelPackage = /* GraphQL */ `subscription OnDeleteModelPackage(
  $filter: ModelSubscriptionModelPackageFilterInput
) {
  onDeleteModelPackage(filter: $filter) {
    id
    tokenAmount
    user_model_packages {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteModelPackageSubscriptionVariables,
  APITypes.OnDeleteModelPackageSubscription
>;
export const onCreateUserModelPackage = /* GraphQL */ `subscription OnCreateUserModelPackage(
  $filter: ModelSubscriptionUserModelPackageFilterInput
) {
  onCreateUserModelPackage(filter: $filter) {
    id
    modelPackage {
      id
      tokenAmount
      createdAt
      updatedAt
      __typename
    }
    user {
      id
      createdAt
      updatedAt
      __typename
    }
    createdAt
    updatedAt
    userUser_model_packagesId
    modelPackageUser_model_packagesId
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateUserModelPackageSubscriptionVariables,
  APITypes.OnCreateUserModelPackageSubscription
>;
export const onUpdateUserModelPackage = /* GraphQL */ `subscription OnUpdateUserModelPackage(
  $filter: ModelSubscriptionUserModelPackageFilterInput
) {
  onUpdateUserModelPackage(filter: $filter) {
    id
    modelPackage {
      id
      tokenAmount
      createdAt
      updatedAt
      __typename
    }
    user {
      id
      createdAt
      updatedAt
      __typename
    }
    createdAt
    updatedAt
    userUser_model_packagesId
    modelPackageUser_model_packagesId
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateUserModelPackageSubscriptionVariables,
  APITypes.OnUpdateUserModelPackageSubscription
>;
export const onDeleteUserModelPackage = /* GraphQL */ `subscription OnDeleteUserModelPackage(
  $filter: ModelSubscriptionUserModelPackageFilterInput
) {
  onDeleteUserModelPackage(filter: $filter) {
    id
    modelPackage {
      id
      tokenAmount
      createdAt
      updatedAt
      __typename
    }
    user {
      id
      createdAt
      updatedAt
      __typename
    }
    createdAt
    updatedAt
    userUser_model_packagesId
    modelPackageUser_model_packagesId
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteUserModelPackageSubscriptionVariables,
  APITypes.OnDeleteUserModelPackageSubscription
>;
export const onCreateProyecto = /* GraphQL */ `subscription OnCreateProyecto($filter: ModelSubscriptionProyectoFilterInput) {
  onCreateProyecto(filter: $filter) {
    id
    proyectoNombre
    proyectoDescripcion
    proyectoIdExterno
    proyectoActivo
    proyectoFechaCreacion
    proyectoFechaActualizacion
    consultasAnalisis {
      nextToken
      __typename
    }
    gruposIot {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateProyectoSubscriptionVariables,
  APITypes.OnCreateProyectoSubscription
>;
export const onUpdateProyecto = /* GraphQL */ `subscription OnUpdateProyecto($filter: ModelSubscriptionProyectoFilterInput) {
  onUpdateProyecto(filter: $filter) {
    id
    proyectoNombre
    proyectoDescripcion
    proyectoIdExterno
    proyectoActivo
    proyectoFechaCreacion
    proyectoFechaActualizacion
    consultasAnalisis {
      nextToken
      __typename
    }
    gruposIot {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateProyectoSubscriptionVariables,
  APITypes.OnUpdateProyectoSubscription
>;
export const onDeleteProyecto = /* GraphQL */ `subscription OnDeleteProyecto($filter: ModelSubscriptionProyectoFilterInput) {
  onDeleteProyecto(filter: $filter) {
    id
    proyectoNombre
    proyectoDescripcion
    proyectoIdExterno
    proyectoActivo
    proyectoFechaCreacion
    proyectoFechaActualizacion
    consultasAnalisis {
      nextToken
      __typename
    }
    gruposIot {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteProyectoSubscriptionVariables,
  APITypes.OnDeleteProyectoSubscription
>;
export const onCreateConsultaAnalisis = /* GraphQL */ `subscription OnCreateConsultaAnalisis(
  $filter: ModelSubscriptionConsultaAnalisisFilterInput
) {
  onCreateConsultaAnalisis(filter: $filter) {
    id
    proyectoId
    consultaNombre
    consultaUbicacion
    consultaParametros
    consultaExternaPoligonos
    consultaIdExterna
    respuestaResultado
    respuestaIdentificadorExterno
    modeloId
    modeloName
    modeloDescription
    modeloVersion
    modeloDocumentLink
    modeloApiLink
    blockchainHashTransaccion
    fechaCreacion
    source
    proyecto {
      id
      proyectoNombre
      proyectoDescripcion
      proyectoIdExterno
      proyectoActivo
      proyectoFechaCreacion
      proyectoFechaActualizacion
      createdAt
      updatedAt
      __typename
    }
    estados {
      nextToken
      __typename
    }
    cuotasUso {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateConsultaAnalisisSubscriptionVariables,
  APITypes.OnCreateConsultaAnalisisSubscription
>;
export const onUpdateConsultaAnalisis = /* GraphQL */ `subscription OnUpdateConsultaAnalisis(
  $filter: ModelSubscriptionConsultaAnalisisFilterInput
) {
  onUpdateConsultaAnalisis(filter: $filter) {
    id
    proyectoId
    consultaNombre
    consultaUbicacion
    consultaParametros
    consultaExternaPoligonos
    consultaIdExterna
    respuestaResultado
    respuestaIdentificadorExterno
    modeloId
    modeloName
    modeloDescription
    modeloVersion
    modeloDocumentLink
    modeloApiLink
    blockchainHashTransaccion
    fechaCreacion
    source
    proyecto {
      id
      proyectoNombre
      proyectoDescripcion
      proyectoIdExterno
      proyectoActivo
      proyectoFechaCreacion
      proyectoFechaActualizacion
      createdAt
      updatedAt
      __typename
    }
    estados {
      nextToken
      __typename
    }
    cuotasUso {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateConsultaAnalisisSubscriptionVariables,
  APITypes.OnUpdateConsultaAnalisisSubscription
>;
export const onDeleteConsultaAnalisis = /* GraphQL */ `subscription OnDeleteConsultaAnalisis(
  $filter: ModelSubscriptionConsultaAnalisisFilterInput
) {
  onDeleteConsultaAnalisis(filter: $filter) {
    id
    proyectoId
    consultaNombre
    consultaUbicacion
    consultaParametros
    consultaExternaPoligonos
    consultaIdExterna
    respuestaResultado
    respuestaIdentificadorExterno
    modeloId
    modeloName
    modeloDescription
    modeloVersion
    modeloDocumentLink
    modeloApiLink
    blockchainHashTransaccion
    fechaCreacion
    source
    proyecto {
      id
      proyectoNombre
      proyectoDescripcion
      proyectoIdExterno
      proyectoActivo
      proyectoFechaCreacion
      proyectoFechaActualizacion
      createdAt
      updatedAt
      __typename
    }
    estados {
      nextToken
      __typename
    }
    cuotasUso {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteConsultaAnalisisSubscriptionVariables,
  APITypes.OnDeleteConsultaAnalisisSubscription
>;
export const onCreateConsultaEstado = /* GraphQL */ `subscription OnCreateConsultaEstado(
  $filter: ModelSubscriptionConsultaEstadoFilterInput
) {
  onCreateConsultaEstado(filter: $filter) {
    id
    consultaId
    estado
    estadoFecha
    estadoUsername
    estadoObservaciones
    estadoTipoActor
    consulta {
      id
      proyectoId
      consultaNombre
      consultaUbicacion
      consultaParametros
      consultaExternaPoligonos
      consultaIdExterna
      respuestaResultado
      respuestaIdentificadorExterno
      modeloId
      modeloName
      modeloDescription
      modeloVersion
      modeloDocumentLink
      modeloApiLink
      blockchainHashTransaccion
      fechaCreacion
      source
      createdAt
      updatedAt
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateConsultaEstadoSubscriptionVariables,
  APITypes.OnCreateConsultaEstadoSubscription
>;
export const onUpdateConsultaEstado = /* GraphQL */ `subscription OnUpdateConsultaEstado(
  $filter: ModelSubscriptionConsultaEstadoFilterInput
) {
  onUpdateConsultaEstado(filter: $filter) {
    id
    consultaId
    estado
    estadoFecha
    estadoUsername
    estadoObservaciones
    estadoTipoActor
    consulta {
      id
      proyectoId
      consultaNombre
      consultaUbicacion
      consultaParametros
      consultaExternaPoligonos
      consultaIdExterna
      respuestaResultado
      respuestaIdentificadorExterno
      modeloId
      modeloName
      modeloDescription
      modeloVersion
      modeloDocumentLink
      modeloApiLink
      blockchainHashTransaccion
      fechaCreacion
      source
      createdAt
      updatedAt
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateConsultaEstadoSubscriptionVariables,
  APITypes.OnUpdateConsultaEstadoSubscription
>;
export const onDeleteConsultaEstado = /* GraphQL */ `subscription OnDeleteConsultaEstado(
  $filter: ModelSubscriptionConsultaEstadoFilterInput
) {
  onDeleteConsultaEstado(filter: $filter) {
    id
    consultaId
    estado
    estadoFecha
    estadoUsername
    estadoObservaciones
    estadoTipoActor
    consulta {
      id
      proyectoId
      consultaNombre
      consultaUbicacion
      consultaParametros
      consultaExternaPoligonos
      consultaIdExterna
      respuestaResultado
      respuestaIdentificadorExterno
      modeloId
      modeloName
      modeloDescription
      modeloVersion
      modeloDocumentLink
      modeloApiLink
      blockchainHashTransaccion
      fechaCreacion
      source
      createdAt
      updatedAt
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteConsultaEstadoSubscriptionVariables,
  APITypes.OnDeleteConsultaEstadoSubscription
>;
export const onCreateAnalisisCuota = /* GraphQL */ `subscription OnCreateAnalisisCuota(
  $filter: ModelSubscriptionAnalisisCuotaFilterInput
) {
  onCreateAnalisisCuota(filter: $filter) {
    id
    nombreGrupo
    limiteDiario
    activo
    creadoEn
    actualizadoEn
    usosDiarios {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateAnalisisCuotaSubscriptionVariables,
  APITypes.OnCreateAnalisisCuotaSubscription
>;
export const onUpdateAnalisisCuota = /* GraphQL */ `subscription OnUpdateAnalisisCuota(
  $filter: ModelSubscriptionAnalisisCuotaFilterInput
) {
  onUpdateAnalisisCuota(filter: $filter) {
    id
    nombreGrupo
    limiteDiario
    activo
    creadoEn
    actualizadoEn
    usosDiarios {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateAnalisisCuotaSubscriptionVariables,
  APITypes.OnUpdateAnalisisCuotaSubscription
>;
export const onDeleteAnalisisCuota = /* GraphQL */ `subscription OnDeleteAnalisisCuota(
  $filter: ModelSubscriptionAnalisisCuotaFilterInput
) {
  onDeleteAnalisisCuota(filter: $filter) {
    id
    nombreGrupo
    limiteDiario
    activo
    creadoEn
    actualizadoEn
    usosDiarios {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteAnalisisCuotaSubscriptionVariables,
  APITypes.OnDeleteAnalisisCuotaSubscription
>;
export const onCreateAnalisisCuotasUsoDiario = /* GraphQL */ `subscription OnCreateAnalisisCuotasUsoDiario(
  $filter: ModelSubscriptionAnalisisCuotasUsoDiarioFilterInput
) {
  onCreateAnalisisCuotasUsoDiario(filter: $filter) {
    id
    usuarioNombre
    grupoId
    fechaUso
    consultaId
    creadoEn
    consulta {
      id
      proyectoId
      consultaNombre
      consultaUbicacion
      consultaParametros
      consultaExternaPoligonos
      consultaIdExterna
      respuestaResultado
      respuestaIdentificadorExterno
      modeloId
      modeloName
      modeloDescription
      modeloVersion
      modeloDocumentLink
      modeloApiLink
      blockchainHashTransaccion
      fechaCreacion
      source
      createdAt
      updatedAt
      __typename
    }
    grupo {
      id
      nombreGrupo
      limiteDiario
      activo
      creadoEn
      actualizadoEn
      createdAt
      updatedAt
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateAnalisisCuotasUsoDiarioSubscriptionVariables,
  APITypes.OnCreateAnalisisCuotasUsoDiarioSubscription
>;
export const onUpdateAnalisisCuotasUsoDiario = /* GraphQL */ `subscription OnUpdateAnalisisCuotasUsoDiario(
  $filter: ModelSubscriptionAnalisisCuotasUsoDiarioFilterInput
) {
  onUpdateAnalisisCuotasUsoDiario(filter: $filter) {
    id
    usuarioNombre
    grupoId
    fechaUso
    consultaId
    creadoEn
    consulta {
      id
      proyectoId
      consultaNombre
      consultaUbicacion
      consultaParametros
      consultaExternaPoligonos
      consultaIdExterna
      respuestaResultado
      respuestaIdentificadorExterno
      modeloId
      modeloName
      modeloDescription
      modeloVersion
      modeloDocumentLink
      modeloApiLink
      blockchainHashTransaccion
      fechaCreacion
      source
      createdAt
      updatedAt
      __typename
    }
    grupo {
      id
      nombreGrupo
      limiteDiario
      activo
      creadoEn
      actualizadoEn
      createdAt
      updatedAt
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateAnalisisCuotasUsoDiarioSubscriptionVariables,
  APITypes.OnUpdateAnalisisCuotasUsoDiarioSubscription
>;
export const onDeleteAnalisisCuotasUsoDiario = /* GraphQL */ `subscription OnDeleteAnalisisCuotasUsoDiario(
  $filter: ModelSubscriptionAnalisisCuotasUsoDiarioFilterInput
) {
  onDeleteAnalisisCuotasUsoDiario(filter: $filter) {
    id
    usuarioNombre
    grupoId
    fechaUso
    consultaId
    creadoEn
    consulta {
      id
      proyectoId
      consultaNombre
      consultaUbicacion
      consultaParametros
      consultaExternaPoligonos
      consultaIdExterna
      respuestaResultado
      respuestaIdentificadorExterno
      modeloId
      modeloName
      modeloDescription
      modeloVersion
      modeloDocumentLink
      modeloApiLink
      blockchainHashTransaccion
      fechaCreacion
      source
      createdAt
      updatedAt
      __typename
    }
    grupo {
      id
      nombreGrupo
      limiteDiario
      activo
      creadoEn
      actualizadoEn
      createdAt
      updatedAt
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteAnalisisCuotasUsoDiarioSubscriptionVariables,
  APITypes.OnDeleteAnalisisCuotasUsoDiarioSubscription
>;
export const onCreateDispositivoIot = /* GraphQL */ `subscription OnCreateDispositivoIot(
  $filter: ModelSubscriptionDispositivoIotFilterInput
) {
  onCreateDispositivoIot(filter: $filter) {
    id
    deviceId
    nombre
    departamento
    zona
    tipoDispositivo
    variablesPublicadas
    localizacion
    estado
    observaciones
    createdAt
    updatedAt
    grupos {
      nextToken
      __typename
    }
    mediciones {
      nextToken
      __typename
    }
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateDispositivoIotSubscriptionVariables,
  APITypes.OnCreateDispositivoIotSubscription
>;
export const onUpdateDispositivoIot = /* GraphQL */ `subscription OnUpdateDispositivoIot(
  $filter: ModelSubscriptionDispositivoIotFilterInput
) {
  onUpdateDispositivoIot(filter: $filter) {
    id
    deviceId
    nombre
    departamento
    zona
    tipoDispositivo
    variablesPublicadas
    localizacion
    estado
    observaciones
    createdAt
    updatedAt
    grupos {
      nextToken
      __typename
    }
    mediciones {
      nextToken
      __typename
    }
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateDispositivoIotSubscriptionVariables,
  APITypes.OnUpdateDispositivoIotSubscription
>;
export const onDeleteDispositivoIot = /* GraphQL */ `subscription OnDeleteDispositivoIot(
  $filter: ModelSubscriptionDispositivoIotFilterInput
) {
  onDeleteDispositivoIot(filter: $filter) {
    id
    deviceId
    nombre
    departamento
    zona
    tipoDispositivo
    variablesPublicadas
    localizacion
    estado
    observaciones
    createdAt
    updatedAt
    grupos {
      nextToken
      __typename
    }
    mediciones {
      nextToken
      __typename
    }
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteDispositivoIotSubscriptionVariables,
  APITypes.OnDeleteDispositivoIotSubscription
>;
export const onCreateGrupoIot = /* GraphQL */ `subscription OnCreateGrupoIot($filter: ModelSubscriptionGrupoIotFilterInput) {
  onCreateGrupoIot(filter: $filter) {
    id
    nombre
    descripcion
    estado
    usuarioCreador
    observaciones
    createdAt
    updatedAt
    dispositivos {
      nextToken
      __typename
    }
    proyectos {
      nextToken
      __typename
    }
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateGrupoIotSubscriptionVariables,
  APITypes.OnCreateGrupoIotSubscription
>;
export const onUpdateGrupoIot = /* GraphQL */ `subscription OnUpdateGrupoIot($filter: ModelSubscriptionGrupoIotFilterInput) {
  onUpdateGrupoIot(filter: $filter) {
    id
    nombre
    descripcion
    estado
    usuarioCreador
    observaciones
    createdAt
    updatedAt
    dispositivos {
      nextToken
      __typename
    }
    proyectos {
      nextToken
      __typename
    }
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateGrupoIotSubscriptionVariables,
  APITypes.OnUpdateGrupoIotSubscription
>;
export const onDeleteGrupoIot = /* GraphQL */ `subscription OnDeleteGrupoIot($filter: ModelSubscriptionGrupoIotFilterInput) {
  onDeleteGrupoIot(filter: $filter) {
    id
    nombre
    descripcion
    estado
    usuarioCreador
    observaciones
    createdAt
    updatedAt
    dispositivos {
      nextToken
      __typename
    }
    proyectos {
      nextToken
      __typename
    }
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteGrupoIotSubscriptionVariables,
  APITypes.OnDeleteGrupoIotSubscription
>;
export const onCreateRelDispositivoGrupoIot = /* GraphQL */ `subscription OnCreateRelDispositivoGrupoIot(
  $filter: ModelSubscriptionRelDispositivoGrupoIotFilterInput
) {
  onCreateRelDispositivoGrupoIot(filter: $filter) {
    id
    dispositivoId
    grupoId
    fechaAsignacion
    usuarioId
    notas
    dispositivo {
      id
      deviceId
      nombre
      departamento
      zona
      tipoDispositivo
      variablesPublicadas
      localizacion
      estado
      observaciones
      createdAt
      updatedAt
      __typename
    }
    grupo {
      id
      nombre
      descripcion
      estado
      usuarioCreador
      observaciones
      createdAt
      updatedAt
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateRelDispositivoGrupoIotSubscriptionVariables,
  APITypes.OnCreateRelDispositivoGrupoIotSubscription
>;
export const onUpdateRelDispositivoGrupoIot = /* GraphQL */ `subscription OnUpdateRelDispositivoGrupoIot(
  $filter: ModelSubscriptionRelDispositivoGrupoIotFilterInput
) {
  onUpdateRelDispositivoGrupoIot(filter: $filter) {
    id
    dispositivoId
    grupoId
    fechaAsignacion
    usuarioId
    notas
    dispositivo {
      id
      deviceId
      nombre
      departamento
      zona
      tipoDispositivo
      variablesPublicadas
      localizacion
      estado
      observaciones
      createdAt
      updatedAt
      __typename
    }
    grupo {
      id
      nombre
      descripcion
      estado
      usuarioCreador
      observaciones
      createdAt
      updatedAt
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateRelDispositivoGrupoIotSubscriptionVariables,
  APITypes.OnUpdateRelDispositivoGrupoIotSubscription
>;
export const onDeleteRelDispositivoGrupoIot = /* GraphQL */ `subscription OnDeleteRelDispositivoGrupoIot(
  $filter: ModelSubscriptionRelDispositivoGrupoIotFilterInput
) {
  onDeleteRelDispositivoGrupoIot(filter: $filter) {
    id
    dispositivoId
    grupoId
    fechaAsignacion
    usuarioId
    notas
    dispositivo {
      id
      deviceId
      nombre
      departamento
      zona
      tipoDispositivo
      variablesPublicadas
      localizacion
      estado
      observaciones
      createdAt
      updatedAt
      __typename
    }
    grupo {
      id
      nombre
      descripcion
      estado
      usuarioCreador
      observaciones
      createdAt
      updatedAt
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteRelDispositivoGrupoIotSubscriptionVariables,
  APITypes.OnDeleteRelDispositivoGrupoIotSubscription
>;
export const onCreateRelGrupoIotProyecto = /* GraphQL */ `subscription OnCreateRelGrupoIotProyecto(
  $filter: ModelSubscriptionRelGrupoIotProyectoFilterInput
) {
  onCreateRelGrupoIotProyecto(filter: $filter) {
    id
    grupoId
    proyectoId
    fechaAsignacion
    usuarioId
    notas
    grupo {
      id
      nombre
      descripcion
      estado
      usuarioCreador
      observaciones
      createdAt
      updatedAt
      __typename
    }
    proyecto {
      id
      proyectoNombre
      proyectoDescripcion
      proyectoIdExterno
      proyectoActivo
      proyectoFechaCreacion
      proyectoFechaActualizacion
      createdAt
      updatedAt
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateRelGrupoIotProyectoSubscriptionVariables,
  APITypes.OnCreateRelGrupoIotProyectoSubscription
>;
export const onUpdateRelGrupoIotProyecto = /* GraphQL */ `subscription OnUpdateRelGrupoIotProyecto(
  $filter: ModelSubscriptionRelGrupoIotProyectoFilterInput
) {
  onUpdateRelGrupoIotProyecto(filter: $filter) {
    id
    grupoId
    proyectoId
    fechaAsignacion
    usuarioId
    notas
    grupo {
      id
      nombre
      descripcion
      estado
      usuarioCreador
      observaciones
      createdAt
      updatedAt
      __typename
    }
    proyecto {
      id
      proyectoNombre
      proyectoDescripcion
      proyectoIdExterno
      proyectoActivo
      proyectoFechaCreacion
      proyectoFechaActualizacion
      createdAt
      updatedAt
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateRelGrupoIotProyectoSubscriptionVariables,
  APITypes.OnUpdateRelGrupoIotProyectoSubscription
>;
export const onDeleteRelGrupoIotProyecto = /* GraphQL */ `subscription OnDeleteRelGrupoIotProyecto(
  $filter: ModelSubscriptionRelGrupoIotProyectoFilterInput
) {
  onDeleteRelGrupoIotProyecto(filter: $filter) {
    id
    grupoId
    proyectoId
    fechaAsignacion
    usuarioId
    notas
    grupo {
      id
      nombre
      descripcion
      estado
      usuarioCreador
      observaciones
      createdAt
      updatedAt
      __typename
    }
    proyecto {
      id
      proyectoNombre
      proyectoDescripcion
      proyectoIdExterno
      proyectoActivo
      proyectoFechaCreacion
      proyectoFechaActualizacion
      createdAt
      updatedAt
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteRelGrupoIotProyectoSubscriptionVariables,
  APITypes.OnDeleteRelGrupoIotProyectoSubscription
>;
export const onCreateMedicionIot = /* GraphQL */ `subscription OnCreateMedicionIot(
  $filter: ModelSubscriptionMedicionIotFilterInput
) {
  onCreateMedicionIot(filter: $filter) {
    id
    dispositivoId
    deviceId
    departamento
    zona
    variable
    valor
    timestamp
    dispositivo {
      id
      deviceId
      nombre
      departamento
      zona
      tipoDispositivo
      variablesPublicadas
      localizacion
      estado
      observaciones
      createdAt
      updatedAt
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateMedicionIotSubscriptionVariables,
  APITypes.OnCreateMedicionIotSubscription
>;
export const onUpdateMedicionIot = /* GraphQL */ `subscription OnUpdateMedicionIot(
  $filter: ModelSubscriptionMedicionIotFilterInput
) {
  onUpdateMedicionIot(filter: $filter) {
    id
    dispositivoId
    deviceId
    departamento
    zona
    variable
    valor
    timestamp
    dispositivo {
      id
      deviceId
      nombre
      departamento
      zona
      tipoDispositivo
      variablesPublicadas
      localizacion
      estado
      observaciones
      createdAt
      updatedAt
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateMedicionIotSubscriptionVariables,
  APITypes.OnUpdateMedicionIotSubscription
>;
export const onDeleteMedicionIot = /* GraphQL */ `subscription OnDeleteMedicionIot(
  $filter: ModelSubscriptionMedicionIotFilterInput
) {
  onDeleteMedicionIot(filter: $filter) {
    id
    dispositivoId
    deviceId
    departamento
    zona
    variable
    valor
    timestamp
    dispositivo {
      id
      deviceId
      nombre
      departamento
      zona
      tipoDispositivo
      variablesPublicadas
      localizacion
      estado
      observaciones
      createdAt
      updatedAt
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteMedicionIotSubscriptionVariables,
  APITypes.OnDeleteMedicionIotSubscription
>;
export const onCreateProyectoLegacy = /* GraphQL */ `subscription OnCreateProyectoLegacy(
  $filter: ModelSubscriptionProyectoLegacyFilterInput
) {
  onCreateProyectoLegacy(filter: $filter) {
    id
    projectId
    descripcion
    consultasWeb {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateProyectoLegacySubscriptionVariables,
  APITypes.OnCreateProyectoLegacySubscription
>;
export const onUpdateProyectoLegacy = /* GraphQL */ `subscription OnUpdateProyectoLegacy(
  $filter: ModelSubscriptionProyectoLegacyFilterInput
) {
  onUpdateProyectoLegacy(filter: $filter) {
    id
    projectId
    descripcion
    consultasWeb {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateProyectoLegacySubscriptionVariables,
  APITypes.OnUpdateProyectoLegacySubscription
>;
export const onDeleteProyectoLegacy = /* GraphQL */ `subscription OnDeleteProyectoLegacy(
  $filter: ModelSubscriptionProyectoLegacyFilterInput
) {
  onDeleteProyectoLegacy(filter: $filter) {
    id
    projectId
    descripcion
    consultasWeb {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteProyectoLegacySubscriptionVariables,
  APITypes.OnDeleteProyectoLegacySubscription
>;
export const onCreateConsultaWeb = /* GraphQL */ `subscription OnCreateConsultaWeb(
  $filter: ModelSubscriptionConsultaWebFilterInput
) {
  onCreateConsultaWeb(filter: $filter) {
    id
    projectID
    imgAnteriorNombreImg
    imgAnteriorSatellite
    imgAnteriorYear
    imgAnteriorMesInicial
    imgAnteriorMesFinal
    imgAnteriorNubosidadMaxima
    imgAnteriorBandas
    imgPosteriorNombreImg
    imgPosteriorSatellite
    imgPosteriorYear
    imgPosteriorMesInicial
    imgPosteriorMesFinal
    imgPosteriorNubosidadMaxima
    imgPosteriorBandas
    fechaHoraConsulta
    usuarioEmailUpdate
    rawConsulta
    resultadoConsulta
    proyecto {
      id
      projectId
      descripcion
      createdAt
      updatedAt
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateConsultaWebSubscriptionVariables,
  APITypes.OnCreateConsultaWebSubscription
>;
export const onUpdateConsultaWeb = /* GraphQL */ `subscription OnUpdateConsultaWeb(
  $filter: ModelSubscriptionConsultaWebFilterInput
) {
  onUpdateConsultaWeb(filter: $filter) {
    id
    projectID
    imgAnteriorNombreImg
    imgAnteriorSatellite
    imgAnteriorYear
    imgAnteriorMesInicial
    imgAnteriorMesFinal
    imgAnteriorNubosidadMaxima
    imgAnteriorBandas
    imgPosteriorNombreImg
    imgPosteriorSatellite
    imgPosteriorYear
    imgPosteriorMesInicial
    imgPosteriorMesFinal
    imgPosteriorNubosidadMaxima
    imgPosteriorBandas
    fechaHoraConsulta
    usuarioEmailUpdate
    rawConsulta
    resultadoConsulta
    proyecto {
      id
      projectId
      descripcion
      createdAt
      updatedAt
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateConsultaWebSubscriptionVariables,
  APITypes.OnUpdateConsultaWebSubscription
>;
export const onDeleteConsultaWeb = /* GraphQL */ `subscription OnDeleteConsultaWeb(
  $filter: ModelSubscriptionConsultaWebFilterInput
) {
  onDeleteConsultaWeb(filter: $filter) {
    id
    projectID
    imgAnteriorNombreImg
    imgAnteriorSatellite
    imgAnteriorYear
    imgAnteriorMesInicial
    imgAnteriorMesFinal
    imgAnteriorNubosidadMaxima
    imgAnteriorBandas
    imgPosteriorNombreImg
    imgPosteriorSatellite
    imgPosteriorYear
    imgPosteriorMesInicial
    imgPosteriorMesFinal
    imgPosteriorNubosidadMaxima
    imgPosteriorBandas
    fechaHoraConsulta
    usuarioEmailUpdate
    rawConsulta
    resultadoConsulta
    proyecto {
      id
      projectId
      descripcion
      createdAt
      updatedAt
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteConsultaWebSubscriptionVariables,
  APITypes.OnDeleteConsultaWebSubscription
>;
export const onCreateConsultaApi = /* GraphQL */ `subscription OnCreateConsultaApi(
  $filter: ModelSubscriptionConsultaApiFilterInput
) {
  onCreateConsultaApi(filter: $filter) {
    id
    projectID
    cedulaCatastral
    imgAnteriorNombreImg
    imgAnteriorSatellite
    imgAnteriorYear
    imgAnteriorMesInicial
    imgAnteriorMesFinal
    imgAnteriorNubosidadMaxima
    imgAnteriorBandas
    imgPosteriorNombreImg
    imgPosteriorSatellite
    imgPosteriorYear
    imgPosteriorMesInicial
    imgPosteriorMesFinal
    imgPosteriorNubosidadMaxima
    imgPosteriorBandas
    fechaHoraConsulta
    fechaHoraActualizacion
    usuarioEmailUpdate
    verificado
    rawConsulta
    resultadoConsulta
    hashBlockchain
    indexNumberBlockchain
    timestampBlockchain
    onchainBlockchain
    txIdBlockchain
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateConsultaApiSubscriptionVariables,
  APITypes.OnCreateConsultaApiSubscription
>;
export const onUpdateConsultaApi = /* GraphQL */ `subscription OnUpdateConsultaApi(
  $filter: ModelSubscriptionConsultaApiFilterInput
) {
  onUpdateConsultaApi(filter: $filter) {
    id
    projectID
    cedulaCatastral
    imgAnteriorNombreImg
    imgAnteriorSatellite
    imgAnteriorYear
    imgAnteriorMesInicial
    imgAnteriorMesFinal
    imgAnteriorNubosidadMaxima
    imgAnteriorBandas
    imgPosteriorNombreImg
    imgPosteriorSatellite
    imgPosteriorYear
    imgPosteriorMesInicial
    imgPosteriorMesFinal
    imgPosteriorNubosidadMaxima
    imgPosteriorBandas
    fechaHoraConsulta
    fechaHoraActualizacion
    usuarioEmailUpdate
    verificado
    rawConsulta
    resultadoConsulta
    hashBlockchain
    indexNumberBlockchain
    timestampBlockchain
    onchainBlockchain
    txIdBlockchain
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateConsultaApiSubscriptionVariables,
  APITypes.OnUpdateConsultaApiSubscription
>;
export const onDeleteConsultaApi = /* GraphQL */ `subscription OnDeleteConsultaApi(
  $filter: ModelSubscriptionConsultaApiFilterInput
) {
  onDeleteConsultaApi(filter: $filter) {
    id
    projectID
    cedulaCatastral
    imgAnteriorNombreImg
    imgAnteriorSatellite
    imgAnteriorYear
    imgAnteriorMesInicial
    imgAnteriorMesFinal
    imgAnteriorNubosidadMaxima
    imgAnteriorBandas
    imgPosteriorNombreImg
    imgPosteriorSatellite
    imgPosteriorYear
    imgPosteriorMesInicial
    imgPosteriorMesFinal
    imgPosteriorNubosidadMaxima
    imgPosteriorBandas
    fechaHoraConsulta
    fechaHoraActualizacion
    usuarioEmailUpdate
    verificado
    rawConsulta
    resultadoConsulta
    hashBlockchain
    indexNumberBlockchain
    timestampBlockchain
    onchainBlockchain
    txIdBlockchain
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteConsultaApiSubscriptionVariables,
  APITypes.OnDeleteConsultaApiSubscription
>;
export const onCreateIotSession = /* GraphQL */ `subscription OnCreateIotSession(
  $filter: ModelSubscriptionIotSessionFilterInput
) {
  onCreateIotSession(filter: $filter) {
    id
    sessionId
    iotData
    createdAt
    expiresAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateIotSessionSubscriptionVariables,
  APITypes.OnCreateIotSessionSubscription
>;
export const onUpdateIotSession = /* GraphQL */ `subscription OnUpdateIotSession(
  $filter: ModelSubscriptionIotSessionFilterInput
) {
  onUpdateIotSession(filter: $filter) {
    id
    sessionId
    iotData
    createdAt
    expiresAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateIotSessionSubscriptionVariables,
  APITypes.OnUpdateIotSessionSubscription
>;
export const onDeleteIotSession = /* GraphQL */ `subscription OnDeleteIotSession(
  $filter: ModelSubscriptionIotSessionFilterInput
) {
  onDeleteIotSession(filter: $filter) {
    id
    sessionId
    iotData
    createdAt
    expiresAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteIotSessionSubscriptionVariables,
  APITypes.OnDeleteIotSessionSubscription
>;
export const onCreateConstructorFormulaCategoria = /* GraphQL */ `subscription OnCreateConstructorFormulaCategoria(
  $filter: ModelSubscriptionConstructorFormulaCategoriaFilterInput
) {
  onCreateConstructorFormulaCategoria(filter: $filter) {
    id
    nombre
    estado
    variables {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateConstructorFormulaCategoriaSubscriptionVariables,
  APITypes.OnCreateConstructorFormulaCategoriaSubscription
>;
export const onUpdateConstructorFormulaCategoria = /* GraphQL */ `subscription OnUpdateConstructorFormulaCategoria(
  $filter: ModelSubscriptionConstructorFormulaCategoriaFilterInput
) {
  onUpdateConstructorFormulaCategoria(filter: $filter) {
    id
    nombre
    estado
    variables {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateConstructorFormulaCategoriaSubscriptionVariables,
  APITypes.OnUpdateConstructorFormulaCategoriaSubscription
>;
export const onDeleteConstructorFormulaCategoria = /* GraphQL */ `subscription OnDeleteConstructorFormulaCategoria(
  $filter: ModelSubscriptionConstructorFormulaCategoriaFilterInput
) {
  onDeleteConstructorFormulaCategoria(filter: $filter) {
    id
    nombre
    estado
    variables {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteConstructorFormulaCategoriaSubscriptionVariables,
  APITypes.OnDeleteConstructorFormulaCategoriaSubscription
>;
export const onCreateConstructorFormulaVariable = /* GraphQL */ `subscription OnCreateConstructorFormulaVariable(
  $filter: ModelSubscriptionConstructorFormulaVariableFilterInput
) {
  onCreateConstructorFormulaVariable(filter: $filter) {
    id
    nombre
    simbolo
    unidades
    descripcion
    categoriaId
    estado
    categoria {
      id
      nombre
      estado
      createdAt
      updatedAt
      __typename
    }
    formulas {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateConstructorFormulaVariableSubscriptionVariables,
  APITypes.OnCreateConstructorFormulaVariableSubscription
>;
export const onUpdateConstructorFormulaVariable = /* GraphQL */ `subscription OnUpdateConstructorFormulaVariable(
  $filter: ModelSubscriptionConstructorFormulaVariableFilterInput
) {
  onUpdateConstructorFormulaVariable(filter: $filter) {
    id
    nombre
    simbolo
    unidades
    descripcion
    categoriaId
    estado
    categoria {
      id
      nombre
      estado
      createdAt
      updatedAt
      __typename
    }
    formulas {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateConstructorFormulaVariableSubscriptionVariables,
  APITypes.OnUpdateConstructorFormulaVariableSubscription
>;
export const onDeleteConstructorFormulaVariable = /* GraphQL */ `subscription OnDeleteConstructorFormulaVariable(
  $filter: ModelSubscriptionConstructorFormulaVariableFilterInput
) {
  onDeleteConstructorFormulaVariable(filter: $filter) {
    id
    nombre
    simbolo
    unidades
    descripcion
    categoriaId
    estado
    categoria {
      id
      nombre
      estado
      createdAt
      updatedAt
      __typename
    }
    formulas {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteConstructorFormulaVariableSubscriptionVariables,
  APITypes.OnDeleteConstructorFormulaVariableSubscription
>;
export const onCreateConstructorFormula = /* GraphQL */ `subscription OnCreateConstructorFormula(
  $filter: ModelSubscriptionConstructorFormulaFilterInput
) {
  onCreateConstructorFormula(filter: $filter) {
    id
    nombre
    descripcion
    fuente
    usuarioId
    tipoFormula
    estado
    expresionJson
    fechaCreacion
    version
    versionActiva
    variables {
      nextToken
      __typename
    }
    teledeteccion {
      nextToken
      __typename
    }
    deepLearning {
      nextToken
      __typename
    }
    historial {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateConstructorFormulaSubscriptionVariables,
  APITypes.OnCreateConstructorFormulaSubscription
>;
export const onUpdateConstructorFormula = /* GraphQL */ `subscription OnUpdateConstructorFormula(
  $filter: ModelSubscriptionConstructorFormulaFilterInput
) {
  onUpdateConstructorFormula(filter: $filter) {
    id
    nombre
    descripcion
    fuente
    usuarioId
    tipoFormula
    estado
    expresionJson
    fechaCreacion
    version
    versionActiva
    variables {
      nextToken
      __typename
    }
    teledeteccion {
      nextToken
      __typename
    }
    deepLearning {
      nextToken
      __typename
    }
    historial {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateConstructorFormulaSubscriptionVariables,
  APITypes.OnUpdateConstructorFormulaSubscription
>;
export const onDeleteConstructorFormula = /* GraphQL */ `subscription OnDeleteConstructorFormula(
  $filter: ModelSubscriptionConstructorFormulaFilterInput
) {
  onDeleteConstructorFormula(filter: $filter) {
    id
    nombre
    descripcion
    fuente
    usuarioId
    tipoFormula
    estado
    expresionJson
    fechaCreacion
    version
    versionActiva
    variables {
      nextToken
      __typename
    }
    teledeteccion {
      nextToken
      __typename
    }
    deepLearning {
      nextToken
      __typename
    }
    historial {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteConstructorFormulaSubscriptionVariables,
  APITypes.OnDeleteConstructorFormulaSubscription
>;
export const onCreateConstructorFormulaVariableRel = /* GraphQL */ `subscription OnCreateConstructorFormulaVariableRel(
  $filter: ModelSubscriptionConstructorFormulaVariableRelFilterInput
) {
  onCreateConstructorFormulaVariableRel(filter: $filter) {
    id
    formulaId
    variableId
    formula {
      id
      nombre
      descripcion
      fuente
      usuarioId
      tipoFormula
      estado
      expresionJson
      fechaCreacion
      version
      versionActiva
      createdAt
      updatedAt
      __typename
    }
    variable {
      id
      nombre
      simbolo
      unidades
      descripcion
      categoriaId
      estado
      createdAt
      updatedAt
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateConstructorFormulaVariableRelSubscriptionVariables,
  APITypes.OnCreateConstructorFormulaVariableRelSubscription
>;
export const onUpdateConstructorFormulaVariableRel = /* GraphQL */ `subscription OnUpdateConstructorFormulaVariableRel(
  $filter: ModelSubscriptionConstructorFormulaVariableRelFilterInput
) {
  onUpdateConstructorFormulaVariableRel(filter: $filter) {
    id
    formulaId
    variableId
    formula {
      id
      nombre
      descripcion
      fuente
      usuarioId
      tipoFormula
      estado
      expresionJson
      fechaCreacion
      version
      versionActiva
      createdAt
      updatedAt
      __typename
    }
    variable {
      id
      nombre
      simbolo
      unidades
      descripcion
      categoriaId
      estado
      createdAt
      updatedAt
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateConstructorFormulaVariableRelSubscriptionVariables,
  APITypes.OnUpdateConstructorFormulaVariableRelSubscription
>;
export const onDeleteConstructorFormulaVariableRel = /* GraphQL */ `subscription OnDeleteConstructorFormulaVariableRel(
  $filter: ModelSubscriptionConstructorFormulaVariableRelFilterInput
) {
  onDeleteConstructorFormulaVariableRel(filter: $filter) {
    id
    formulaId
    variableId
    formula {
      id
      nombre
      descripcion
      fuente
      usuarioId
      tipoFormula
      estado
      expresionJson
      fechaCreacion
      version
      versionActiva
      createdAt
      updatedAt
      __typename
    }
    variable {
      id
      nombre
      simbolo
      unidades
      descripcion
      categoriaId
      estado
      createdAt
      updatedAt
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteConstructorFormulaVariableRelSubscriptionVariables,
  APITypes.OnDeleteConstructorFormulaVariableRelSubscription
>;
export const onCreateFormulaTeledeteccion = /* GraphQL */ `subscription OnCreateFormulaTeledeteccion(
  $filter: ModelSubscriptionFormulaTeledeteccionFilterInput
) {
  onCreateFormulaTeledeteccion(filter: $filter) {
    id
    formulaId
    codigoScript
    tipoEntrada
    parametrosJson
    formula {
      id
      nombre
      descripcion
      fuente
      usuarioId
      tipoFormula
      estado
      expresionJson
      fechaCreacion
      version
      versionActiva
      createdAt
      updatedAt
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateFormulaTeledeteccionSubscriptionVariables,
  APITypes.OnCreateFormulaTeledeteccionSubscription
>;
export const onUpdateFormulaTeledeteccion = /* GraphQL */ `subscription OnUpdateFormulaTeledeteccion(
  $filter: ModelSubscriptionFormulaTeledeteccionFilterInput
) {
  onUpdateFormulaTeledeteccion(filter: $filter) {
    id
    formulaId
    codigoScript
    tipoEntrada
    parametrosJson
    formula {
      id
      nombre
      descripcion
      fuente
      usuarioId
      tipoFormula
      estado
      expresionJson
      fechaCreacion
      version
      versionActiva
      createdAt
      updatedAt
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateFormulaTeledeteccionSubscriptionVariables,
  APITypes.OnUpdateFormulaTeledeteccionSubscription
>;
export const onDeleteFormulaTeledeteccion = /* GraphQL */ `subscription OnDeleteFormulaTeledeteccion(
  $filter: ModelSubscriptionFormulaTeledeteccionFilterInput
) {
  onDeleteFormulaTeledeteccion(filter: $filter) {
    id
    formulaId
    codigoScript
    tipoEntrada
    parametrosJson
    formula {
      id
      nombre
      descripcion
      fuente
      usuarioId
      tipoFormula
      estado
      expresionJson
      fechaCreacion
      version
      versionActiva
      createdAt
      updatedAt
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteFormulaTeledeteccionSubscriptionVariables,
  APITypes.OnDeleteFormulaTeledeteccionSubscription
>;
export const onCreateFormulaDeepLearning = /* GraphQL */ `subscription OnCreateFormulaDeepLearning(
  $filter: ModelSubscriptionFormulaDeepLearningFilterInput
) {
  onCreateFormulaDeepLearning(filter: $filter) {
    id
    formulaId
    rutaModelo
    rutaEtiquetas
    parametrosJson
    formula {
      id
      nombre
      descripcion
      fuente
      usuarioId
      tipoFormula
      estado
      expresionJson
      fechaCreacion
      version
      versionActiva
      createdAt
      updatedAt
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateFormulaDeepLearningSubscriptionVariables,
  APITypes.OnCreateFormulaDeepLearningSubscription
>;
export const onUpdateFormulaDeepLearning = /* GraphQL */ `subscription OnUpdateFormulaDeepLearning(
  $filter: ModelSubscriptionFormulaDeepLearningFilterInput
) {
  onUpdateFormulaDeepLearning(filter: $filter) {
    id
    formulaId
    rutaModelo
    rutaEtiquetas
    parametrosJson
    formula {
      id
      nombre
      descripcion
      fuente
      usuarioId
      tipoFormula
      estado
      expresionJson
      fechaCreacion
      version
      versionActiva
      createdAt
      updatedAt
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateFormulaDeepLearningSubscriptionVariables,
  APITypes.OnUpdateFormulaDeepLearningSubscription
>;
export const onDeleteFormulaDeepLearning = /* GraphQL */ `subscription OnDeleteFormulaDeepLearning(
  $filter: ModelSubscriptionFormulaDeepLearningFilterInput
) {
  onDeleteFormulaDeepLearning(filter: $filter) {
    id
    formulaId
    rutaModelo
    rutaEtiquetas
    parametrosJson
    formula {
      id
      nombre
      descripcion
      fuente
      usuarioId
      tipoFormula
      estado
      expresionJson
      fechaCreacion
      version
      versionActiva
      createdAt
      updatedAt
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteFormulaDeepLearningSubscriptionVariables,
  APITypes.OnDeleteFormulaDeepLearningSubscription
>;
export const onCreateFormulaHistorial = /* GraphQL */ `subscription OnCreateFormulaHistorial(
  $filter: ModelSubscriptionFormulaHistorialFilterInput
) {
  onCreateFormulaHistorial(filter: $filter) {
    id
    formulaId
    version
    fechaModificacion
    datosJson
    usuarioId
    formula {
      id
      nombre
      descripcion
      fuente
      usuarioId
      tipoFormula
      estado
      expresionJson
      fechaCreacion
      version
      versionActiva
      createdAt
      updatedAt
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateFormulaHistorialSubscriptionVariables,
  APITypes.OnCreateFormulaHistorialSubscription
>;
export const onUpdateFormulaHistorial = /* GraphQL */ `subscription OnUpdateFormulaHistorial(
  $filter: ModelSubscriptionFormulaHistorialFilterInput
) {
  onUpdateFormulaHistorial(filter: $filter) {
    id
    formulaId
    version
    fechaModificacion
    datosJson
    usuarioId
    formula {
      id
      nombre
      descripcion
      fuente
      usuarioId
      tipoFormula
      estado
      expresionJson
      fechaCreacion
      version
      versionActiva
      createdAt
      updatedAt
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateFormulaHistorialSubscriptionVariables,
  APITypes.OnUpdateFormulaHistorialSubscription
>;
export const onDeleteFormulaHistorial = /* GraphQL */ `subscription OnDeleteFormulaHistorial(
  $filter: ModelSubscriptionFormulaHistorialFilterInput
) {
  onDeleteFormulaHistorial(filter: $filter) {
    id
    formulaId
    version
    fechaModificacion
    datosJson
    usuarioId
    formula {
      id
      nombre
      descripcion
      fuente
      usuarioId
      tipoFormula
      estado
      expresionJson
      fechaCreacion
      version
      versionActiva
      createdAt
      updatedAt
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteFormulaHistorialSubscriptionVariables,
  APITypes.OnDeleteFormulaHistorialSubscription
>;
export const onCreateAccessDeadline = /* GraphQL */ `subscription OnCreateAccessDeadline(
  $filter: ModelSubscriptionAccessDeadlineFilterInput
) {
  onCreateAccessDeadline(filter: $filter) {
    id
    subjectType
    subjectKey
    deadline
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateAccessDeadlineSubscriptionVariables,
  APITypes.OnCreateAccessDeadlineSubscription
>;
export const onUpdateAccessDeadline = /* GraphQL */ `subscription OnUpdateAccessDeadline(
  $filter: ModelSubscriptionAccessDeadlineFilterInput
) {
  onUpdateAccessDeadline(filter: $filter) {
    id
    subjectType
    subjectKey
    deadline
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateAccessDeadlineSubscriptionVariables,
  APITypes.OnUpdateAccessDeadlineSubscription
>;
export const onDeleteAccessDeadline = /* GraphQL */ `subscription OnDeleteAccessDeadline(
  $filter: ModelSubscriptionAccessDeadlineFilterInput
) {
  onDeleteAccessDeadline(filter: $filter) {
    id
    subjectType
    subjectKey
    deadline
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteAccessDeadlineSubscriptionVariables,
  APITypes.OnDeleteAccessDeadlineSubscription
>;
export const onCreateRoutePermission = /* GraphQL */ `subscription OnCreateRoutePermission(
  $filter: ModelSubscriptionRoutePermissionFilterInput
) {
  onCreateRoutePermission(filter: $filter) {
    id
    subjectType
    subjectKey
    tagName
    method
    allow
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateRoutePermissionSubscriptionVariables,
  APITypes.OnCreateRoutePermissionSubscription
>;
export const onUpdateRoutePermission = /* GraphQL */ `subscription OnUpdateRoutePermission(
  $filter: ModelSubscriptionRoutePermissionFilterInput
) {
  onUpdateRoutePermission(filter: $filter) {
    id
    subjectType
    subjectKey
    tagName
    method
    allow
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateRoutePermissionSubscriptionVariables,
  APITypes.OnUpdateRoutePermissionSubscription
>;
export const onDeleteRoutePermission = /* GraphQL */ `subscription OnDeleteRoutePermission(
  $filter: ModelSubscriptionRoutePermissionFilterInput
) {
  onDeleteRoutePermission(filter: $filter) {
    id
    subjectType
    subjectKey
    tagName
    method
    allow
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteRoutePermissionSubscriptionVariables,
  APITypes.OnDeleteRoutePermissionSubscription
>;
export const onCreateApiCredential = /* GraphQL */ `subscription OnCreateApiCredential(
  $filter: ModelSubscriptionApiCredentialFilterInput
) {
  onCreateApiCredential(filter: $filter) {
    id
    name
    apiKeyHash
    active
    allowedIps
    expiresAt
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateApiCredentialSubscriptionVariables,
  APITypes.OnCreateApiCredentialSubscription
>;
export const onUpdateApiCredential = /* GraphQL */ `subscription OnUpdateApiCredential(
  $filter: ModelSubscriptionApiCredentialFilterInput
) {
  onUpdateApiCredential(filter: $filter) {
    id
    name
    apiKeyHash
    active
    allowedIps
    expiresAt
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateApiCredentialSubscriptionVariables,
  APITypes.OnUpdateApiCredentialSubscription
>;
export const onDeleteApiCredential = /* GraphQL */ `subscription OnDeleteApiCredential(
  $filter: ModelSubscriptionApiCredentialFilterInput
) {
  onDeleteApiCredential(filter: $filter) {
    id
    name
    apiKeyHash
    active
    allowedIps
    expiresAt
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteApiCredentialSubscriptionVariables,
  APITypes.OnDeleteApiCredentialSubscription
>;
export const onCreatePermVersion = /* GraphQL */ `subscription OnCreatePermVersion(
  $filter: ModelSubscriptionPermVersionFilterInput
) {
  onCreatePermVersion(filter: $filter) {
    id
    updatedAt
    createdAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreatePermVersionSubscriptionVariables,
  APITypes.OnCreatePermVersionSubscription
>;
export const onUpdatePermVersion = /* GraphQL */ `subscription OnUpdatePermVersion(
  $filter: ModelSubscriptionPermVersionFilterInput
) {
  onUpdatePermVersion(filter: $filter) {
    id
    updatedAt
    createdAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdatePermVersionSubscriptionVariables,
  APITypes.OnUpdatePermVersionSubscription
>;
export const onDeletePermVersion = /* GraphQL */ `subscription OnDeletePermVersion(
  $filter: ModelSubscriptionPermVersionFilterInput
) {
  onDeletePermVersion(filter: $filter) {
    id
    updatedAt
    createdAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeletePermVersionSubscriptionVariables,
  APITypes.OnDeletePermVersionSubscription
>;
export const onCreateUnitOfMeasure = /* GraphQL */ `subscription OnCreateUnitOfMeasure(
  $filter: ModelSubscriptionUnitOfMeasureFilterInput
) {
  onCreateUnitOfMeasure(filter: $filter) {
    id
    name
    abbreviation
    features {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateUnitOfMeasureSubscriptionVariables,
  APITypes.OnCreateUnitOfMeasureSubscription
>;
export const onUpdateUnitOfMeasure = /* GraphQL */ `subscription OnUpdateUnitOfMeasure(
  $filter: ModelSubscriptionUnitOfMeasureFilterInput
) {
  onUpdateUnitOfMeasure(filter: $filter) {
    id
    name
    abbreviation
    features {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateUnitOfMeasureSubscriptionVariables,
  APITypes.OnUpdateUnitOfMeasureSubscription
>;
export const onDeleteUnitOfMeasure = /* GraphQL */ `subscription OnDeleteUnitOfMeasure(
  $filter: ModelSubscriptionUnitOfMeasureFilterInput
) {
  onDeleteUnitOfMeasure(filter: $filter) {
    id
    name
    abbreviation
    features {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteUnitOfMeasureSubscriptionVariables,
  APITypes.OnDeleteUnitOfMeasureSubscription
>;
export const onCreateProject = /* GraphQL */ `subscription OnCreateProject($filter: ModelSubscriptionProjectFilterInput) {
  onCreateProject(filter: $filter) {
    id
    name
    status
    trees {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateProjectSubscriptionVariables,
  APITypes.OnCreateProjectSubscription
>;
export const onUpdateProject = /* GraphQL */ `subscription OnUpdateProject($filter: ModelSubscriptionProjectFilterInput) {
  onUpdateProject(filter: $filter) {
    id
    name
    status
    trees {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateProjectSubscriptionVariables,
  APITypes.OnUpdateProjectSubscription
>;
export const onDeleteProject = /* GraphQL */ `subscription OnDeleteProject($filter: ModelSubscriptionProjectFilterInput) {
  onDeleteProject(filter: $filter) {
    id
    name
    status
    trees {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteProjectSubscriptionVariables,
  APITypes.OnDeleteProjectSubscription
>;
export const onCreateTemplate = /* GraphQL */ `subscription OnCreateTemplate($filter: ModelSubscriptionTemplateFilterInput) {
  onCreateTemplate(filter: $filter) {
    id
    name
    description
    type
    version
    is_latest
    templateParent {
      id
      name
      description
      type
      version
      is_latest
      createdAt
      updatedAt
      templateTemplatesId
      __typename
    }
    templates {
      nextToken
      __typename
    }
    templateFeatures {
      nextToken
      __typename
    }
    trees {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    templateTemplatesId
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateTemplateSubscriptionVariables,
  APITypes.OnCreateTemplateSubscription
>;
export const onUpdateTemplate = /* GraphQL */ `subscription OnUpdateTemplate($filter: ModelSubscriptionTemplateFilterInput) {
  onUpdateTemplate(filter: $filter) {
    id
    name
    description
    type
    version
    is_latest
    templateParent {
      id
      name
      description
      type
      version
      is_latest
      createdAt
      updatedAt
      templateTemplatesId
      __typename
    }
    templates {
      nextToken
      __typename
    }
    templateFeatures {
      nextToken
      __typename
    }
    trees {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    templateTemplatesId
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateTemplateSubscriptionVariables,
  APITypes.OnUpdateTemplateSubscription
>;
export const onDeleteTemplate = /* GraphQL */ `subscription OnDeleteTemplate($filter: ModelSubscriptionTemplateFilterInput) {
  onDeleteTemplate(filter: $filter) {
    id
    name
    description
    type
    version
    is_latest
    templateParent {
      id
      name
      description
      type
      version
      is_latest
      createdAt
      updatedAt
      templateTemplatesId
      __typename
    }
    templates {
      nextToken
      __typename
    }
    templateFeatures {
      nextToken
      __typename
    }
    trees {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    templateTemplatesId
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteTemplateSubscriptionVariables,
  APITypes.OnDeleteTemplateSubscription
>;
export const onCreateTree = /* GraphQL */ `subscription OnCreateTree($filter: ModelSubscriptionTreeFilterInput) {
  onCreateTree(filter: $filter) {
    id
    name
    status
    project {
      id
      name
      status
      createdAt
      updatedAt
      __typename
    }
    template {
      id
      name
      description
      type
      version
      is_latest
      createdAt
      updatedAt
      templateTemplatesId
      __typename
    }
    rawData {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    projectTreesId
    templateTreesId
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateTreeSubscriptionVariables,
  APITypes.OnCreateTreeSubscription
>;
export const onUpdateTree = /* GraphQL */ `subscription OnUpdateTree($filter: ModelSubscriptionTreeFilterInput) {
  onUpdateTree(filter: $filter) {
    id
    name
    status
    project {
      id
      name
      status
      createdAt
      updatedAt
      __typename
    }
    template {
      id
      name
      description
      type
      version
      is_latest
      createdAt
      updatedAt
      templateTemplatesId
      __typename
    }
    rawData {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    projectTreesId
    templateTreesId
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateTreeSubscriptionVariables,
  APITypes.OnUpdateTreeSubscription
>;
export const onDeleteTree = /* GraphQL */ `subscription OnDeleteTree($filter: ModelSubscriptionTreeFilterInput) {
  onDeleteTree(filter: $filter) {
    id
    name
    status
    project {
      id
      name
      status
      createdAt
      updatedAt
      __typename
    }
    template {
      id
      name
      description
      type
      version
      is_latest
      createdAt
      updatedAt
      templateTemplatesId
      __typename
    }
    rawData {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    projectTreesId
    templateTreesId
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteTreeSubscriptionVariables,
  APITypes.OnDeleteTreeSubscription
>;
export const onCreateTemplateFeature = /* GraphQL */ `subscription OnCreateTemplateFeature(
  $filter: ModelSubscriptionTemplateFeatureFilterInput
) {
  onCreateTemplateFeature(filter: $filter) {
    id
    template {
      id
      name
      description
      type
      version
      is_latest
      createdAt
      updatedAt
      templateTemplatesId
      __typename
    }
    feature {
      id
      feature_type
      name
      description
      feature_group
      default_value
      is_float
      createdAt
      updatedAt
      unitOfMeasureFeaturesId
      __typename
    }
    createdAt
    updatedAt
    templateTemplateFeaturesId
    featureTemplateFeaturesId
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateTemplateFeatureSubscriptionVariables,
  APITypes.OnCreateTemplateFeatureSubscription
>;
export const onUpdateTemplateFeature = /* GraphQL */ `subscription OnUpdateTemplateFeature(
  $filter: ModelSubscriptionTemplateFeatureFilterInput
) {
  onUpdateTemplateFeature(filter: $filter) {
    id
    template {
      id
      name
      description
      type
      version
      is_latest
      createdAt
      updatedAt
      templateTemplatesId
      __typename
    }
    feature {
      id
      feature_type
      name
      description
      feature_group
      default_value
      is_float
      createdAt
      updatedAt
      unitOfMeasureFeaturesId
      __typename
    }
    createdAt
    updatedAt
    templateTemplateFeaturesId
    featureTemplateFeaturesId
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateTemplateFeatureSubscriptionVariables,
  APITypes.OnUpdateTemplateFeatureSubscription
>;
export const onDeleteTemplateFeature = /* GraphQL */ `subscription OnDeleteTemplateFeature(
  $filter: ModelSubscriptionTemplateFeatureFilterInput
) {
  onDeleteTemplateFeature(filter: $filter) {
    id
    template {
      id
      name
      description
      type
      version
      is_latest
      createdAt
      updatedAt
      templateTemplatesId
      __typename
    }
    feature {
      id
      feature_type
      name
      description
      feature_group
      default_value
      is_float
      createdAt
      updatedAt
      unitOfMeasureFeaturesId
      __typename
    }
    createdAt
    updatedAt
    templateTemplateFeaturesId
    featureTemplateFeaturesId
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteTemplateFeatureSubscriptionVariables,
  APITypes.OnDeleteTemplateFeatureSubscription
>;
export const onCreateFeature = /* GraphQL */ `subscription OnCreateFeature($filter: ModelSubscriptionFeatureFilterInput) {
  onCreateFeature(filter: $filter) {
    id
    feature_type
    name
    description
    feature_group
    default_value
    is_float
    unitOfMeasure {
      id
      name
      abbreviation
      createdAt
      updatedAt
      __typename
    }
    templateFeatures {
      nextToken
      __typename
    }
    rawDatas {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    unitOfMeasureFeaturesId
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateFeatureSubscriptionVariables,
  APITypes.OnCreateFeatureSubscription
>;
export const onUpdateFeature = /* GraphQL */ `subscription OnUpdateFeature($filter: ModelSubscriptionFeatureFilterInput) {
  onUpdateFeature(filter: $filter) {
    id
    feature_type
    name
    description
    feature_group
    default_value
    is_float
    unitOfMeasure {
      id
      name
      abbreviation
      createdAt
      updatedAt
      __typename
    }
    templateFeatures {
      nextToken
      __typename
    }
    rawDatas {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    unitOfMeasureFeaturesId
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateFeatureSubscriptionVariables,
  APITypes.OnUpdateFeatureSubscription
>;
export const onDeleteFeature = /* GraphQL */ `subscription OnDeleteFeature($filter: ModelSubscriptionFeatureFilterInput) {
  onDeleteFeature(filter: $filter) {
    id
    feature_type
    name
    description
    feature_group
    default_value
    is_float
    unitOfMeasure {
      id
      name
      abbreviation
      createdAt
      updatedAt
      __typename
    }
    templateFeatures {
      nextToken
      __typename
    }
    rawDatas {
      nextToken
      __typename
    }
    createdAt
    updatedAt
    unitOfMeasureFeaturesId
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteFeatureSubscriptionVariables,
  APITypes.OnDeleteFeatureSubscription
>;
export const onCreateRawData = /* GraphQL */ `subscription OnCreateRawData($filter: ModelSubscriptionRawDataFilterInput) {
  onCreateRawData(filter: $filter) {
    id
    name
    valueFloat
    valueString
    start_date
    end_date
    feature {
      id
      feature_type
      name
      description
      feature_group
      default_value
      is_float
      createdAt
      updatedAt
      unitOfMeasureFeaturesId
      __typename
    }
    tree {
      id
      name
      status
      createdAt
      updatedAt
      projectTreesId
      templateTreesId
      __typename
    }
    createdAt
    updatedAt
    treeRawDataId
    featureRawDatasId
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnCreateRawDataSubscriptionVariables,
  APITypes.OnCreateRawDataSubscription
>;
export const onUpdateRawData = /* GraphQL */ `subscription OnUpdateRawData($filter: ModelSubscriptionRawDataFilterInput) {
  onUpdateRawData(filter: $filter) {
    id
    name
    valueFloat
    valueString
    start_date
    end_date
    feature {
      id
      feature_type
      name
      description
      feature_group
      default_value
      is_float
      createdAt
      updatedAt
      unitOfMeasureFeaturesId
      __typename
    }
    tree {
      id
      name
      status
      createdAt
      updatedAt
      projectTreesId
      templateTreesId
      __typename
    }
    createdAt
    updatedAt
    treeRawDataId
    featureRawDatasId
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnUpdateRawDataSubscriptionVariables,
  APITypes.OnUpdateRawDataSubscription
>;
export const onDeleteRawData = /* GraphQL */ `subscription OnDeleteRawData($filter: ModelSubscriptionRawDataFilterInput) {
  onDeleteRawData(filter: $filter) {
    id
    name
    valueFloat
    valueString
    start_date
    end_date
    feature {
      id
      feature_type
      name
      description
      feature_group
      default_value
      is_float
      createdAt
      updatedAt
      unitOfMeasureFeaturesId
      __typename
    }
    tree {
      id
      name
      status
      createdAt
      updatedAt
      projectTreesId
      templateTreesId
      __typename
    }
    createdAt
    updatedAt
    treeRawDataId
    featureRawDatasId
    __typename
  }
}
` as GeneratedSubscription<
  APITypes.OnDeleteRawDataSubscriptionVariables,
  APITypes.OnDeleteRawDataSubscription
>;
