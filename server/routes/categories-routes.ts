import { Router } from 'express';
import { db } from '../db';
import { categories } from '@shared/schema';
import { eq, isNull } from 'drizzle-orm';
import { log } from '../vite';

// Create router
const router = Router();

/**
 * Get all main categories (not subcategories)
 * @route GET /api/categories
 */
router.get('/', async (req, res) => {
  try {
    const mainCategories = await db.query.categories.findMany({
      where: (category) => isNull(category.parentId),
      orderBy: (category) => category.displayOrder,
    });
    
    res.json(mainCategories);
  } catch (error) {
    log(`Error getting categories: ${error instanceof Error ? error.message : String(error)}`, 'categories');
    res.status(500).json({
      error: 'Unable to get categories'
    });
  }
});

/**
 * Get category by slug
 * @route GET /api/categories/:slug
 */
router.get('/:slug', async (req, res) => {
  try {
    const slug = req.params.slug;
    
    const category = await db.query.categories.findFirst({
      where: (category) => eq(category.slug, slug),
    });
    
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    res.json(category);
  } catch (error) {
    log(`Error getting category: ${error instanceof Error ? error.message : String(error)}`, 'categories');
    res.status(500).json({
      error: 'Unable to get category'
    });
  }
});

/**
 * Get subcategories for a category
 * @route GET /api/categories/:slug/subcategories
 */
router.get('/:slug/subcategories', async (req, res) => {
  try {
    const slug = req.params.slug;
    
    const category = await db.query.categories.findFirst({
      where: (category) => eq(category.slug, slug),
    });
    
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    const subcategories = await db.query.categories.findMany({
      where: (subcategory) => eq(subcategory.parentId, category.id),
      orderBy: (subcategory) => subcategory.displayOrder,
    });
    
    res.json(subcategories);
  } catch (error) {
    log(`Error getting subcategories: ${error instanceof Error ? error.message : String(error)}`, 'categories');
    res.status(500).json({
      error: 'Unable to get subcategories'
    });
  }
});

/**
 * Get products for a category
 * @route GET /api/categories/:slug/products
 */
router.get('/:slug/products', async (req, res) => {
  try {
    const slug = req.params.slug;
    
    const category = await db.query.categories.findFirst({
      where: (category) => eq(category.slug, slug),
    });
    
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    const products = await db.query.products.findMany({
      where: (product) => eq(product.categoryId, category.id),
      orderBy: (product) => [
        product.featured,
        product.createdAt
      ],
      with: {
        vendor: {
          columns: {
            id: true,
            username: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          }
        }
      }
    });
    
    res.json(products);
  } catch (error) {
    log(`Error getting category products: ${error instanceof Error ? error.message : String(error)}`, 'categories');
    res.status(500).json({
      error: 'Unable to get category products'
    });
  }
});

/**
 * Get nested categories with subcategories
 * @route GET /api/categories/nested
 */
router.get('/nested', async (req, res) => {
  try {
    // Get all main categories
    const mainCategories = await db.query.categories.findMany({
      where: (category) => isNull(category.parentId),
      orderBy: (category) => category.displayOrder,
    });
    
    // Create result with subcategories
    const result = await Promise.all(mainCategories.map(async (category) => {
      const subcategories = await db.query.categories.findMany({
        where: (subcategory) => eq(subcategory.parentId, category.id),
        orderBy: (subcategory) => subcategory.displayOrder,
      });
      
      return {
        ...category,
        subcategories
      };
    }));
    
    res.json(result);
  } catch (error) {
    log(`Error getting nested categories: ${error instanceof Error ? error.message : String(error)}`, 'categories');
    res.status(500).json({
      error: 'Unable to get nested categories'
    });
  }
});

export default router;