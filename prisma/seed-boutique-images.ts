import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Update categories with images
async function updateCategoryImages() {
  const categories = await prisma.productCategory.findMany();

  const imagesMap = {
    "protection-tete": "/images/boutique/categories/protection-tete.svg",
    "protection-yeux": "/images/boutique/categories/protection-yeux.svg",
    "protection-auditive": "/images/boutique/categories/protection-auditive.svg",
    "protection-mains": "/images/boutique/categories/protection-mains.svg",
    "protection-pieds": "/images/boutique/categories/protection-pieds.svg",
    "vetements-haute-visibilite": "/images/boutique/categories/vetements-haute-visibilite.svg",
    "travail-hauteur": "/images/boutique/categories/travail-hauteur.svg",
    "protection-respiratoire": "/images/boutique/categories/protection-respiratoire.svg",
    "lutte-incendie": "/images/boutique/categories/lutte-incendie.svg",
    "epc-securisation": "/images/boutique/categories/epc-securisation.svg",
    "epi-divers": "/images/boutique/categories/epi-divers.svg",
  };

  for (const category of categories) {
    if (imagesMap[category.slug as keyof typeof imagesMap]) {
      await prisma.productCategory.update({
        where: { id: category.id },
        data: { image: imagesMap[category.slug as keyof typeof imagesMap] }
      });
      console.log(`✅ Updated image for: ${category.titleFr}`);
    }
  }
}

updateCategoryImages()
  .then(() => {
    console.log('✨ All categories updated with professional images!');
    process.exit(0);
  })
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  });