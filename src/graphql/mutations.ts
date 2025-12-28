/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

import * as APITypes from "../API";
type GeneratedMutation<InputType, OutputType> = string & {
  __generatedMutationInput: InputType;
  __generatedMutationOutput: OutputType;
};

export const createModelAI = /* GraphQL */ `mutation CreateModelAI(
  $input: CreateModelAIInput!
  $condition: ModelModelAIConditionInput
) {
  createModelAI(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateModelAIMutationVariables,
  APITypes.CreateModelAIMutation
>;
export const updateModelAI = /* GraphQL */ `mutation UpdateModelAI(
  $input: UpdateModelAIInput!
  $condition: ModelModelAIConditionInput
) {
  updateModelAI(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateModelAIMutationVariables,
  APITypes.UpdateModelAIMutation
>;
export const deleteModelAI = /* GraphQL */ `mutation DeleteModelAI(
  $input: DeleteModelAIInput!
  $condition: ModelModelAIConditionInput
) {
  deleteModelAI(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteModelAIMutationVariables,
  APITypes.DeleteModelAIMutation
>;
export const createCalculation = /* GraphQL */ `mutation CreateCalculation(
  $input: CreateCalculationInput!
  $condition: ModelCalculationConditionInput
) {
  createCalculation(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateCalculationMutationVariables,
  APITypes.CreateCalculationMutation
>;
export const updateCalculation = /* GraphQL */ `mutation UpdateCalculation(
  $input: UpdateCalculationInput!
  $condition: ModelCalculationConditionInput
) {
  updateCalculation(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateCalculationMutationVariables,
  APITypes.UpdateCalculationMutation
>;
export const deleteCalculation = /* GraphQL */ `mutation DeleteCalculation(
  $input: DeleteCalculationInput!
  $condition: ModelCalculationConditionInput
) {
  deleteCalculation(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteCalculationMutationVariables,
  APITypes.DeleteCalculationMutation
>;
export const createUser = /* GraphQL */ `mutation CreateUser(
  $input: CreateUserInput!
  $condition: ModelUserConditionInput
) {
  createUser(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateUserMutationVariables,
  APITypes.CreateUserMutation
>;
export const updateUser = /* GraphQL */ `mutation UpdateUser(
  $input: UpdateUserInput!
  $condition: ModelUserConditionInput
) {
  updateUser(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateUserMutationVariables,
  APITypes.UpdateUserMutation
>;
export const deleteUser = /* GraphQL */ `mutation DeleteUser(
  $input: DeleteUserInput!
  $condition: ModelUserConditionInput
) {
  deleteUser(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteUserMutationVariables,
  APITypes.DeleteUserMutation
>;
export const createModelPackage = /* GraphQL */ `mutation CreateModelPackage(
  $input: CreateModelPackageInput!
  $condition: ModelModelPackageConditionInput
) {
  createModelPackage(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateModelPackageMutationVariables,
  APITypes.CreateModelPackageMutation
>;
export const updateModelPackage = /* GraphQL */ `mutation UpdateModelPackage(
  $input: UpdateModelPackageInput!
  $condition: ModelModelPackageConditionInput
) {
  updateModelPackage(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateModelPackageMutationVariables,
  APITypes.UpdateModelPackageMutation
>;
export const deleteModelPackage = /* GraphQL */ `mutation DeleteModelPackage(
  $input: DeleteModelPackageInput!
  $condition: ModelModelPackageConditionInput
) {
  deleteModelPackage(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteModelPackageMutationVariables,
  APITypes.DeleteModelPackageMutation
>;
export const createUserModelPackage = /* GraphQL */ `mutation CreateUserModelPackage(
  $input: CreateUserModelPackageInput!
  $condition: ModelUserModelPackageConditionInput
) {
  createUserModelPackage(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateUserModelPackageMutationVariables,
  APITypes.CreateUserModelPackageMutation
>;
export const updateUserModelPackage = /* GraphQL */ `mutation UpdateUserModelPackage(
  $input: UpdateUserModelPackageInput!
  $condition: ModelUserModelPackageConditionInput
) {
  updateUserModelPackage(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateUserModelPackageMutationVariables,
  APITypes.UpdateUserModelPackageMutation
>;
export const deleteUserModelPackage = /* GraphQL */ `mutation DeleteUserModelPackage(
  $input: DeleteUserModelPackageInput!
  $condition: ModelUserModelPackageConditionInput
) {
  deleteUserModelPackage(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteUserModelPackageMutationVariables,
  APITypes.DeleteUserModelPackageMutation
>;
export const createProyecto = /* GraphQL */ `mutation CreateProyecto(
  $input: CreateProyectoInput!
  $condition: ModelProyectoConditionInput
) {
  createProyecto(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateProyectoMutationVariables,
  APITypes.CreateProyectoMutation
>;
export const updateProyecto = /* GraphQL */ `mutation UpdateProyecto(
  $input: UpdateProyectoInput!
  $condition: ModelProyectoConditionInput
) {
  updateProyecto(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateProyectoMutationVariables,
  APITypes.UpdateProyectoMutation
>;
export const deleteProyecto = /* GraphQL */ `mutation DeleteProyecto(
  $input: DeleteProyectoInput!
  $condition: ModelProyectoConditionInput
) {
  deleteProyecto(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteProyectoMutationVariables,
  APITypes.DeleteProyectoMutation
>;
export const createConsultaAnalisis = /* GraphQL */ `mutation CreateConsultaAnalisis(
  $input: CreateConsultaAnalisisInput!
  $condition: ModelConsultaAnalisisConditionInput
) {
  createConsultaAnalisis(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateConsultaAnalisisMutationVariables,
  APITypes.CreateConsultaAnalisisMutation
>;
export const updateConsultaAnalisis = /* GraphQL */ `mutation UpdateConsultaAnalisis(
  $input: UpdateConsultaAnalisisInput!
  $condition: ModelConsultaAnalisisConditionInput
) {
  updateConsultaAnalisis(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateConsultaAnalisisMutationVariables,
  APITypes.UpdateConsultaAnalisisMutation
>;
export const deleteConsultaAnalisis = /* GraphQL */ `mutation DeleteConsultaAnalisis(
  $input: DeleteConsultaAnalisisInput!
  $condition: ModelConsultaAnalisisConditionInput
) {
  deleteConsultaAnalisis(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteConsultaAnalisisMutationVariables,
  APITypes.DeleteConsultaAnalisisMutation
>;
export const createConsultaEstado = /* GraphQL */ `mutation CreateConsultaEstado(
  $input: CreateConsultaEstadoInput!
  $condition: ModelConsultaEstadoConditionInput
) {
  createConsultaEstado(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateConsultaEstadoMutationVariables,
  APITypes.CreateConsultaEstadoMutation
>;
export const updateConsultaEstado = /* GraphQL */ `mutation UpdateConsultaEstado(
  $input: UpdateConsultaEstadoInput!
  $condition: ModelConsultaEstadoConditionInput
) {
  updateConsultaEstado(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateConsultaEstadoMutationVariables,
  APITypes.UpdateConsultaEstadoMutation
>;
export const deleteConsultaEstado = /* GraphQL */ `mutation DeleteConsultaEstado(
  $input: DeleteConsultaEstadoInput!
  $condition: ModelConsultaEstadoConditionInput
) {
  deleteConsultaEstado(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteConsultaEstadoMutationVariables,
  APITypes.DeleteConsultaEstadoMutation
>;
export const createAnalisisCuota = /* GraphQL */ `mutation CreateAnalisisCuota(
  $input: CreateAnalisisCuotaInput!
  $condition: ModelAnalisisCuotaConditionInput
) {
  createAnalisisCuota(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateAnalisisCuotaMutationVariables,
  APITypes.CreateAnalisisCuotaMutation
>;
export const updateAnalisisCuota = /* GraphQL */ `mutation UpdateAnalisisCuota(
  $input: UpdateAnalisisCuotaInput!
  $condition: ModelAnalisisCuotaConditionInput
) {
  updateAnalisisCuota(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateAnalisisCuotaMutationVariables,
  APITypes.UpdateAnalisisCuotaMutation
>;
export const deleteAnalisisCuota = /* GraphQL */ `mutation DeleteAnalisisCuota(
  $input: DeleteAnalisisCuotaInput!
  $condition: ModelAnalisisCuotaConditionInput
) {
  deleteAnalisisCuota(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteAnalisisCuotaMutationVariables,
  APITypes.DeleteAnalisisCuotaMutation
>;
export const createAnalisisCuotasUsoDiario = /* GraphQL */ `mutation CreateAnalisisCuotasUsoDiario(
  $input: CreateAnalisisCuotasUsoDiarioInput!
  $condition: ModelAnalisisCuotasUsoDiarioConditionInput
) {
  createAnalisisCuotasUsoDiario(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateAnalisisCuotasUsoDiarioMutationVariables,
  APITypes.CreateAnalisisCuotasUsoDiarioMutation
>;
export const updateAnalisisCuotasUsoDiario = /* GraphQL */ `mutation UpdateAnalisisCuotasUsoDiario(
  $input: UpdateAnalisisCuotasUsoDiarioInput!
  $condition: ModelAnalisisCuotasUsoDiarioConditionInput
) {
  updateAnalisisCuotasUsoDiario(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateAnalisisCuotasUsoDiarioMutationVariables,
  APITypes.UpdateAnalisisCuotasUsoDiarioMutation
>;
export const deleteAnalisisCuotasUsoDiario = /* GraphQL */ `mutation DeleteAnalisisCuotasUsoDiario(
  $input: DeleteAnalisisCuotasUsoDiarioInput!
  $condition: ModelAnalisisCuotasUsoDiarioConditionInput
) {
  deleteAnalisisCuotasUsoDiario(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteAnalisisCuotasUsoDiarioMutationVariables,
  APITypes.DeleteAnalisisCuotasUsoDiarioMutation
>;
export const createDispositivoIot = /* GraphQL */ `mutation CreateDispositivoIot(
  $input: CreateDispositivoIotInput!
  $condition: ModelDispositivoIotConditionInput
) {
  createDispositivoIot(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateDispositivoIotMutationVariables,
  APITypes.CreateDispositivoIotMutation
>;
export const updateDispositivoIot = /* GraphQL */ `mutation UpdateDispositivoIot(
  $input: UpdateDispositivoIotInput!
  $condition: ModelDispositivoIotConditionInput
) {
  updateDispositivoIot(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateDispositivoIotMutationVariables,
  APITypes.UpdateDispositivoIotMutation
>;
export const deleteDispositivoIot = /* GraphQL */ `mutation DeleteDispositivoIot(
  $input: DeleteDispositivoIotInput!
  $condition: ModelDispositivoIotConditionInput
) {
  deleteDispositivoIot(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteDispositivoIotMutationVariables,
  APITypes.DeleteDispositivoIotMutation
>;
export const createGrupoIot = /* GraphQL */ `mutation CreateGrupoIot(
  $input: CreateGrupoIotInput!
  $condition: ModelGrupoIotConditionInput
) {
  createGrupoIot(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateGrupoIotMutationVariables,
  APITypes.CreateGrupoIotMutation
>;
export const updateGrupoIot = /* GraphQL */ `mutation UpdateGrupoIot(
  $input: UpdateGrupoIotInput!
  $condition: ModelGrupoIotConditionInput
) {
  updateGrupoIot(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateGrupoIotMutationVariables,
  APITypes.UpdateGrupoIotMutation
>;
export const deleteGrupoIot = /* GraphQL */ `mutation DeleteGrupoIot(
  $input: DeleteGrupoIotInput!
  $condition: ModelGrupoIotConditionInput
) {
  deleteGrupoIot(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteGrupoIotMutationVariables,
  APITypes.DeleteGrupoIotMutation
>;
export const createRelDispositivoGrupoIot = /* GraphQL */ `mutation CreateRelDispositivoGrupoIot(
  $input: CreateRelDispositivoGrupoIotInput!
  $condition: ModelRelDispositivoGrupoIotConditionInput
) {
  createRelDispositivoGrupoIot(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateRelDispositivoGrupoIotMutationVariables,
  APITypes.CreateRelDispositivoGrupoIotMutation
>;
export const updateRelDispositivoGrupoIot = /* GraphQL */ `mutation UpdateRelDispositivoGrupoIot(
  $input: UpdateRelDispositivoGrupoIotInput!
  $condition: ModelRelDispositivoGrupoIotConditionInput
) {
  updateRelDispositivoGrupoIot(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateRelDispositivoGrupoIotMutationVariables,
  APITypes.UpdateRelDispositivoGrupoIotMutation
>;
export const deleteRelDispositivoGrupoIot = /* GraphQL */ `mutation DeleteRelDispositivoGrupoIot(
  $input: DeleteRelDispositivoGrupoIotInput!
  $condition: ModelRelDispositivoGrupoIotConditionInput
) {
  deleteRelDispositivoGrupoIot(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteRelDispositivoGrupoIotMutationVariables,
  APITypes.DeleteRelDispositivoGrupoIotMutation
>;
export const createRelGrupoIotProyecto = /* GraphQL */ `mutation CreateRelGrupoIotProyecto(
  $input: CreateRelGrupoIotProyectoInput!
  $condition: ModelRelGrupoIotProyectoConditionInput
) {
  createRelGrupoIotProyecto(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateRelGrupoIotProyectoMutationVariables,
  APITypes.CreateRelGrupoIotProyectoMutation
>;
export const updateRelGrupoIotProyecto = /* GraphQL */ `mutation UpdateRelGrupoIotProyecto(
  $input: UpdateRelGrupoIotProyectoInput!
  $condition: ModelRelGrupoIotProyectoConditionInput
) {
  updateRelGrupoIotProyecto(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateRelGrupoIotProyectoMutationVariables,
  APITypes.UpdateRelGrupoIotProyectoMutation
>;
export const deleteRelGrupoIotProyecto = /* GraphQL */ `mutation DeleteRelGrupoIotProyecto(
  $input: DeleteRelGrupoIotProyectoInput!
  $condition: ModelRelGrupoIotProyectoConditionInput
) {
  deleteRelGrupoIotProyecto(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteRelGrupoIotProyectoMutationVariables,
  APITypes.DeleteRelGrupoIotProyectoMutation
>;
export const createMedicionIot = /* GraphQL */ `mutation CreateMedicionIot(
  $input: CreateMedicionIotInput!
  $condition: ModelMedicionIotConditionInput
) {
  createMedicionIot(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateMedicionIotMutationVariables,
  APITypes.CreateMedicionIotMutation
>;
export const updateMedicionIot = /* GraphQL */ `mutation UpdateMedicionIot(
  $input: UpdateMedicionIotInput!
  $condition: ModelMedicionIotConditionInput
) {
  updateMedicionIot(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateMedicionIotMutationVariables,
  APITypes.UpdateMedicionIotMutation
>;
export const deleteMedicionIot = /* GraphQL */ `mutation DeleteMedicionIot(
  $input: DeleteMedicionIotInput!
  $condition: ModelMedicionIotConditionInput
) {
  deleteMedicionIot(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteMedicionIotMutationVariables,
  APITypes.DeleteMedicionIotMutation
>;
export const createProyectoLegacy = /* GraphQL */ `mutation CreateProyectoLegacy(
  $input: CreateProyectoLegacyInput!
  $condition: ModelProyectoLegacyConditionInput
) {
  createProyectoLegacy(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateProyectoLegacyMutationVariables,
  APITypes.CreateProyectoLegacyMutation
>;
export const updateProyectoLegacy = /* GraphQL */ `mutation UpdateProyectoLegacy(
  $input: UpdateProyectoLegacyInput!
  $condition: ModelProyectoLegacyConditionInput
) {
  updateProyectoLegacy(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateProyectoLegacyMutationVariables,
  APITypes.UpdateProyectoLegacyMutation
>;
export const deleteProyectoLegacy = /* GraphQL */ `mutation DeleteProyectoLegacy(
  $input: DeleteProyectoLegacyInput!
  $condition: ModelProyectoLegacyConditionInput
) {
  deleteProyectoLegacy(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteProyectoLegacyMutationVariables,
  APITypes.DeleteProyectoLegacyMutation
>;
export const createConsultaWeb = /* GraphQL */ `mutation CreateConsultaWeb(
  $input: CreateConsultaWebInput!
  $condition: ModelConsultaWebConditionInput
) {
  createConsultaWeb(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateConsultaWebMutationVariables,
  APITypes.CreateConsultaWebMutation
>;
export const updateConsultaWeb = /* GraphQL */ `mutation UpdateConsultaWeb(
  $input: UpdateConsultaWebInput!
  $condition: ModelConsultaWebConditionInput
) {
  updateConsultaWeb(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateConsultaWebMutationVariables,
  APITypes.UpdateConsultaWebMutation
>;
export const deleteConsultaWeb = /* GraphQL */ `mutation DeleteConsultaWeb(
  $input: DeleteConsultaWebInput!
  $condition: ModelConsultaWebConditionInput
) {
  deleteConsultaWeb(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteConsultaWebMutationVariables,
  APITypes.DeleteConsultaWebMutation
>;
export const createConsultaApi = /* GraphQL */ `mutation CreateConsultaApi(
  $input: CreateConsultaApiInput!
  $condition: ModelConsultaApiConditionInput
) {
  createConsultaApi(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateConsultaApiMutationVariables,
  APITypes.CreateConsultaApiMutation
>;
export const updateConsultaApi = /* GraphQL */ `mutation UpdateConsultaApi(
  $input: UpdateConsultaApiInput!
  $condition: ModelConsultaApiConditionInput
) {
  updateConsultaApi(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateConsultaApiMutationVariables,
  APITypes.UpdateConsultaApiMutation
>;
export const deleteConsultaApi = /* GraphQL */ `mutation DeleteConsultaApi(
  $input: DeleteConsultaApiInput!
  $condition: ModelConsultaApiConditionInput
) {
  deleteConsultaApi(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteConsultaApiMutationVariables,
  APITypes.DeleteConsultaApiMutation
>;
export const createIotSession = /* GraphQL */ `mutation CreateIotSession(
  $input: CreateIotSessionInput!
  $condition: ModelIotSessionConditionInput
) {
  createIotSession(input: $input, condition: $condition) {
    id
    sessionId
    iotData
    createdAt
    expiresAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateIotSessionMutationVariables,
  APITypes.CreateIotSessionMutation
>;
export const updateIotSession = /* GraphQL */ `mutation UpdateIotSession(
  $input: UpdateIotSessionInput!
  $condition: ModelIotSessionConditionInput
) {
  updateIotSession(input: $input, condition: $condition) {
    id
    sessionId
    iotData
    createdAt
    expiresAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateIotSessionMutationVariables,
  APITypes.UpdateIotSessionMutation
>;
export const deleteIotSession = /* GraphQL */ `mutation DeleteIotSession(
  $input: DeleteIotSessionInput!
  $condition: ModelIotSessionConditionInput
) {
  deleteIotSession(input: $input, condition: $condition) {
    id
    sessionId
    iotData
    createdAt
    expiresAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteIotSessionMutationVariables,
  APITypes.DeleteIotSessionMutation
>;
export const createConstructorFormulaCategoria = /* GraphQL */ `mutation CreateConstructorFormulaCategoria(
  $input: CreateConstructorFormulaCategoriaInput!
  $condition: ModelConstructorFormulaCategoriaConditionInput
) {
  createConstructorFormulaCategoria(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateConstructorFormulaCategoriaMutationVariables,
  APITypes.CreateConstructorFormulaCategoriaMutation
>;
export const updateConstructorFormulaCategoria = /* GraphQL */ `mutation UpdateConstructorFormulaCategoria(
  $input: UpdateConstructorFormulaCategoriaInput!
  $condition: ModelConstructorFormulaCategoriaConditionInput
) {
  updateConstructorFormulaCategoria(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateConstructorFormulaCategoriaMutationVariables,
  APITypes.UpdateConstructorFormulaCategoriaMutation
>;
export const deleteConstructorFormulaCategoria = /* GraphQL */ `mutation DeleteConstructorFormulaCategoria(
  $input: DeleteConstructorFormulaCategoriaInput!
  $condition: ModelConstructorFormulaCategoriaConditionInput
) {
  deleteConstructorFormulaCategoria(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteConstructorFormulaCategoriaMutationVariables,
  APITypes.DeleteConstructorFormulaCategoriaMutation
>;
export const createConstructorFormulaVariable = /* GraphQL */ `mutation CreateConstructorFormulaVariable(
  $input: CreateConstructorFormulaVariableInput!
  $condition: ModelConstructorFormulaVariableConditionInput
) {
  createConstructorFormulaVariable(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateConstructorFormulaVariableMutationVariables,
  APITypes.CreateConstructorFormulaVariableMutation
>;
export const updateConstructorFormulaVariable = /* GraphQL */ `mutation UpdateConstructorFormulaVariable(
  $input: UpdateConstructorFormulaVariableInput!
  $condition: ModelConstructorFormulaVariableConditionInput
) {
  updateConstructorFormulaVariable(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateConstructorFormulaVariableMutationVariables,
  APITypes.UpdateConstructorFormulaVariableMutation
>;
export const deleteConstructorFormulaVariable = /* GraphQL */ `mutation DeleteConstructorFormulaVariable(
  $input: DeleteConstructorFormulaVariableInput!
  $condition: ModelConstructorFormulaVariableConditionInput
) {
  deleteConstructorFormulaVariable(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteConstructorFormulaVariableMutationVariables,
  APITypes.DeleteConstructorFormulaVariableMutation
>;
export const createConstructorFormula = /* GraphQL */ `mutation CreateConstructorFormula(
  $input: CreateConstructorFormulaInput!
  $condition: ModelConstructorFormulaConditionInput
) {
  createConstructorFormula(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateConstructorFormulaMutationVariables,
  APITypes.CreateConstructorFormulaMutation
>;
export const updateConstructorFormula = /* GraphQL */ `mutation UpdateConstructorFormula(
  $input: UpdateConstructorFormulaInput!
  $condition: ModelConstructorFormulaConditionInput
) {
  updateConstructorFormula(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateConstructorFormulaMutationVariables,
  APITypes.UpdateConstructorFormulaMutation
>;
export const deleteConstructorFormula = /* GraphQL */ `mutation DeleteConstructorFormula(
  $input: DeleteConstructorFormulaInput!
  $condition: ModelConstructorFormulaConditionInput
) {
  deleteConstructorFormula(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteConstructorFormulaMutationVariables,
  APITypes.DeleteConstructorFormulaMutation
>;
export const createConstructorFormulaVariableRel = /* GraphQL */ `mutation CreateConstructorFormulaVariableRel(
  $input: CreateConstructorFormulaVariableRelInput!
  $condition: ModelConstructorFormulaVariableRelConditionInput
) {
  createConstructorFormulaVariableRel(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateConstructorFormulaVariableRelMutationVariables,
  APITypes.CreateConstructorFormulaVariableRelMutation
>;
export const updateConstructorFormulaVariableRel = /* GraphQL */ `mutation UpdateConstructorFormulaVariableRel(
  $input: UpdateConstructorFormulaVariableRelInput!
  $condition: ModelConstructorFormulaVariableRelConditionInput
) {
  updateConstructorFormulaVariableRel(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateConstructorFormulaVariableRelMutationVariables,
  APITypes.UpdateConstructorFormulaVariableRelMutation
>;
export const deleteConstructorFormulaVariableRel = /* GraphQL */ `mutation DeleteConstructorFormulaVariableRel(
  $input: DeleteConstructorFormulaVariableRelInput!
  $condition: ModelConstructorFormulaVariableRelConditionInput
) {
  deleteConstructorFormulaVariableRel(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteConstructorFormulaVariableRelMutationVariables,
  APITypes.DeleteConstructorFormulaVariableRelMutation
>;
export const createFormulaTeledeteccion = /* GraphQL */ `mutation CreateFormulaTeledeteccion(
  $input: CreateFormulaTeledeteccionInput!
  $condition: ModelFormulaTeledeteccionConditionInput
) {
  createFormulaTeledeteccion(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateFormulaTeledeteccionMutationVariables,
  APITypes.CreateFormulaTeledeteccionMutation
>;
export const updateFormulaTeledeteccion = /* GraphQL */ `mutation UpdateFormulaTeledeteccion(
  $input: UpdateFormulaTeledeteccionInput!
  $condition: ModelFormulaTeledeteccionConditionInput
) {
  updateFormulaTeledeteccion(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateFormulaTeledeteccionMutationVariables,
  APITypes.UpdateFormulaTeledeteccionMutation
>;
export const deleteFormulaTeledeteccion = /* GraphQL */ `mutation DeleteFormulaTeledeteccion(
  $input: DeleteFormulaTeledeteccionInput!
  $condition: ModelFormulaTeledeteccionConditionInput
) {
  deleteFormulaTeledeteccion(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteFormulaTeledeteccionMutationVariables,
  APITypes.DeleteFormulaTeledeteccionMutation
>;
export const createFormulaDeepLearning = /* GraphQL */ `mutation CreateFormulaDeepLearning(
  $input: CreateFormulaDeepLearningInput!
  $condition: ModelFormulaDeepLearningConditionInput
) {
  createFormulaDeepLearning(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateFormulaDeepLearningMutationVariables,
  APITypes.CreateFormulaDeepLearningMutation
>;
export const updateFormulaDeepLearning = /* GraphQL */ `mutation UpdateFormulaDeepLearning(
  $input: UpdateFormulaDeepLearningInput!
  $condition: ModelFormulaDeepLearningConditionInput
) {
  updateFormulaDeepLearning(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateFormulaDeepLearningMutationVariables,
  APITypes.UpdateFormulaDeepLearningMutation
>;
export const deleteFormulaDeepLearning = /* GraphQL */ `mutation DeleteFormulaDeepLearning(
  $input: DeleteFormulaDeepLearningInput!
  $condition: ModelFormulaDeepLearningConditionInput
) {
  deleteFormulaDeepLearning(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteFormulaDeepLearningMutationVariables,
  APITypes.DeleteFormulaDeepLearningMutation
>;
export const createFormulaHistorial = /* GraphQL */ `mutation CreateFormulaHistorial(
  $input: CreateFormulaHistorialInput!
  $condition: ModelFormulaHistorialConditionInput
) {
  createFormulaHistorial(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateFormulaHistorialMutationVariables,
  APITypes.CreateFormulaHistorialMutation
>;
export const updateFormulaHistorial = /* GraphQL */ `mutation UpdateFormulaHistorial(
  $input: UpdateFormulaHistorialInput!
  $condition: ModelFormulaHistorialConditionInput
) {
  updateFormulaHistorial(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateFormulaHistorialMutationVariables,
  APITypes.UpdateFormulaHistorialMutation
>;
export const deleteFormulaHistorial = /* GraphQL */ `mutation DeleteFormulaHistorial(
  $input: DeleteFormulaHistorialInput!
  $condition: ModelFormulaHistorialConditionInput
) {
  deleteFormulaHistorial(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteFormulaHistorialMutationVariables,
  APITypes.DeleteFormulaHistorialMutation
>;
export const createAccessDeadline = /* GraphQL */ `mutation CreateAccessDeadline(
  $input: CreateAccessDeadlineInput!
  $condition: ModelAccessDeadlineConditionInput
) {
  createAccessDeadline(input: $input, condition: $condition) {
    id
    subjectType
    subjectKey
    deadline
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreateAccessDeadlineMutationVariables,
  APITypes.CreateAccessDeadlineMutation
>;
export const updateAccessDeadline = /* GraphQL */ `mutation UpdateAccessDeadline(
  $input: UpdateAccessDeadlineInput!
  $condition: ModelAccessDeadlineConditionInput
) {
  updateAccessDeadline(input: $input, condition: $condition) {
    id
    subjectType
    subjectKey
    deadline
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdateAccessDeadlineMutationVariables,
  APITypes.UpdateAccessDeadlineMutation
>;
export const deleteAccessDeadline = /* GraphQL */ `mutation DeleteAccessDeadline(
  $input: DeleteAccessDeadlineInput!
  $condition: ModelAccessDeadlineConditionInput
) {
  deleteAccessDeadline(input: $input, condition: $condition) {
    id
    subjectType
    subjectKey
    deadline
    createdAt
    updatedAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeleteAccessDeadlineMutationVariables,
  APITypes.DeleteAccessDeadlineMutation
>;
export const createRoutePermission = /* GraphQL */ `mutation CreateRoutePermission(
  $input: CreateRoutePermissionInput!
  $condition: ModelRoutePermissionConditionInput
) {
  createRoutePermission(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateRoutePermissionMutationVariables,
  APITypes.CreateRoutePermissionMutation
>;
export const updateRoutePermission = /* GraphQL */ `mutation UpdateRoutePermission(
  $input: UpdateRoutePermissionInput!
  $condition: ModelRoutePermissionConditionInput
) {
  updateRoutePermission(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateRoutePermissionMutationVariables,
  APITypes.UpdateRoutePermissionMutation
>;
export const deleteRoutePermission = /* GraphQL */ `mutation DeleteRoutePermission(
  $input: DeleteRoutePermissionInput!
  $condition: ModelRoutePermissionConditionInput
) {
  deleteRoutePermission(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteRoutePermissionMutationVariables,
  APITypes.DeleteRoutePermissionMutation
>;
export const createApiCredential = /* GraphQL */ `mutation CreateApiCredential(
  $input: CreateApiCredentialInput!
  $condition: ModelApiCredentialConditionInput
) {
  createApiCredential(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateApiCredentialMutationVariables,
  APITypes.CreateApiCredentialMutation
>;
export const updateApiCredential = /* GraphQL */ `mutation UpdateApiCredential(
  $input: UpdateApiCredentialInput!
  $condition: ModelApiCredentialConditionInput
) {
  updateApiCredential(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateApiCredentialMutationVariables,
  APITypes.UpdateApiCredentialMutation
>;
export const deleteApiCredential = /* GraphQL */ `mutation DeleteApiCredential(
  $input: DeleteApiCredentialInput!
  $condition: ModelApiCredentialConditionInput
) {
  deleteApiCredential(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteApiCredentialMutationVariables,
  APITypes.DeleteApiCredentialMutation
>;
export const createPermVersion = /* GraphQL */ `mutation CreatePermVersion(
  $input: CreatePermVersionInput!
  $condition: ModelPermVersionConditionInput
) {
  createPermVersion(input: $input, condition: $condition) {
    id
    updatedAt
    createdAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.CreatePermVersionMutationVariables,
  APITypes.CreatePermVersionMutation
>;
export const updatePermVersion = /* GraphQL */ `mutation UpdatePermVersion(
  $input: UpdatePermVersionInput!
  $condition: ModelPermVersionConditionInput
) {
  updatePermVersion(input: $input, condition: $condition) {
    id
    updatedAt
    createdAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.UpdatePermVersionMutationVariables,
  APITypes.UpdatePermVersionMutation
>;
export const deletePermVersion = /* GraphQL */ `mutation DeletePermVersion(
  $input: DeletePermVersionInput!
  $condition: ModelPermVersionConditionInput
) {
  deletePermVersion(input: $input, condition: $condition) {
    id
    updatedAt
    createdAt
    __typename
  }
}
` as GeneratedMutation<
  APITypes.DeletePermVersionMutationVariables,
  APITypes.DeletePermVersionMutation
>;
export const createUnitOfMeasure = /* GraphQL */ `mutation CreateUnitOfMeasure(
  $input: CreateUnitOfMeasureInput!
  $condition: ModelUnitOfMeasureConditionInput
) {
  createUnitOfMeasure(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateUnitOfMeasureMutationVariables,
  APITypes.CreateUnitOfMeasureMutation
>;
export const updateUnitOfMeasure = /* GraphQL */ `mutation UpdateUnitOfMeasure(
  $input: UpdateUnitOfMeasureInput!
  $condition: ModelUnitOfMeasureConditionInput
) {
  updateUnitOfMeasure(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateUnitOfMeasureMutationVariables,
  APITypes.UpdateUnitOfMeasureMutation
>;
export const deleteUnitOfMeasure = /* GraphQL */ `mutation DeleteUnitOfMeasure(
  $input: DeleteUnitOfMeasureInput!
  $condition: ModelUnitOfMeasureConditionInput
) {
  deleteUnitOfMeasure(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteUnitOfMeasureMutationVariables,
  APITypes.DeleteUnitOfMeasureMutation
>;
export const createProject = /* GraphQL */ `mutation CreateProject(
  $input: CreateProjectInput!
  $condition: ModelProjectConditionInput
) {
  createProject(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateProjectMutationVariables,
  APITypes.CreateProjectMutation
>;
export const updateProject = /* GraphQL */ `mutation UpdateProject(
  $input: UpdateProjectInput!
  $condition: ModelProjectConditionInput
) {
  updateProject(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateProjectMutationVariables,
  APITypes.UpdateProjectMutation
>;
export const deleteProject = /* GraphQL */ `mutation DeleteProject(
  $input: DeleteProjectInput!
  $condition: ModelProjectConditionInput
) {
  deleteProject(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteProjectMutationVariables,
  APITypes.DeleteProjectMutation
>;
export const createTemplate = /* GraphQL */ `mutation CreateTemplate(
  $input: CreateTemplateInput!
  $condition: ModelTemplateConditionInput
) {
  createTemplate(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateTemplateMutationVariables,
  APITypes.CreateTemplateMutation
>;
export const updateTemplate = /* GraphQL */ `mutation UpdateTemplate(
  $input: UpdateTemplateInput!
  $condition: ModelTemplateConditionInput
) {
  updateTemplate(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateTemplateMutationVariables,
  APITypes.UpdateTemplateMutation
>;
export const deleteTemplate = /* GraphQL */ `mutation DeleteTemplate(
  $input: DeleteTemplateInput!
  $condition: ModelTemplateConditionInput
) {
  deleteTemplate(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteTemplateMutationVariables,
  APITypes.DeleteTemplateMutation
>;
export const createTree = /* GraphQL */ `mutation CreateTree(
  $input: CreateTreeInput!
  $condition: ModelTreeConditionInput
) {
  createTree(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateTreeMutationVariables,
  APITypes.CreateTreeMutation
>;
export const updateTree = /* GraphQL */ `mutation UpdateTree(
  $input: UpdateTreeInput!
  $condition: ModelTreeConditionInput
) {
  updateTree(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateTreeMutationVariables,
  APITypes.UpdateTreeMutation
>;
export const deleteTree = /* GraphQL */ `mutation DeleteTree(
  $input: DeleteTreeInput!
  $condition: ModelTreeConditionInput
) {
  deleteTree(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteTreeMutationVariables,
  APITypes.DeleteTreeMutation
>;
export const createTemplateFeature = /* GraphQL */ `mutation CreateTemplateFeature(
  $input: CreateTemplateFeatureInput!
  $condition: ModelTemplateFeatureConditionInput
) {
  createTemplateFeature(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateTemplateFeatureMutationVariables,
  APITypes.CreateTemplateFeatureMutation
>;
export const updateTemplateFeature = /* GraphQL */ `mutation UpdateTemplateFeature(
  $input: UpdateTemplateFeatureInput!
  $condition: ModelTemplateFeatureConditionInput
) {
  updateTemplateFeature(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateTemplateFeatureMutationVariables,
  APITypes.UpdateTemplateFeatureMutation
>;
export const deleteTemplateFeature = /* GraphQL */ `mutation DeleteTemplateFeature(
  $input: DeleteTemplateFeatureInput!
  $condition: ModelTemplateFeatureConditionInput
) {
  deleteTemplateFeature(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteTemplateFeatureMutationVariables,
  APITypes.DeleteTemplateFeatureMutation
>;
export const createFeature = /* GraphQL */ `mutation CreateFeature(
  $input: CreateFeatureInput!
  $condition: ModelFeatureConditionInput
) {
  createFeature(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateFeatureMutationVariables,
  APITypes.CreateFeatureMutation
>;
export const updateFeature = /* GraphQL */ `mutation UpdateFeature(
  $input: UpdateFeatureInput!
  $condition: ModelFeatureConditionInput
) {
  updateFeature(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateFeatureMutationVariables,
  APITypes.UpdateFeatureMutation
>;
export const deleteFeature = /* GraphQL */ `mutation DeleteFeature(
  $input: DeleteFeatureInput!
  $condition: ModelFeatureConditionInput
) {
  deleteFeature(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteFeatureMutationVariables,
  APITypes.DeleteFeatureMutation
>;
export const createRawData = /* GraphQL */ `mutation CreateRawData(
  $input: CreateRawDataInput!
  $condition: ModelRawDataConditionInput
) {
  createRawData(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.CreateRawDataMutationVariables,
  APITypes.CreateRawDataMutation
>;
export const updateRawData = /* GraphQL */ `mutation UpdateRawData(
  $input: UpdateRawDataInput!
  $condition: ModelRawDataConditionInput
) {
  updateRawData(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.UpdateRawDataMutationVariables,
  APITypes.UpdateRawDataMutation
>;
export const deleteRawData = /* GraphQL */ `mutation DeleteRawData(
  $input: DeleteRawDataInput!
  $condition: ModelRawDataConditionInput
) {
  deleteRawData(input: $input, condition: $condition) {
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
` as GeneratedMutation<
  APITypes.DeleteRawDataMutationVariables,
  APITypes.DeleteRawDataMutation
>;
