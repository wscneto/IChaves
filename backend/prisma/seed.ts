import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Variável de ambiente carregada:', process.env.DATABASE_URL);
  console.log('Iniciando o processo de seed...')

  // Criar ou atualizar um usuário que é um Administrador
  const admin = await prisma.user.upsert({
    where: {
      Email: 'admin@ichaves.com',
    },
    update: {
      Name: 'Secretaria',
      // Atualiza o registro 'Admin' relacionado a este usuário
      Admin: {
        upsert: {
          create: {}, // O modelo Admin não tem campos extras, apenas a relação
          update: {}, // Não há campos para atualizar no Admin
        },
      },
    },
    create: {
      Name: 'Secretaria',
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
  console.log('Administrador criado/atualizado:', admin)

  // Criar ou atualizar um usuário que é um Estudante
  const student = await prisma.user.upsert({
    where: {
      Email: 'wscn@ichaves.com',
    },
    update: {
      Name: 'Walter Soares Costa Neto',
      // Atualiza o registro 'Student' relacionado com seus dados específicos
      Student: {
        upsert: {
          create: {
            Course: 'Ciência da Computação',
            Period: '3',
          },
          update: {
            Course: 'Ciência da Computação',
            Period: '3',
          },
        },
      },
    },
    create: {
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
  console.log('Estudante criado/atualizado:', student)

  // Criar ou atualizar um segundo usuário estudante para teste
  const student2 = await prisma.user.upsert({
    where: {
      Email: 'joao@example.com',
    },
    update: {
      Name: 'João Silva',
      Student: {
        upsert: {
          create: {
            Course: 'Engenharia de Computação',
            Period: '5',
          },
          update: {
            Course: 'Engenharia de Computação',
            Period: '5',
          },
        },
      },
    },
    create: {
      Name: 'João Silva',
      Email: 'joao@example.com',
      Student: {
        create: {
          Course: 'Engenharia de Computação',
          Period: '5',
        },
      },
    },
    include: {
      Student: true,
    },
  })
  console.log('Segundo estudante criado/atualizado:', student2)

  // Criar ou atualizar salas baseadas nos dados do frontend
  const classrooms = [
      {
          Name: 'Armário 01',
          NameResponsible: 'Secretaria',
          IDResponsible: 1,
          Description: 'Armário para guardar pertences pessoais',
          State: 'Disponivel',
          SecretaryNote: 'Armário em bom estado',
          Equipment: '',
          Capacity: 1,
      },
      {
          Name: 'Armário 02',
          NameResponsible: 'Secretaria',
          IDResponsible: 1,
          Description: 'Armário para guardar pertences pessoais',
          State: 'Disponivel',
          SecretaryNote: 'Armário em bom estado',
          Equipment: '',
          Capacity: 1,
      },
      {
          Name: 'Armário 03',
          NameResponsible: 'Secretaria',
          IDResponsible: 1,
          Description: 'Armário para guardar pertences pessoais',
          State: 'Disponivel',
          SecretaryNote: 'Armário em bom estado',
          Equipment: '',
          Capacity: 1,
      },
      {
          Name: 'Armário 04',
          NameResponsible: 'Secretaria',
          IDResponsible: 1,
          Description: 'Armário para guardar pertences pessoais',
          State: 'Disponivel',
          SecretaryNote: 'Armário em manutenção',
          Equipment: '',
          Capacity: 1,
      },
      {
          Name: 'Armário 05',
          NameResponsible: 'Secretaria',
          IDResponsible: 1,
          Description: 'Armário para guardar pertences pessoais',
          State: 'Disponivel',
          SecretaryNote: 'Armário em bom estado',
          Equipment: '',
          Capacity: 1,
      },
      {
          Name: 'Armário 06',
          NameResponsible: 'Secretaria',
          IDResponsible: 1,
          Description: 'Armário para guardar pertences pessoais',
          State: 'Disponivel',
          SecretaryNote: 'Armário em bom estado',
          Equipment: '',
          Capacity: 1,
      },
      {
          Name: 'Laboratório 03',
          NameResponsible: 'Secretaria',
          IDResponsible: 1,
          Description: 'Laboratório de informática com equipamentos modernos',
          State: 'Disponivel',
          SecretaryNote: 'Equipamentos atualizados em 2024',
          Equipment: 'Computadores, Quadro Branco, TVs, Projetor',
          Capacity: 25,
      },
      {
          Name: 'Sala de Convivência',
          NameResponsible: 'Secretaria',
          IDResponsible: 1,
          Description: 'Pequena sala para convivência dos alunos',
          State: 'Disponivel',
          SecretaryNote: 'Em manutenção - problemas no ar condicionado',
          Equipment: 'Sofá, Cafeteira, Micro-ondas',
          Capacity: 10,
      },
      {
          Name: 'Sala de Estudos',
          NameResponsible: 'Secretaria',
          IDResponsible: 1,
          Description: 'Sala silenciosa para estudos individuais e em grupo',
          State: 'Disponivel',
          SecretaryNote: 'Sala com excelente acústica',
          Equipment: 'Computadores, Mesas individuais, Ar condicionado',
          Capacity: 15,
      },
  ]

  // Criar ou atualizar salas baseadas no nome
  for (const classroom of classrooms) {
    const existingClassroom = await prisma.classroom.findFirst({
      where: {
        Name: classroom.Name,
      },
    })

    if (existingClassroom) {
      // Atualizar sala existente
      const updatedClassroom = await prisma.classroom.update({
          where: {
              IDClassroom: existingClassroom.IDClassroom,
          },
          data: {
              NameResponsible: classroom.NameResponsible,
              IDResponsible: classroom.IDResponsible,
              Description: classroom.Description,
              State: classroom.State,
              SecretaryNote: classroom.SecretaryNote,
              Equipment: classroom.Equipment,
              Capacity: classroom.Capacity,
          },
      })
      console.log(`Sala ${classroom.Name} atualizada:`, updatedClassroom)
    } else {
      // Criar nova sala
      const newClassroom = await prisma.classroom.create({
        data: classroom,
      })
      console.log(`Sala ${classroom.Name} criada:`, newClassroom)
    }
  }
  console.log('Todas as salas de exemplo foram criadas/atualizadas com sucesso.')
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