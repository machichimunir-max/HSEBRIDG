import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const ADMIN_EMAIL = 'admin@qhse.local';
const ADMIN_PASSWORD = 'Admin123!';
const STUDENT_EMAIL = 'student@qhse.local';
const STUDENT_PASSWORD = 'Student123!';

async function main() {
  await prisma.videoAccessToken.deleteMany();
  await prisma.lessonProgress.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.videoMetadata.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.module.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();

  const adminHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
  const studentHash = await bcrypt.hash(STUDENT_PASSWORD, 12);

  const admin = await prisma.user.create({
    data: {
      email: ADMIN_EMAIL,
      name: 'Local Admin',
      passwordHash: adminHash,
      role: 'ADMIN',
      isActive: true,
    },
  });

  const student = await prisma.user.create({
    data: {
      email: STUDENT_EMAIL,
      name: 'Local Student',
      passwordHash: studentHash,
      role: 'STUDENT',
      isActive: true,
    },
  });

  // Catégories QHSE
  const categories = ['SST', 'Incendie', 'Travail en hauteur', 'Risque électrique', 'EPI', 'ISO 45001', 'ISO 14001', 'LOTO'];

  const courseCatalog = [
    {
      title: 'HSE Fondamentaux du Chantier',
      slug: 'hse-fondamentaux-chantier',
      shortDescription: 'Maîtrisez les essentiels de la santé et sécurité sur vos chantiers.',
      description:
        'Formation complète couvrant les risques majeurs du BTP : prévention des chutes, manutention, risque électrique, et respect des consignes de sécurité. Conforme à la réglementation française et aux obligations de l\'employeur.',
      thumbnail: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80',
      category: 'SST',
      level: 'Débutant',
      duration: 420,
      price: '0',
      isFree: true,
      isPublished: true,
      modules: [
        {
          title: 'Introduction à la Sécurité sur Chantier',
          description: 'Comprendre les enjeux de la prévention et le cadre réglementaire.',
          lessons: [
            { title: 'Statistiques et enjeux de la sécurité BTP', description: 'Chiffres clés, accidents graves et coûts pour l\'entreprise.', durationSeconds: 180, status: 'PUBLISHED', isPreview: true },
            { title: 'Obligations de l\'employeur et des salariés', description: 'Code du travail, plan de prévention, DUERP.', durationSeconds: 210, status: 'PUBLISHED', isPreview: false },
            { title: 'Les acteurs de la prévention', description: 'CARSAT, Inspection du travail, médecin du travail, CSPS.', durationSeconds: 180, status: 'PUBLISHED', isPreview: false },
          ],
        },
        {
          title: 'Risques Majeurs et Prévention',
          description: 'Identifier et prévenir les risques quotidiens.',
          lessons: [
            { title: 'Chutes de hauteur', description: 'Échafaudages, lignes de vie, équipements collectifs.', durationSeconds: 240, status: 'PUBLISHED', isPreview: false },
            { title: 'Manutention manuelle et mécanique', description: 'Gestes et postures, uso de equipamentos de elevação.', durationSeconds: 220, status: 'PUBLISHED', isPreview: false },
            { title: 'Risque électrique', description: 'Travaux sous tension, proximité de lignes électriques.', durationSeconds: 200, status: 'PUBLISHED', isPreview: false },
          ],
        },
      ],
    },
    {
      title: 'Prevention des Risques Incendie',
      slug: 'prevention-risques-incendie',
      shortDescription: 'Apprenez à prévenir et gérer les risques d\'incendie en entreprise.',
      description:
        'Formation théorique et pratique sur la prévention des incendies : prévention, détection, évacuation et manipulation des extincteurs. Obligatoire pour tout établissement recevant du public (ERP).',
      thumbnail: 'https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?auto=format&fit=crop&w=1200&q=80',
      category: 'Incendie',
      level: 'Intermédiaire',
      duration: 300,
      price: '0',
      isFree: true,
      isPublished: true,
      modules: [
        {
          title: 'Fondamentaux de la Prévention Incendie',
          description: 'Comprendre le feu et ses conditions de développement.',
          lessons: [
            { title: 'Le triangle du feu', description: 'Comburant, combustible, source d\'flammation.', durationSeconds: 150, status: 'PUBLISHED', isPreview: true },
            { title: 'Classes de feu et extincteurs', description: 'Types de feux, agents extincteurs, choix de l\'extincteur.', durationSeconds: 200, status: 'PUBLISHED', isPreview: false },
            { title: 'Propagation et compartmentalisation', description: 'Isolement, coupe-feu, désenfumage.', durationSeconds: 180, status: 'PUBLISHED', isPreview: false },
          ],
        },
        {
          title: 'Évacuation et Intervention',
          description: 'Savoir réagir en cas d\'incendie.',
          lessons: [
            { title: 'Plan d\'évacuation', description: 'Parcours d\'évacuation, issues de secours, balisage.', durationSeconds: 180, status: 'PUBLISHED', isPreview: false },
            { title: 'Manipulation d\'un extincteur', description: 'Demonstração prática do uso de extintor.', durationSeconds: 200, status: 'PUBLISHED', isPreview: false },
            { title: 'Exercice d\'évacuation', description: 'Mise en pratique : alarme, évacuation, point de rassemblement.', durationSeconds: 180, status: 'PUBLISHED', isPreview: false },
          ],
        },
      ],
    },
  ];

  for (const courseSeed of courseCatalog) {
    const course = await prisma.course.create({
      data: {
        title: courseSeed.title,
        slug: courseSeed.slug,
        shortDescription: courseSeed.shortDescription,
        description: courseSeed.description,
        thumbnail: courseSeed.thumbnail,
        category: courseSeed.category,
        level: courseSeed.level,
        duration: courseSeed.duration,
        price: Number(courseSeed.price),
        isFree: courseSeed.isFree,
        isPublished: courseSeed.isPublished,
      },
    });

    for (const [moduleIndex, moduleSeed] of courseSeed.modules.entries()) {
      const module = await prisma.module.create({
        data: {
          courseId: course.id,
          title: moduleSeed.title,
          description: moduleSeed.description,
          order: moduleIndex + 1,
        },
      });

      for (const [lessonIndex, lessonSeed] of moduleSeed.lessons.entries()) {
        const lesson = await prisma.lesson.create({
          data: {
            moduleId: module.id,
            title: lessonSeed.title,
            description: lessonSeed.description,
            durationSeconds: lessonSeed.durationSeconds,
            order: lessonIndex + 1,
            status: lessonSeed.status,
            isPreview: lessonSeed.isPreview,
            videoMetadata: {
              create: {
                videoProvider: 'LOCAL',
                providerVideoId: `local-dev-${course.slug}-${moduleIndex + 1}-${lessonIndex + 1}`,
                duration: lessonSeed.durationSeconds,
                thumbnail: course.thumbnail,
              },
            },
          },
          include: { videoMetadata: true },
        });

        if (lessonIndex === 0 && moduleIndex === 0 && courseSeed.slug === 'frontend-foundations') {
          await prisma.lessonProgress.create({
            data: {
              userId: student.id,
              lessonId: lesson.id,
              isStarted: true,
              isCompleted: true,
              completionPercent: 100,
              watchTimeSeconds: lesson.durationSeconds,
              lastWatchedAt: new Date(),
            },
          });
        }
      }
    }
  }

  const firstCourse = await prisma.course.findFirst({ where: { isPublished: true }, orderBy: { createdAt: 'asc' } });
  const secondCourse = await prisma.course.findFirst({ where: { isPublished: true }, orderBy: { createdAt: 'desc' } });

  if (firstCourse) {
    await prisma.enrollment.create({
      data: {
        userId: student.id,
        courseId: firstCourse.id,
        isActive: true,
      },
    });
  }

  if (secondCourse && secondCourse.id !== firstCourse?.id) {
    await prisma.enrollment.create({
      data: {
        userId: student.id,
        courseId: secondCourse.id,
        isActive: true,
      },
    });
  }

  console.log('Seed complete.');
  console.log('Development admin login:');
  console.log(`Email: ${ADMIN_EMAIL}`);
  console.log(`Password: ${ADMIN_PASSWORD}`);
  console.log('Development student login:');
  console.log(`Email: ${STUDENT_EMAIL}`);
  console.log(`Password: ${STUDENT_PASSWORD}`);
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
