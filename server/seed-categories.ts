import { db } from './db';
import { categories, products } from '@shared/schema';
import { eq } from 'drizzle-orm';

/**
 * Seed Amazon-like categories with unique styling for each category
 */
export async function seedCategories() {
  try {
    // First check if categories already exist
    const existingCategories = await db.select().from(categories);
    
    if (existingCategories.length > 0) {
      console.log('Categories already seeded, skipping...');
      return;
    }
    
    console.log('Seeding categories...');
    
    // Main categories with unique styling
    const mainCategories = [
      {
        name: 'Electronics',
        slug: 'electronics',
        description: 'Discover the latest in electronics - smartphones, laptops, gaming consoles and more',
        isSubcategory: false,
        displayOrder: 1,
        iconName: 'laptop',
        featuredInHomepage: true,
        titleFontSize: 'large',
        titleFontWeight: 'bold',
        colorScheme: '#0066CC',
        isActive: true
      },
      {
        name: 'Clothing & Fashion',
        slug: 'clothing-fashion',
        description: 'Stay on trend with our range of clothing, shoes, and accessories',
        isSubcategory: false,
        displayOrder: 2,
        iconName: 'shirt',
        featuredInHomepage: true,
        titleFontSize: 'large',
        titleFontWeight: 'bold',
        colorScheme: '#FF6600',
        isActive: true
      },
      {
        name: 'Home & Kitchen',
        slug: 'home-kitchen',
        description: 'Everything you need to make your house a home',
        isSubcategory: false,
        displayOrder: 3,
        iconName: 'home',
        featuredInHomepage: true,
        titleFontSize: 'large',
        titleFontWeight: 'bold',
        colorScheme: '#669900',
        isActive: true
      },
      {
        name: 'Books & Media',
        slug: 'books-media',
        description: 'Books, music, films, and more for every taste',
        isSubcategory: false,
        displayOrder: 4,
        iconName: 'book',
        featuredInHomepage: true,
        titleFontSize: 'large',
        titleFontWeight: 'bold',
        colorScheme: '#993399',
        isActive: true
      },
      {
        name: 'Beauty & Health',
        slug: 'beauty-health',
        description: 'Look and feel your best with our beauty and health products',
        isSubcategory: false,
        displayOrder: 5,
        iconName: 'heart',
        featuredInHomepage: true,
        titleFontSize: 'large',
        titleFontWeight: 'bold',
        colorScheme: '#FF3366',
        isActive: true
      },
      {
        name: 'Sports & Outdoors',
        slug: 'sports-outdoors',
        description: 'Gear up for adventure with our sports and outdoor equipment',
        isSubcategory: false,
        displayOrder: 6,
        iconName: 'tennis-ball',
        featuredInHomepage: true,
        titleFontSize: 'large',
        titleFontWeight: 'bold',
        colorScheme: '#33CC99',
        isActive: true
      },
      {
        name: 'Toys & Games',
        slug: 'toys-games',
        description: 'Fun for all ages with our toys and games collection',
        isSubcategory: false,
        displayOrder: 7,
        iconName: 'puzzle',
        featuredInHomepage: true,
        titleFontSize: 'large',
        titleFontWeight: 'bold',
        colorScheme: '#FFCC00',
        isActive: true
      },
      {
        name: 'Grocery',
        slug: 'grocery',
        description: 'Fresh food and pantry essentials delivered to your door',
        isSubcategory: false,
        displayOrder: 8,
        iconName: 'shopping-basket',
        featuredInHomepage: true,
        titleFontSize: 'large',
        titleFontWeight: 'bold',
        colorScheme: '#00CC66',
        isActive: true
      }
    ];
    
    // Insert main categories
    const insertedMainCategories = await db.insert(categories).values(mainCategories).returning();
    
    console.log(`Inserted ${insertedMainCategories.length} main categories`);
    
    // Create subcategories for Electronics
    const electronicsId = insertedMainCategories.find(c => c.slug === 'electronics')?.id;
    
    if (electronicsId) {
      const electronicsSubcategories = [
        {
          name: 'Smartphones',
          slug: 'smartphones',
          description: 'The latest smartphones from top brands',
          parentId: electronicsId,
          isSubcategory: true,
          displayOrder: 1,
          iconName: 'smartphone',
          titleFontSize: 'medium',
          titleFontWeight: 'normal',
          colorScheme: '#0066CC',
          isActive: true
        },
        {
          name: 'Laptops',
          slug: 'laptops',
          description: 'Powerful laptops for work and play',
          parentId: electronicsId,
          isSubcategory: true,
          displayOrder: 2,
          iconName: 'laptop',
          titleFontSize: 'medium',
          titleFontWeight: 'normal',
          colorScheme: '#0066CC',
          isActive: true
        },
        {
          name: 'Audio',
          slug: 'audio',
          description: 'Headphones, speakers, and more',
          parentId: electronicsId,
          isSubcategory: true,
          displayOrder: 3,
          iconName: 'headphones',
          titleFontSize: 'medium',
          titleFontWeight: 'normal',
          colorScheme: '#0066CC',
          isActive: true
        },
        {
          name: 'Wearables',
          slug: 'wearables',
          description: 'Smartwatches, fitness trackers, and more',
          parentId: electronicsId,
          isSubcategory: true,
          displayOrder: 4,
          iconName: 'watch',
          titleFontSize: 'medium',
          titleFontWeight: 'normal',
          colorScheme: '#0066CC',
          isActive: true
        }
      ];
      
      await db.insert(categories).values(electronicsSubcategories);
    }
    
    // Create subcategories for Grocery
    const groceryId = insertedMainCategories.find(c => c.slug === 'grocery')?.id;
    
    if (groceryId) {
      const grocerySubcategories = [
        {
          name: 'Fresh Food',
          slug: 'fresh-food',
          description: 'Fresh fruits, vegetables, meat, and more',
          parentId: groceryId,
          isSubcategory: true,
          displayOrder: 1,
          iconName: 'apple',
          titleFontSize: 'medium',
          titleFontWeight: 'normal',
          colorScheme: '#00CC66',
          isActive: true
        },
        {
          name: 'Pantry',
          slug: 'pantry',
          description: 'Staples and essentials for your kitchen',
          parentId: groceryId,
          isSubcategory: true,
          displayOrder: 2,
          iconName: 'package',
          titleFontSize: 'medium',
          titleFontWeight: 'normal',
          colorScheme: '#00CC66',
          isActive: true
        },
        {
          name: 'Snacks',
          slug: 'snacks',
          description: 'Delicious treats and snacks',
          parentId: groceryId,
          isSubcategory: true,
          displayOrder: 3,
          iconName: 'cookie',
          titleFontSize: 'medium',
          titleFontWeight: 'normal',
          colorScheme: '#00CC66',
          isActive: true
        },
        {
          name: 'Drinks',
          slug: 'drinks',
          description: 'Beverages for every occasion',
          parentId: groceryId,
          isSubcategory: true,
          displayOrder: 4,
          iconName: 'coffee',
          titleFontSize: 'medium',
          titleFontWeight: 'normal',
          colorScheme: '#00CC66',
          isActive: true
        }
      ];
      
      await db.insert(categories).values(grocerySubcategories);
    }
    
    // Add subcategories for other main categories
    // (Simplified for brevity)
    
    console.log('Categories seeding completed successfully');
  } catch (error) {
    console.error('Error seeding categories:', error);
  }
}