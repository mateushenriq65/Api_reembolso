const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Reembolsos',
      version: '1.0.0',
      description: 'API para gerenciamento de usuários e reembolsos',
      contact: {
        name: 'Suporte',
        email: 'suporte@exemplo.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de Desenvolvimento'
      }
    ],
    components: {
      schemas: {
        Usuario: {
          type: 'object',
          required: ['nome', 'email', 'senha'],
          properties: {
            id: {
              type: 'integer',
              description: 'ID do usuário'
            },
            nome: {
              type: 'string',
              description: 'Nome completo do usuário'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email do usuário'
            },
            senha: {
              type: 'string',
              format: 'password',
              description: 'Senha do usuário'
            }
          }
        },
        Reembolso: {
          type: 'object',
          required: ['descricao', 'valor', 'usuarioId'],
          properties: {
            id: {
              type: 'integer',
              description: 'ID do reembolso'
            },
            descricao: {
              type: 'string',
              description: 'Descrição do reembolso'
            },
            valor: {
              type: 'number',
              format: 'float',
              description: 'Valor do reembolso'
            },
            status: {
              type: 'string',
              enum: ['pendente', 'aprovado', 'rejeitado'],
              description: 'Status do reembolso'
            },
            usuarioId: {
              type: 'integer',
              description: 'ID do usuário solicitante'
            },
            dataSolicitacao: {
              type: 'string',
              format: 'date-time',
              description: 'Data da solicitação'
            }
          }
        },
        Login: {
          type: 'object',
          required: ['email', 'senha'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'Email do usuário'
            },
            senha: {
              type: 'string',
              format: 'password',
              description: 'Senha do usuário'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Mensagem de erro'
            }
          }
        }
      },
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    tags: [
      {
        name: 'Usuários',
        description: 'Operações relacionadas aos usuários'
      },
      {
        name: 'Reembolsos',
        description: 'Operações relacionadas aos reembolsos'
      }
    ],
    paths: {
      '/api/usuarios/registrar': {
        post: {
          tags: ['Usuários'],
          summary: 'Registrar novo usuário',
          description: 'Cria um novo usuário no sistema',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['nome', 'email', 'senha'],
                  properties: {
                    nome: {
                      type: 'string',
                      example: 'João Silva'
                    },
                    email: {
                      type: 'string',
                      format: 'email',
                      example: 'joao@exemplo.com'
                    },
                    senha: {
                      type: 'string',
                      format: 'password',
                      example: 'senha123'
                    }
                  }
                }
              }
            }
          },
          responses: {
            201: {
              description: 'Usuário criado com sucesso',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: {
                        type: 'string',
                        example: 'Usuário registrado com sucesso'
                      },
                      usuario: {
                        $ref: '#/components/schemas/Usuario'
                      }
                    }
                  }
                }
              }
            },
            400: {
              description: 'Dados inválidos',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error'
                  }
                }
              }
            }
          }
        }
      },
      '/api/usuarios/login': {
        post: {
          tags: ['Usuários'],
          summary: 'Login de usuário',
          description: 'Autentica um usuário e retorna um token',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Login'
                }
              }
            }
          },
          responses: {
            200: {
              description: 'Login realizado com sucesso',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: {
                        type: 'string',
                        example: 'Login realizado com sucesso'
                      },
                      token: {
                        type: 'string',
                        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
                      },
                      usuario: {
                        $ref: '#/components/schemas/Usuario'
                      }
                    }
                  }
                }
              }
            },
            401: {
              description: 'Credenciais inválidas',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error'
                  }
                }
              }
            }
          }
        }
      },
      '/api/usuarios': {
        get: {
          tags: ['Usuários'],
          summary: 'Listar todos os usuários',
          description: 'Retorna uma lista com todos os usuários cadastrados',
          security: [
            {
              bearerAuth: []
            }
          ],
          responses: {
            200: {
              description: 'Lista de usuários',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/Usuario'
                    }
                  }
                }
              }
            },
            401: {
              description: 'Não autorizado',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error'
                  }
                }
              }
            }
          }
        }
      },
      '/api/reembolsos': {
        post: {
          tags: ['Reembolsos'],
          summary: 'Criar novo reembolso',
          description: 'Cria uma nova solicitação de reembolso',
          security: [
            {
              bearerAuth: []
            }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['descricao', 'valor', 'usuarioId'],
                  properties: {
                    descricao: {
                      type: 'string',
                      example: 'Despesa com transporte'
                    },
                    valor: {
                      type: 'number',
                      format: 'float',
                      example: 50.00
                    },
                    usuarioId: {
                      type: 'integer',
                      example: 1
                    }
                  }
                }
              }
            }
          },
          responses: {
            201: {
              description: 'Reembolso criado com sucesso',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Reembolso'
                  }
                }
              }
            },
            400: {
              description: 'Dados inválidos',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error'
                  }
                }
              }
            },
            401: {
              description: 'Não autorizado',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error'
                  }
                }
              }
            }
          }
        },
        get: {
          tags: ['Reembolsos'],
          summary: 'Listar todos os reembolsos',
          description: 'Retorna uma lista com todos os reembolsos',
          security: [
            {
              bearerAuth: []
            }
          ],
          responses: {
            200: {
              description: 'Lista de reembolsos',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/Reembolso'
                    }
                  }
                }
              }
            },
            401: {
              description: 'Não autorizado',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error'
                  }
                }
              }
            }
          }
        }
      },
      '/api/reembolsos/{id}/status': {
        put: {
          tags: ['Reembolsos'],
          summary: 'Atualizar status do reembolso',
          description: 'Atualiza o status de um reembolso específico',
          security: [
            {
              bearerAuth: []
            }
          ],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              description: 'ID do reembolso',
              schema: {
                type: 'integer'
              }
            }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['status'],
                  properties: {
                    status: {
                      type: 'string',
                      enum: ['pendente', 'aprovado', 'rejeitado'],
                      example: 'aprovado'
                    }
                  }
                }
              }
            }
          },
          responses: {
            200: {
              description: 'Status atualizado com sucesso',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Reembolso'
                  }
                }
              }
            },
            400: {
              description: 'Dados inválidos',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error'
                  }
                }
              }
            },
            404: {
              description: 'Reembolso não encontrado',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error'
                  }
                }
              }
            },
            401: {
              description: 'Não autorizado',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error'
                  }
                }
              }
            }
          }
        }
      },
      '/api/reembolsos/{id}': {
        delete: {
          tags: ['Reembolsos'],
          summary: 'Deletar reembolso',
          description: 'Remove um reembolso do sistema',
          security: [
            {
              bearerAuth: []
            }
          ],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              description: 'ID do reembolso',
              schema: {
                type: 'integer'
              }
            }
          ],
          responses: {
            200: {
              description: 'Reembolso deletado com sucesso',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      message: {
                        type: 'string',
                        example: 'Reembolso deletado com sucesso'
                      }
                    }
                  }
                }
              }
            },
            404: {
              description: 'Reembolso não encontrado',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error'
                  }
                }
              }
            },
            401: {
              description: 'Não autorizado',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Error'
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  apis: ['./routes/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = { swaggerUi, swaggerSpec };
