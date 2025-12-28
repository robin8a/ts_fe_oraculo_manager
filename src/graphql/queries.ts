/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedQuery<InputType, OutputType> = string & {
  __generatedQueryInput: InputType;
  __generatedQueryOutput: OutputType;
};

export const getModelAI = /* GraphQL */ `query GetModelAI($id: ID!) {
  getModelAI(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetModelAIQueryVariables,
  APITypes.GetModelAIQuery
>;
export const listModelAIS = /* GraphQL */ `query ListModelAIS(
  $filter: ModelModelAIFilterInput
  $limit: Int
  $nextToken: String
) {
  listModelAIS(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListModelAISQueryVariables,
  APITypes.ListModelAISQuery
>;
export const getCalculation = /* GraphQL */ `query GetCalculation($id: ID!) {
  getCalculation(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetCalculationQueryVariables,
  APITypes.GetCalculationQuery
>;
export const listCalculations = /* GraphQL */ `query ListCalculations(
  $filter: ModelCalculationFilterInput
  $limit: Int
  $nextToken: String
) {
  listCalculations(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      polygon
      start_date
      end_date
      satellite_TIF
      result_TIF
      result_PNG
      is_to_block_chain
      createdAt
      updatedAt
      modelAICalculationsId
      userCalculationsId
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListCalculationsQueryVariables,
  APITypes.ListCalculationsQuery
>;
export const getUser = /* GraphQL */ `query GetUser($id: ID!) {
  getUser(id: $id) {
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
` as GeneratedQuery<APITypes.GetUserQueryVariables, APITypes.GetUserQuery>;
export const listUsers = /* GraphQL */ `query ListUsers(
  $filter: ModelUserFilterInput
  $limit: Int
  $nextToken: String
) {
  listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<APITypes.ListUsersQueryVariables, APITypes.ListUsersQuery>;
export const getModelPackage = /* GraphQL */ `query GetModelPackage($id: ID!) {
  getModelPackage(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetModelPackageQueryVariables,
  APITypes.GetModelPackageQuery
>;
export const listModelPackages = /* GraphQL */ `query ListModelPackages(
  $filter: ModelModelPackageFilterInput
  $limit: Int
  $nextToken: String
) {
  listModelPackages(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      tokenAmount
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListModelPackagesQueryVariables,
  APITypes.ListModelPackagesQuery
>;
export const getUserModelPackage = /* GraphQL */ `query GetUserModelPackage($id: ID!) {
  getUserModelPackage(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetUserModelPackageQueryVariables,
  APITypes.GetUserModelPackageQuery
>;
export const listUserModelPackages = /* GraphQL */ `query ListUserModelPackages(
  $filter: ModelUserModelPackageFilterInput
  $limit: Int
  $nextToken: String
) {
  listUserModelPackages(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      createdAt
      updatedAt
      userUser_model_packagesId
      modelPackageUser_model_packagesId
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListUserModelPackagesQueryVariables,
  APITypes.ListUserModelPackagesQuery
>;
export const getProyecto = /* GraphQL */ `query GetProyecto($id: ID!) {
  getProyecto(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetProyectoQueryVariables,
  APITypes.GetProyectoQuery
>;
export const listProyectos = /* GraphQL */ `query ListProyectos(
  $filter: ModelProyectoFilterInput
  $limit: Int
  $nextToken: String
) {
  listProyectos(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListProyectosQueryVariables,
  APITypes.ListProyectosQuery
>;
export const getConsultaAnalisis = /* GraphQL */ `query GetConsultaAnalisis($id: ID!) {
  getConsultaAnalisis(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetConsultaAnalisisQueryVariables,
  APITypes.GetConsultaAnalisisQuery
>;
export const listConsultaAnalises = /* GraphQL */ `query ListConsultaAnalises(
  $filter: ModelConsultaAnalisisFilterInput
  $limit: Int
  $nextToken: String
) {
  listConsultaAnalises(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListConsultaAnalisesQueryVariables,
  APITypes.ListConsultaAnalisesQuery
>;
export const getConsultaEstado = /* GraphQL */ `query GetConsultaEstado($id: ID!) {
  getConsultaEstado(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetConsultaEstadoQueryVariables,
  APITypes.GetConsultaEstadoQuery
>;
export const listConsultaEstados = /* GraphQL */ `query ListConsultaEstados(
  $filter: ModelConsultaEstadoFilterInput
  $limit: Int
  $nextToken: String
) {
  listConsultaEstados(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      consultaId
      estado
      estadoFecha
      estadoUsername
      estadoObservaciones
      estadoTipoActor
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListConsultaEstadosQueryVariables,
  APITypes.ListConsultaEstadosQuery
>;
export const getAnalisisCuota = /* GraphQL */ `query GetAnalisisCuota($id: ID!) {
  getAnalisisCuota(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetAnalisisCuotaQueryVariables,
  APITypes.GetAnalisisCuotaQuery
>;
export const listAnalisisCuotas = /* GraphQL */ `query ListAnalisisCuotas(
  $filter: ModelAnalisisCuotaFilterInput
  $limit: Int
  $nextToken: String
) {
  listAnalisisCuotas(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListAnalisisCuotasQueryVariables,
  APITypes.ListAnalisisCuotasQuery
>;
export const getAnalisisCuotasUsoDiario = /* GraphQL */ `query GetAnalisisCuotasUsoDiario($id: ID!) {
  getAnalisisCuotasUsoDiario(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetAnalisisCuotasUsoDiarioQueryVariables,
  APITypes.GetAnalisisCuotasUsoDiarioQuery
>;
export const listAnalisisCuotasUsoDiarios = /* GraphQL */ `query ListAnalisisCuotasUsoDiarios(
  $filter: ModelAnalisisCuotasUsoDiarioFilterInput
  $limit: Int
  $nextToken: String
) {
  listAnalisisCuotasUsoDiarios(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      usuarioNombre
      grupoId
      fechaUso
      consultaId
      creadoEn
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListAnalisisCuotasUsoDiariosQueryVariables,
  APITypes.ListAnalisisCuotasUsoDiariosQuery
>;
export const getDispositivoIot = /* GraphQL */ `query GetDispositivoIot($id: ID!) {
  getDispositivoIot(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetDispositivoIotQueryVariables,
  APITypes.GetDispositivoIotQuery
>;
export const listDispositivoIots = /* GraphQL */ `query ListDispositivoIots(
  $filter: ModelDispositivoIotFilterInput
  $limit: Int
  $nextToken: String
) {
  listDispositivoIots(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListDispositivoIotsQueryVariables,
  APITypes.ListDispositivoIotsQuery
>;
export const getGrupoIot = /* GraphQL */ `query GetGrupoIot($id: ID!) {
  getGrupoIot(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetGrupoIotQueryVariables,
  APITypes.GetGrupoIotQuery
>;
export const listGrupoIots = /* GraphQL */ `query ListGrupoIots(
  $filter: ModelGrupoIotFilterInput
  $limit: Int
  $nextToken: String
) {
  listGrupoIots(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListGrupoIotsQueryVariables,
  APITypes.ListGrupoIotsQuery
>;
export const getRelDispositivoGrupoIot = /* GraphQL */ `query GetRelDispositivoGrupoIot($id: ID!) {
  getRelDispositivoGrupoIot(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetRelDispositivoGrupoIotQueryVariables,
  APITypes.GetRelDispositivoGrupoIotQuery
>;
export const listRelDispositivoGrupoIots = /* GraphQL */ `query ListRelDispositivoGrupoIots(
  $filter: ModelRelDispositivoGrupoIotFilterInput
  $limit: Int
  $nextToken: String
) {
  listRelDispositivoGrupoIots(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      dispositivoId
      grupoId
      fechaAsignacion
      usuarioId
      notas
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListRelDispositivoGrupoIotsQueryVariables,
  APITypes.ListRelDispositivoGrupoIotsQuery
>;
export const getRelGrupoIotProyecto = /* GraphQL */ `query GetRelGrupoIotProyecto($id: ID!) {
  getRelGrupoIotProyecto(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetRelGrupoIotProyectoQueryVariables,
  APITypes.GetRelGrupoIotProyectoQuery
>;
export const listRelGrupoIotProyectos = /* GraphQL */ `query ListRelGrupoIotProyectos(
  $filter: ModelRelGrupoIotProyectoFilterInput
  $limit: Int
  $nextToken: String
) {
  listRelGrupoIotProyectos(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      grupoId
      proyectoId
      fechaAsignacion
      usuarioId
      notas
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListRelGrupoIotProyectosQueryVariables,
  APITypes.ListRelGrupoIotProyectosQuery
>;
export const getMedicionIot = /* GraphQL */ `query GetMedicionIot($id: ID!) {
  getMedicionIot(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetMedicionIotQueryVariables,
  APITypes.GetMedicionIotQuery
>;
export const listMedicionIots = /* GraphQL */ `query ListMedicionIots(
  $filter: ModelMedicionIotFilterInput
  $limit: Int
  $nextToken: String
) {
  listMedicionIots(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      dispositivoId
      deviceId
      departamento
      zona
      variable
      valor
      timestamp
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListMedicionIotsQueryVariables,
  APITypes.ListMedicionIotsQuery
>;
export const getProyectoLegacy = /* GraphQL */ `query GetProyectoLegacy($id: ID!) {
  getProyectoLegacy(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetProyectoLegacyQueryVariables,
  APITypes.GetProyectoLegacyQuery
>;
export const listProyectoLegacies = /* GraphQL */ `query ListProyectoLegacies(
  $filter: ModelProyectoLegacyFilterInput
  $limit: Int
  $nextToken: String
) {
  listProyectoLegacies(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      projectId
      descripcion
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListProyectoLegaciesQueryVariables,
  APITypes.ListProyectoLegaciesQuery
>;
export const getConsultaWeb = /* GraphQL */ `query GetConsultaWeb($id: ID!) {
  getConsultaWeb(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetConsultaWebQueryVariables,
  APITypes.GetConsultaWebQuery
>;
export const listConsultaWebs = /* GraphQL */ `query ListConsultaWebs(
  $filter: ModelConsultaWebFilterInput
  $limit: Int
  $nextToken: String
) {
  listConsultaWebs(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListConsultaWebsQueryVariables,
  APITypes.ListConsultaWebsQuery
>;
export const getConsultaApi = /* GraphQL */ `query GetConsultaApi($id: ID!) {
  getConsultaApi(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetConsultaApiQueryVariables,
  APITypes.GetConsultaApiQuery
>;
export const listConsultaApis = /* GraphQL */ `query ListConsultaApis(
  $filter: ModelConsultaApiFilterInput
  $limit: Int
  $nextToken: String
) {
  listConsultaApis(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListConsultaApisQueryVariables,
  APITypes.ListConsultaApisQuery
>;
export const getIotSession = /* GraphQL */ `query GetIotSession($id: ID!) {
  getIotSession(id: $id) {
    id
    sessionId
    iotData
    createdAt
    expiresAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetIotSessionQueryVariables,
  APITypes.GetIotSessionQuery
>;
export const listIotSessions = /* GraphQL */ `query ListIotSessions(
  $filter: ModelIotSessionFilterInput
  $limit: Int
  $nextToken: String
) {
  listIotSessions(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      sessionId
      iotData
      createdAt
      expiresAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListIotSessionsQueryVariables,
  APITypes.ListIotSessionsQuery
>;
export const getConstructorFormulaCategoria = /* GraphQL */ `query GetConstructorFormulaCategoria($id: ID!) {
  getConstructorFormulaCategoria(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetConstructorFormulaCategoriaQueryVariables,
  APITypes.GetConstructorFormulaCategoriaQuery
>;
export const listConstructorFormulaCategorias = /* GraphQL */ `query ListConstructorFormulaCategorias(
  $filter: ModelConstructorFormulaCategoriaFilterInput
  $limit: Int
  $nextToken: String
) {
  listConstructorFormulaCategorias(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      nombre
      estado
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListConstructorFormulaCategoriasQueryVariables,
  APITypes.ListConstructorFormulaCategoriasQuery
>;
export const getConstructorFormulaVariable = /* GraphQL */ `query GetConstructorFormulaVariable($id: ID!) {
  getConstructorFormulaVariable(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetConstructorFormulaVariableQueryVariables,
  APITypes.GetConstructorFormulaVariableQuery
>;
export const listConstructorFormulaVariables = /* GraphQL */ `query ListConstructorFormulaVariables(
  $filter: ModelConstructorFormulaVariableFilterInput
  $limit: Int
  $nextToken: String
) {
  listConstructorFormulaVariables(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListConstructorFormulaVariablesQueryVariables,
  APITypes.ListConstructorFormulaVariablesQuery
>;
export const getConstructorFormula = /* GraphQL */ `query GetConstructorFormula($id: ID!) {
  getConstructorFormula(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetConstructorFormulaQueryVariables,
  APITypes.GetConstructorFormulaQuery
>;
export const listConstructorFormulas = /* GraphQL */ `query ListConstructorFormulas(
  $filter: ModelConstructorFormulaFilterInput
  $limit: Int
  $nextToken: String
) {
  listConstructorFormulas(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListConstructorFormulasQueryVariables,
  APITypes.ListConstructorFormulasQuery
>;
export const getConstructorFormulaVariableRel = /* GraphQL */ `query GetConstructorFormulaVariableRel($id: ID!) {
  getConstructorFormulaVariableRel(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetConstructorFormulaVariableRelQueryVariables,
  APITypes.GetConstructorFormulaVariableRelQuery
>;
export const listConstructorFormulaVariableRels = /* GraphQL */ `query ListConstructorFormulaVariableRels(
  $filter: ModelConstructorFormulaVariableRelFilterInput
  $limit: Int
  $nextToken: String
) {
  listConstructorFormulaVariableRels(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      formulaId
      variableId
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListConstructorFormulaVariableRelsQueryVariables,
  APITypes.ListConstructorFormulaVariableRelsQuery
>;
export const getFormulaTeledeteccion = /* GraphQL */ `query GetFormulaTeledeteccion($id: ID!) {
  getFormulaTeledeteccion(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetFormulaTeledeteccionQueryVariables,
  APITypes.GetFormulaTeledeteccionQuery
>;
export const listFormulaTeledeteccions = /* GraphQL */ `query ListFormulaTeledeteccions(
  $filter: ModelFormulaTeledeteccionFilterInput
  $limit: Int
  $nextToken: String
) {
  listFormulaTeledeteccions(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      formulaId
      codigoScript
      tipoEntrada
      parametrosJson
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListFormulaTeledeteccionsQueryVariables,
  APITypes.ListFormulaTeledeteccionsQuery
>;
export const getFormulaDeepLearning = /* GraphQL */ `query GetFormulaDeepLearning($id: ID!) {
  getFormulaDeepLearning(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetFormulaDeepLearningQueryVariables,
  APITypes.GetFormulaDeepLearningQuery
>;
export const listFormulaDeepLearnings = /* GraphQL */ `query ListFormulaDeepLearnings(
  $filter: ModelFormulaDeepLearningFilterInput
  $limit: Int
  $nextToken: String
) {
  listFormulaDeepLearnings(
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      formulaId
      rutaModelo
      rutaEtiquetas
      parametrosJson
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListFormulaDeepLearningsQueryVariables,
  APITypes.ListFormulaDeepLearningsQuery
>;
export const getFormulaHistorial = /* GraphQL */ `query GetFormulaHistorial($id: ID!) {
  getFormulaHistorial(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetFormulaHistorialQueryVariables,
  APITypes.GetFormulaHistorialQuery
>;
export const listFormulaHistorials = /* GraphQL */ `query ListFormulaHistorials(
  $filter: ModelFormulaHistorialFilterInput
  $limit: Int
  $nextToken: String
) {
  listFormulaHistorials(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      formulaId
      version
      fechaModificacion
      datosJson
      usuarioId
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListFormulaHistorialsQueryVariables,
  APITypes.ListFormulaHistorialsQuery
>;
export const getAccessDeadline = /* GraphQL */ `query GetAccessDeadline($id: ID!) {
  getAccessDeadline(id: $id) {
    id
    subjectType
    subjectKey
    deadline
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetAccessDeadlineQueryVariables,
  APITypes.GetAccessDeadlineQuery
>;
export const listAccessDeadlines = /* GraphQL */ `query ListAccessDeadlines(
  $filter: ModelAccessDeadlineFilterInput
  $limit: Int
  $nextToken: String
) {
  listAccessDeadlines(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      subjectType
      subjectKey
      deadline
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListAccessDeadlinesQueryVariables,
  APITypes.ListAccessDeadlinesQuery
>;
export const getRoutePermission = /* GraphQL */ `query GetRoutePermission($id: ID!) {
  getRoutePermission(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetRoutePermissionQueryVariables,
  APITypes.GetRoutePermissionQuery
>;
export const listRoutePermissions = /* GraphQL */ `query ListRoutePermissions(
  $filter: ModelRoutePermissionFilterInput
  $limit: Int
  $nextToken: String
) {
  listRoutePermissions(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListRoutePermissionsQueryVariables,
  APITypes.ListRoutePermissionsQuery
>;
export const getApiCredential = /* GraphQL */ `query GetApiCredential($id: ID!) {
  getApiCredential(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetApiCredentialQueryVariables,
  APITypes.GetApiCredentialQuery
>;
export const listApiCredentials = /* GraphQL */ `query ListApiCredentials(
  $filter: ModelApiCredentialFilterInput
  $limit: Int
  $nextToken: String
) {
  listApiCredentials(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListApiCredentialsQueryVariables,
  APITypes.ListApiCredentialsQuery
>;
export const getPermVersion = /* GraphQL */ `query GetPermVersion($id: ID!) {
  getPermVersion(id: $id) {
    id
    updatedAt
    createdAt
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GetPermVersionQueryVariables,
  APITypes.GetPermVersionQuery
>;
export const listPermVersions = /* GraphQL */ `query ListPermVersions(
  $filter: ModelPermVersionFilterInput
  $limit: Int
  $nextToken: String
) {
  listPermVersions(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      updatedAt
      createdAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListPermVersionsQueryVariables,
  APITypes.ListPermVersionsQuery
>;
export const getUnitOfMeasure = /* GraphQL */ `query GetUnitOfMeasure($id: ID!) {
  getUnitOfMeasure(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetUnitOfMeasureQueryVariables,
  APITypes.GetUnitOfMeasureQuery
>;
export const listUnitOfMeasures = /* GraphQL */ `query ListUnitOfMeasures(
  $filter: ModelUnitOfMeasureFilterInput
  $limit: Int
  $nextToken: String
) {
  listUnitOfMeasures(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      name
      abbreviation
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListUnitOfMeasuresQueryVariables,
  APITypes.ListUnitOfMeasuresQuery
>;
export const getProject = /* GraphQL */ `query GetProject($id: ID!) {
  getProject(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetProjectQueryVariables,
  APITypes.GetProjectQuery
>;
export const listProjects = /* GraphQL */ `query ListProjects(
  $filter: ModelProjectFilterInput
  $limit: Int
  $nextToken: String
) {
  listProjects(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      name
      status
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListProjectsQueryVariables,
  APITypes.ListProjectsQuery
>;
export const getTemplate = /* GraphQL */ `query GetTemplate($id: ID!) {
  getTemplate(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetTemplateQueryVariables,
  APITypes.GetTemplateQuery
>;
export const listTemplates = /* GraphQL */ `query ListTemplates(
  $filter: ModelTemplateFilterInput
  $limit: Int
  $nextToken: String
) {
  listTemplates(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListTemplatesQueryVariables,
  APITypes.ListTemplatesQuery
>;
export const getTree = /* GraphQL */ `query GetTree($id: ID!) {
  getTree(id: $id) {
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
` as GeneratedQuery<APITypes.GetTreeQueryVariables, APITypes.GetTreeQuery>;
export const listTrees = /* GraphQL */ `query ListTrees(
  $filter: ModelTreeFilterInput
  $limit: Int
  $nextToken: String
) {
  listTrees(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      name
      status
      createdAt
      updatedAt
      projectTreesId
      templateTreesId
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<APITypes.ListTreesQueryVariables, APITypes.ListTreesQuery>;
export const getTemplateFeature = /* GraphQL */ `query GetTemplateFeature($id: ID!) {
  getTemplateFeature(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetTemplateFeatureQueryVariables,
  APITypes.GetTemplateFeatureQuery
>;
export const listTemplateFeatures = /* GraphQL */ `query ListTemplateFeatures(
  $filter: ModelTemplateFeatureFilterInput
  $limit: Int
  $nextToken: String
) {
  listTemplateFeatures(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      createdAt
      updatedAt
      templateTemplateFeaturesId
      featureTemplateFeaturesId
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListTemplateFeaturesQueryVariables,
  APITypes.ListTemplateFeaturesQuery
>;
export const getFeature = /* GraphQL */ `query GetFeature($id: ID!) {
  getFeature(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetFeatureQueryVariables,
  APITypes.GetFeatureQuery
>;
export const listFeatures = /* GraphQL */ `query ListFeatures(
  $filter: ModelFeatureFilterInput
  $limit: Int
  $nextToken: String
) {
  listFeatures(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListFeaturesQueryVariables,
  APITypes.ListFeaturesQuery
>;
export const getRawData = /* GraphQL */ `query GetRawData($id: ID!) {
  getRawData(id: $id) {
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
` as GeneratedQuery<
  APITypes.GetRawDataQueryVariables,
  APITypes.GetRawDataQuery
>;
export const listRawData = /* GraphQL */ `query ListRawData(
  $filter: ModelRawDataFilterInput
  $limit: Int
  $nextToken: String
) {
  listRawData(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      name
      valueFloat
      valueString
      start_date
      end_date
      createdAt
      updatedAt
      treeRawDataId
      featureRawDatasId
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ListRawDataQueryVariables,
  APITypes.ListRawDataQuery
>;
export const consultaAnalisesByProyectoId = /* GraphQL */ `query ConsultaAnalisesByProyectoId(
  $proyectoId: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelConsultaAnalisisFilterInput
  $limit: Int
  $nextToken: String
) {
  consultaAnalisesByProyectoId(
    proyectoId: $proyectoId
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ConsultaAnalisesByProyectoIdQueryVariables,
  APITypes.ConsultaAnalisesByProyectoIdQuery
>;
export const consultaEstadosByConsultaId = /* GraphQL */ `query ConsultaEstadosByConsultaId(
  $consultaId: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelConsultaEstadoFilterInput
  $limit: Int
  $nextToken: String
) {
  consultaEstadosByConsultaId(
    consultaId: $consultaId
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      consultaId
      estado
      estadoFecha
      estadoUsername
      estadoObservaciones
      estadoTipoActor
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ConsultaEstadosByConsultaIdQueryVariables,
  APITypes.ConsultaEstadosByConsultaIdQuery
>;
export const analisisCuotasByNombreGrupo = /* GraphQL */ `query AnalisisCuotasByNombreGrupo(
  $nombreGrupo: String!
  $sortDirection: ModelSortDirection
  $filter: ModelAnalisisCuotaFilterInput
  $limit: Int
  $nextToken: String
) {
  analisisCuotasByNombreGrupo(
    nombreGrupo: $nombreGrupo
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.AnalisisCuotasByNombreGrupoQueryVariables,
  APITypes.AnalisisCuotasByNombreGrupoQuery
>;
export const analisisCuotasUsoDiariosByUsuarioNombre = /* GraphQL */ `query AnalisisCuotasUsoDiariosByUsuarioNombre(
  $usuarioNombre: String!
  $sortDirection: ModelSortDirection
  $filter: ModelAnalisisCuotasUsoDiarioFilterInput
  $limit: Int
  $nextToken: String
) {
  analisisCuotasUsoDiariosByUsuarioNombre(
    usuarioNombre: $usuarioNombre
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      usuarioNombre
      grupoId
      fechaUso
      consultaId
      creadoEn
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.AnalisisCuotasUsoDiariosByUsuarioNombreQueryVariables,
  APITypes.AnalisisCuotasUsoDiariosByUsuarioNombreQuery
>;
export const analisisCuotasUsoDiariosByGrupoId = /* GraphQL */ `query AnalisisCuotasUsoDiariosByGrupoId(
  $grupoId: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelAnalisisCuotasUsoDiarioFilterInput
  $limit: Int
  $nextToken: String
) {
  analisisCuotasUsoDiariosByGrupoId(
    grupoId: $grupoId
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      usuarioNombre
      grupoId
      fechaUso
      consultaId
      creadoEn
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.AnalisisCuotasUsoDiariosByGrupoIdQueryVariables,
  APITypes.AnalisisCuotasUsoDiariosByGrupoIdQuery
>;
export const analisisCuotasUsoDiariosByFechaUso = /* GraphQL */ `query AnalisisCuotasUsoDiariosByFechaUso(
  $fechaUso: AWSDateTime!
  $sortDirection: ModelSortDirection
  $filter: ModelAnalisisCuotasUsoDiarioFilterInput
  $limit: Int
  $nextToken: String
) {
  analisisCuotasUsoDiariosByFechaUso(
    fechaUso: $fechaUso
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      usuarioNombre
      grupoId
      fechaUso
      consultaId
      creadoEn
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.AnalisisCuotasUsoDiariosByFechaUsoQueryVariables,
  APITypes.AnalisisCuotasUsoDiariosByFechaUsoQuery
>;
export const analisisCuotasUsoDiariosByConsultaId = /* GraphQL */ `query AnalisisCuotasUsoDiariosByConsultaId(
  $consultaId: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelAnalisisCuotasUsoDiarioFilterInput
  $limit: Int
  $nextToken: String
) {
  analisisCuotasUsoDiariosByConsultaId(
    consultaId: $consultaId
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      usuarioNombre
      grupoId
      fechaUso
      consultaId
      creadoEn
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.AnalisisCuotasUsoDiariosByConsultaIdQueryVariables,
  APITypes.AnalisisCuotasUsoDiariosByConsultaIdQuery
>;
export const dispositivoIotsByDeviceId = /* GraphQL */ `query DispositivoIotsByDeviceId(
  $deviceId: String!
  $sortDirection: ModelSortDirection
  $filter: ModelDispositivoIotFilterInput
  $limit: Int
  $nextToken: String
) {
  dispositivoIotsByDeviceId(
    deviceId: $deviceId
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.DispositivoIotsByDeviceIdQueryVariables,
  APITypes.DispositivoIotsByDeviceIdQuery
>;
export const grupoIotsByNombre = /* GraphQL */ `query GrupoIotsByNombre(
  $nombre: String!
  $sortDirection: ModelSortDirection
  $filter: ModelGrupoIotFilterInput
  $limit: Int
  $nextToken: String
) {
  grupoIotsByNombre(
    nombre: $nombre
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.GrupoIotsByNombreQueryVariables,
  APITypes.GrupoIotsByNombreQuery
>;
export const relDispositivoGrupoIotsByDispositivoId = /* GraphQL */ `query RelDispositivoGrupoIotsByDispositivoId(
  $dispositivoId: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelRelDispositivoGrupoIotFilterInput
  $limit: Int
  $nextToken: String
) {
  relDispositivoGrupoIotsByDispositivoId(
    dispositivoId: $dispositivoId
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      dispositivoId
      grupoId
      fechaAsignacion
      usuarioId
      notas
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.RelDispositivoGrupoIotsByDispositivoIdQueryVariables,
  APITypes.RelDispositivoGrupoIotsByDispositivoIdQuery
>;
export const relDispositivoGrupoIotsByGrupoId = /* GraphQL */ `query RelDispositivoGrupoIotsByGrupoId(
  $grupoId: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelRelDispositivoGrupoIotFilterInput
  $limit: Int
  $nextToken: String
) {
  relDispositivoGrupoIotsByGrupoId(
    grupoId: $grupoId
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      dispositivoId
      grupoId
      fechaAsignacion
      usuarioId
      notas
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.RelDispositivoGrupoIotsByGrupoIdQueryVariables,
  APITypes.RelDispositivoGrupoIotsByGrupoIdQuery
>;
export const relGrupoIotProyectosByGrupoId = /* GraphQL */ `query RelGrupoIotProyectosByGrupoId(
  $grupoId: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelRelGrupoIotProyectoFilterInput
  $limit: Int
  $nextToken: String
) {
  relGrupoIotProyectosByGrupoId(
    grupoId: $grupoId
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      grupoId
      proyectoId
      fechaAsignacion
      usuarioId
      notas
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.RelGrupoIotProyectosByGrupoIdQueryVariables,
  APITypes.RelGrupoIotProyectosByGrupoIdQuery
>;
export const relGrupoIotProyectosByProyectoId = /* GraphQL */ `query RelGrupoIotProyectosByProyectoId(
  $proyectoId: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelRelGrupoIotProyectoFilterInput
  $limit: Int
  $nextToken: String
) {
  relGrupoIotProyectosByProyectoId(
    proyectoId: $proyectoId
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      grupoId
      proyectoId
      fechaAsignacion
      usuarioId
      notas
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.RelGrupoIotProyectosByProyectoIdQueryVariables,
  APITypes.RelGrupoIotProyectosByProyectoIdQuery
>;
export const medicionIotsByDispositivoId = /* GraphQL */ `query MedicionIotsByDispositivoId(
  $dispositivoId: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelMedicionIotFilterInput
  $limit: Int
  $nextToken: String
) {
  medicionIotsByDispositivoId(
    dispositivoId: $dispositivoId
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      dispositivoId
      deviceId
      departamento
      zona
      variable
      valor
      timestamp
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.MedicionIotsByDispositivoIdQueryVariables,
  APITypes.MedicionIotsByDispositivoIdQuery
>;
export const medicionIotsByDeviceId = /* GraphQL */ `query MedicionIotsByDeviceId(
  $deviceId: String!
  $sortDirection: ModelSortDirection
  $filter: ModelMedicionIotFilterInput
  $limit: Int
  $nextToken: String
) {
  medicionIotsByDeviceId(
    deviceId: $deviceId
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      dispositivoId
      deviceId
      departamento
      zona
      variable
      valor
      timestamp
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.MedicionIotsByDeviceIdQueryVariables,
  APITypes.MedicionIotsByDeviceIdQuery
>;
export const medicionIotsByTimestamp = /* GraphQL */ `query MedicionIotsByTimestamp(
  $timestamp: AWSDateTime!
  $sortDirection: ModelSortDirection
  $filter: ModelMedicionIotFilterInput
  $limit: Int
  $nextToken: String
) {
  medicionIotsByTimestamp(
    timestamp: $timestamp
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      dispositivoId
      deviceId
      departamento
      zona
      variable
      valor
      timestamp
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.MedicionIotsByTimestampQueryVariables,
  APITypes.MedicionIotsByTimestampQuery
>;
export const proyectoLegaciesByProjectId = /* GraphQL */ `query ProyectoLegaciesByProjectId(
  $projectId: String!
  $sortDirection: ModelSortDirection
  $filter: ModelProyectoLegacyFilterInput
  $limit: Int
  $nextToken: String
) {
  proyectoLegaciesByProjectId(
    projectId: $projectId
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      projectId
      descripcion
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ProyectoLegaciesByProjectIdQueryVariables,
  APITypes.ProyectoLegaciesByProjectIdQuery
>;
export const consultaWebsByProjectID = /* GraphQL */ `query ConsultaWebsByProjectID(
  $projectID: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelConsultaWebFilterInput
  $limit: Int
  $nextToken: String
) {
  consultaWebsByProjectID(
    projectID: $projectID
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
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
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ConsultaWebsByProjectIDQueryVariables,
  APITypes.ConsultaWebsByProjectIDQuery
>;
export const consultaWebsByFechaHoraConsulta = /* GraphQL */ `query ConsultaWebsByFechaHoraConsulta(
  $fechaHoraConsulta: AWSDateTime!
  $sortDirection: ModelSortDirection
  $filter: ModelConsultaWebFilterInput
  $limit: Int
  $nextToken: String
) {
  consultaWebsByFechaHoraConsulta(
    fechaHoraConsulta: $fechaHoraConsulta
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
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
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ConsultaWebsByFechaHoraConsultaQueryVariables,
  APITypes.ConsultaWebsByFechaHoraConsultaQuery
>;
export const consultaApisByFechaHoraConsulta = /* GraphQL */ `query ConsultaApisByFechaHoraConsulta(
  $fechaHoraConsulta: AWSDateTime!
  $sortDirection: ModelSortDirection
  $filter: ModelConsultaApiFilterInput
  $limit: Int
  $nextToken: String
) {
  consultaApisByFechaHoraConsulta(
    fechaHoraConsulta: $fechaHoraConsulta
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ConsultaApisByFechaHoraConsultaQueryVariables,
  APITypes.ConsultaApisByFechaHoraConsultaQuery
>;
export const consultaApisByHashBlockchain = /* GraphQL */ `query ConsultaApisByHashBlockchain(
  $hashBlockchain: String!
  $sortDirection: ModelSortDirection
  $filter: ModelConsultaApiFilterInput
  $limit: Int
  $nextToken: String
) {
  consultaApisByHashBlockchain(
    hashBlockchain: $hashBlockchain
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ConsultaApisByHashBlockchainQueryVariables,
  APITypes.ConsultaApisByHashBlockchainQuery
>;
export const iotSessionsBySessionId = /* GraphQL */ `query IotSessionsBySessionId(
  $sessionId: String!
  $sortDirection: ModelSortDirection
  $filter: ModelIotSessionFilterInput
  $limit: Int
  $nextToken: String
) {
  iotSessionsBySessionId(
    sessionId: $sessionId
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      sessionId
      iotData
      createdAt
      expiresAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.IotSessionsBySessionIdQueryVariables,
  APITypes.IotSessionsBySessionIdQuery
>;
export const iotSessionsByExpiresAt = /* GraphQL */ `query IotSessionsByExpiresAt(
  $expiresAt: AWSDateTime!
  $sortDirection: ModelSortDirection
  $filter: ModelIotSessionFilterInput
  $limit: Int
  $nextToken: String
) {
  iotSessionsByExpiresAt(
    expiresAt: $expiresAt
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      sessionId
      iotData
      createdAt
      expiresAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.IotSessionsByExpiresAtQueryVariables,
  APITypes.IotSessionsByExpiresAtQuery
>;
export const constructorFormulaCategoriasByNombre = /* GraphQL */ `query ConstructorFormulaCategoriasByNombre(
  $nombre: String!
  $sortDirection: ModelSortDirection
  $filter: ModelConstructorFormulaCategoriaFilterInput
  $limit: Int
  $nextToken: String
) {
  constructorFormulaCategoriasByNombre(
    nombre: $nombre
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      nombre
      estado
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ConstructorFormulaCategoriasByNombreQueryVariables,
  APITypes.ConstructorFormulaCategoriasByNombreQuery
>;
export const constructorFormulaVariablesByNombre = /* GraphQL */ `query ConstructorFormulaVariablesByNombre(
  $nombre: String!
  $sortDirection: ModelSortDirection
  $filter: ModelConstructorFormulaVariableFilterInput
  $limit: Int
  $nextToken: String
) {
  constructorFormulaVariablesByNombre(
    nombre: $nombre
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ConstructorFormulaVariablesByNombreQueryVariables,
  APITypes.ConstructorFormulaVariablesByNombreQuery
>;
export const constructorFormulaVariablesBySimbolo = /* GraphQL */ `query ConstructorFormulaVariablesBySimbolo(
  $simbolo: String!
  $sortDirection: ModelSortDirection
  $filter: ModelConstructorFormulaVariableFilterInput
  $limit: Int
  $nextToken: String
) {
  constructorFormulaVariablesBySimbolo(
    simbolo: $simbolo
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ConstructorFormulaVariablesBySimboloQueryVariables,
  APITypes.ConstructorFormulaVariablesBySimboloQuery
>;
export const constructorFormulaVariablesByCategoriaId = /* GraphQL */ `query ConstructorFormulaVariablesByCategoriaId(
  $categoriaId: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelConstructorFormulaVariableFilterInput
  $limit: Int
  $nextToken: String
) {
  constructorFormulaVariablesByCategoriaId(
    categoriaId: $categoriaId
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ConstructorFormulaVariablesByCategoriaIdQueryVariables,
  APITypes.ConstructorFormulaVariablesByCategoriaIdQuery
>;
export const constructorFormulasByNombre = /* GraphQL */ `query ConstructorFormulasByNombre(
  $nombre: String!
  $sortDirection: ModelSortDirection
  $filter: ModelConstructorFormulaFilterInput
  $limit: Int
  $nextToken: String
) {
  constructorFormulasByNombre(
    nombre: $nombre
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ConstructorFormulasByNombreQueryVariables,
  APITypes.ConstructorFormulasByNombreQuery
>;
export const constructorFormulasByUsuarioId = /* GraphQL */ `query ConstructorFormulasByUsuarioId(
  $usuarioId: String!
  $sortDirection: ModelSortDirection
  $filter: ModelConstructorFormulaFilterInput
  $limit: Int
  $nextToken: String
) {
  constructorFormulasByUsuarioId(
    usuarioId: $usuarioId
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
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
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ConstructorFormulasByUsuarioIdQueryVariables,
  APITypes.ConstructorFormulasByUsuarioIdQuery
>;
export const constructorFormulaVariableRelsByFormulaId = /* GraphQL */ `query ConstructorFormulaVariableRelsByFormulaId(
  $formulaId: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelConstructorFormulaVariableRelFilterInput
  $limit: Int
  $nextToken: String
) {
  constructorFormulaVariableRelsByFormulaId(
    formulaId: $formulaId
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      formulaId
      variableId
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ConstructorFormulaVariableRelsByFormulaIdQueryVariables,
  APITypes.ConstructorFormulaVariableRelsByFormulaIdQuery
>;
export const constructorFormulaVariableRelsByVariableId = /* GraphQL */ `query ConstructorFormulaVariableRelsByVariableId(
  $variableId: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelConstructorFormulaVariableRelFilterInput
  $limit: Int
  $nextToken: String
) {
  constructorFormulaVariableRelsByVariableId(
    variableId: $variableId
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      formulaId
      variableId
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.ConstructorFormulaVariableRelsByVariableIdQueryVariables,
  APITypes.ConstructorFormulaVariableRelsByVariableIdQuery
>;
export const formulaTeledeteccionsByFormulaId = /* GraphQL */ `query FormulaTeledeteccionsByFormulaId(
  $formulaId: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelFormulaTeledeteccionFilterInput
  $limit: Int
  $nextToken: String
) {
  formulaTeledeteccionsByFormulaId(
    formulaId: $formulaId
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      formulaId
      codigoScript
      tipoEntrada
      parametrosJson
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.FormulaTeledeteccionsByFormulaIdQueryVariables,
  APITypes.FormulaTeledeteccionsByFormulaIdQuery
>;
export const formulaDeepLearningsByFormulaId = /* GraphQL */ `query FormulaDeepLearningsByFormulaId(
  $formulaId: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelFormulaDeepLearningFilterInput
  $limit: Int
  $nextToken: String
) {
  formulaDeepLearningsByFormulaId(
    formulaId: $formulaId
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      formulaId
      rutaModelo
      rutaEtiquetas
      parametrosJson
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.FormulaDeepLearningsByFormulaIdQueryVariables,
  APITypes.FormulaDeepLearningsByFormulaIdQuery
>;
export const formulaHistorialsByFormulaId = /* GraphQL */ `query FormulaHistorialsByFormulaId(
  $formulaId: ID!
  $sortDirection: ModelSortDirection
  $filter: ModelFormulaHistorialFilterInput
  $limit: Int
  $nextToken: String
) {
  formulaHistorialsByFormulaId(
    formulaId: $formulaId
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      formulaId
      version
      fechaModificacion
      datosJson
      usuarioId
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.FormulaHistorialsByFormulaIdQueryVariables,
  APITypes.FormulaHistorialsByFormulaIdQuery
>;
export const formulaHistorialsByVersion = /* GraphQL */ `query FormulaHistorialsByVersion(
  $version: Int!
  $sortDirection: ModelSortDirection
  $filter: ModelFormulaHistorialFilterInput
  $limit: Int
  $nextToken: String
) {
  formulaHistorialsByVersion(
    version: $version
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      formulaId
      version
      fechaModificacion
      datosJson
      usuarioId
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.FormulaHistorialsByVersionQueryVariables,
  APITypes.FormulaHistorialsByVersionQuery
>;
export const formulaHistorialsByFechaModificacion = /* GraphQL */ `query FormulaHistorialsByFechaModificacion(
  $fechaModificacion: AWSDateTime!
  $sortDirection: ModelSortDirection
  $filter: ModelFormulaHistorialFilterInput
  $limit: Int
  $nextToken: String
) {
  formulaHistorialsByFechaModificacion(
    fechaModificacion: $fechaModificacion
    sortDirection: $sortDirection
    filter: $filter
    limit: $limit
    nextToken: $nextToken
  ) {
    items {
      id
      formulaId
      version
      fechaModificacion
      datosJson
      usuarioId
      createdAt
      updatedAt
      __typename
    }
    nextToken
    __typename
  }
}
` as GeneratedQuery<
  APITypes.FormulaHistorialsByFechaModificacionQueryVariables,
  APITypes.FormulaHistorialsByFechaModificacionQuery
>;
