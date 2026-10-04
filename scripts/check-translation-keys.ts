import { fr } from "../src/lib/i18n/locales/fr";
import { ar } from "../src/lib/i18n/locales/ar";

function getKeys(obj: Record<string, any>, prefix = ""): string[] {
  const keys: string[] = [];
  for (const key of Object.keys(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === "object" && obj[key] !== null && !Array.isArray(obj[key])) {
      keys.push(...getKeys(obj[key], fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

const frKeys = new Set(getKeys(fr));
const arKeys = new Set(getKeys(ar));

const missingInAr = [...frKeys].filter((k) => !arKeys.has(k));
const missingInFr = [...arKeys].filter((k) => !frKeys.has(k));

console.log(`\n📊 Translation Key Sync Report`);
console.log(`   FR keys: ${frKeys.size}`);
console.log(`   AR keys: ${arKeys.size}`);

if (missingInAr.length === 0 && missingInFr.length === 0) {
  console.log(`\n✅ All keys are in sync!`);
  process.exit(0);
} else {
  if (missingInAr.length > 0) {
    console.log(`\n❌ Missing in AR (${missingInAr.length}):`);
    missingInAr.forEach((k) => console.log(`   - ${k}`));
  }
  if (missingInFr.length > 0) {
    console.log(`\n❌ Missing in FR (${missingInFr.length}):`);
    missingInFr.forEach((k) => console.log(`   - ${k}`));
  }
  process.exit(1);
}
