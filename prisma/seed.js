// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // -------- Organization --------
  let org = await prisma.organization.findFirst({ where: { slug: 'vodafone-opex' } });
  if (!org) {
    org = await prisma.organization.create({
      data: { name: 'Vodafone OpEx', slug: 'vodafone-opex' }
    });
  }

  // -------- Teams (unique: key) --------
  const uam = await prisma.team.upsert({
    where: { key: 'UAM' },
    update: {},
    create: { key: 'UAM', name: 'UAM', organization: { connect: { id: org.id } } }
  });

  const audit = await prisma.team.upsert({
    where: { key: 'AUDIT_CHANGE' },
    update: {},
    create: { key: 'AUDIT_CHANGE', name: 'Audit and Change', organization: { connect: { id: org.id } } }
  });

  const rep = await prisma.team.upsert({
    where: { key: 'REPORTING' },
    update: {},
    create: { key: 'REPORTING', name: 'Reporting', organization: { connect: { id: org.id } } }
  });

  // -------- Users (unique: email) --------
  const ahmet = await prisma.user.upsert({
    where: { email: 'ahmet.koylu@vodafone.com' },
    update: {},
    create: {
      email: 'ahmet.koylu@vodafone.com',
      name: 'Ahmet Koylu',
      role: 'manager',
      organization: { connect: { id: org.id } }
    }
  });

  const kubra = await prisma.user.upsert({
    where: { email: 'kubra.aydin@vodafone.com' },
    update: {},
    create: {
      email: 'kubra.aydin@vodafone.com',
      name: 'Kübra Aydın',
      role: 'user',
      organization: { connect: { id: org.id } }
    }
  });

  const ulas = await prisma.user.upsert({
    where: { email: 'ulas.tascioglu@vodafone.com' },
    update: {},
    create: {
      email: 'ulas.tascioglu@vodafone.com',
      name: 'Ulaş Taşçıoğlu',
      role: 'user',
      organization: { connect: { id: org.id } }
    }
  });

  // -------- Memberships --------
  await prisma.membership.createMany({
    data: [
      { userId: ahmet.id, teamId: uam.id },
      { userId: ahmet.id, teamId: audit.id },
      { userId: ahmet.id, teamId: rep.id },
      { userId: kubra.id, teamId: rep.id },
      { userId: ulas.id,  teamId: rep.id },
    ],
    skipDuplicates: true,
  });

  console.log('✔ Seed tamam (org + teams + users + memberships)');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
