import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Update categories with images
async function updateCategoryImages() {
  const categories = await prisma.productCategory.findMany();

  const imagesMap = {
    "protection-tete": "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=800&h=600&fit=crop",
    "protection-yeux": "https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?w=800&h=600&fit=crop",
    "protection-auditive": "https://images.unsplash.com/photo-1589903308904-1010c2294adc?w=800&h=600&fit=crop",
    "protection-mains": "https://images.unsplash.com/photo-1623935920795-b9d11a3149e2?w=800&h=600&fit=crop",
    "protection-pieds": "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&h=600&fit=crop",
    "vetements-haute-visibilite": "https://images.unsplash.com/photo-1571687949921-1306bfb24b72?w=800&h=600&fit=crop",
    "travail-hauteur": "https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=800&h=600&fit=crop",
    "protection-respiratoire": "https://images.unsplash.com/photo-1584483766114-2cea6facdf57?w=800&h=600&fit=crop",
    "lutte-incendie": "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop",
    "epc-securisation": "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=800&h=600&fit=crop"
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