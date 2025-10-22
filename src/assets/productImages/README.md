# Product Images Directory

This directory stores product images uploaded through the admin panel.

## Naming Convention

Images are automatically renamed based on the product name:
- Format: `{sanitized_product_name}_image{number}.{extension}`
- Example: `iphone_16_image1.jpg`, `iphone_16_image2.png`

## File Validation

- **Supported formats**: JPEG, PNG, WebP
- **Maximum size**: 5MB per image
- **Maximum images per product**: 4

## Usage

1. Admin logs in and goes to Products page
2. Fills in product details (name, price, category, etc.)
3. Selects up to 4 images using the file input
4. Images are automatically renamed and stored in this directory
5. Product is saved to Firebase with image paths

## File Structure

```
src/assets/productImages/
├── README.md
├── .gitkeep
├── product_name_image1.jpg
├── product_name_image2.png
└── ...
```

## Notes

- Images are sanitized to remove special characters
- Spaces are replaced with underscores
- All names are converted to lowercase
- Duplicate names are handled by the upload system
