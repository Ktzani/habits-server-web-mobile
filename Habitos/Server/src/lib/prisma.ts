import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient({
    log: ['query'] //Mostra todas as querys feitas no banco
})  // Aqui temos acesso a todas as tabelas do meu banco de dados