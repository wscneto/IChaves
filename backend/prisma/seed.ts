import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Variável de ambiente carregada:', process.env.DATABASE_URL);
  console.log('Iniciando o processo de seed...')

  // Criar um usuário que é um Administrador
  const admin = await prisma.user.create({
    data: {
      Name: 'Admin Sistema',
      Email: 'admin@ichaves.com',
      // Cria o registro 'Admin' relacionado a este usuário
      Admin: {
        create: {}, // O modelo Admin não tem campos extras, apenas a relação
      },
    },
    include: {
      Admin: true, // Inclui o dado do Admin na resposta para confirmação
    },
  })
  console.log('Administrador criado:', admin)

  // Criar um usuário que é um Estudante
  const student = await prisma.user.create({
    data: {
      Name: 'Walter Soares Costa Neto',
      Email: 'wscn@ichaves.com',
      // Cria o registro 'Student' relacionado com seus dados específicos
      Student: {
        create: {
          Course: 'Ciência da Computação',
          Period: '3',
        },
      },
    },
    include: {
      Student: true, // Inclui o dado do Estudante na resposta para confirmação
    },
  })
  console.log('Estudante criado:', student)

  // Criar salas baseadas nos dados do frontend
  await prisma.classroom.createMany({
    data: [
      {
        Name: 'Armário 01',
        Responsible: 'Secretaria',
        Description: 'Armário para guardar pertences pessoais',
        State: 'Disponivel',
        SecretaryNote: 'Armário em bom estado',
        Equipment: '',
        Capacity: 1,
      },
      {
        Name: 'Armário 02',
        Responsible: 'Secretaria',
        Description: 'Armário para guardar pertences pessoais',
        State: 'Em uso',
        SecretaryNote: 'Armário em bom estado',
        Equipment: '',
        Capacity: 1,
      },
      {
        Name: 'Armário 03',
        Responsible: 'Secretaria',
        Description: 'Armário para guardar pertences pessoais',
        State: 'Disponivel',
        SecretaryNote: 'Armário em bom estado',
        Equipment: '',
        Capacity: 1,
      },
      {
        Name: 'Armário 04',
        Responsible: 'Secretaria',
        Description: 'Armário para guardar pertences pessoais',
        State: 'Indisponivel',
        SecretaryNote: 'Armário em manutenção',
        Equipment: '',
        Capacity: 1,
      },
      {
        Name: 'Armário 05',
        Responsible: 'Secretaria',
        Description: 'Armário para guardar pertences pessoais',
        State: 'Disponivel',
        SecretaryNote: 'Armário em bom estado',
        Equipment: '',
        Capacity: 1,
      },
      {
        Name: 'Armário 06',
        Responsible: 'Secretaria',
        Description: 'Armário para guardar pertences pessoais',
        State: 'Em uso',
        SecretaryNote: 'Armário em bom estado',
        Equipment: '',
        Capacity: 1,
      },
      {
        Name: 'Laboratório 03',
        Responsible: 'Secretaria',
        Description: 'Laboratório de informática com equipamentos modernos',
        State: 'Disponivel',
        SecretaryNote: 'Equipamentos atualizados em 2024',
        Equipment: 'Computadores, Quadro Branco, TVs, Projetor',
        Capacity: 25,
      },
      {
        Name: 'Sala de Convivência',
        Responsible: 'Secretaria',
        Description: 'Pequena sala para convivência dos alunos',
        State: 'Indisponivel',
        SecretaryNote: 'Em manutenção - problemas no ar condicionado',
        Equipment: 'Sofá, Cafeteira, Micro-ondas',
        Capacity: 10,
      },
      {
        Name: 'Sala de Estudos',
        Responsible: 'Secretaria',
        Description: 'Sala silenciosa para estudos individuais e em grupo',
        State: 'Disponivel',
        SecretaryNote: 'Sala com excelente acústica',
        Equipment: 'Computadores, Mesas individuais, Ar condicionado',
        Capacity: 15,
      }
    ],
  })
  console.log('Salas de exemplo criadas com sucesso.')
}

main()
  .catch((e) => {
    console.error('Ocorreu um erro durante o processo de seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    console.log('Desconectado do banco de dados.')
  })