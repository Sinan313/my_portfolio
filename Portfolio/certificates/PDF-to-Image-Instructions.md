# PDF to Image Conversion Instructions

Your AWS and VLSI certificates are currently set up as PDFs, which works great! However, for better thumbnail previews, you might want to convert them to images.

## Current Setup:
✅ **AWS Certificate**: `AWS Job Simution.pdf` (working as PDF)
✅ **VLSI Certificate**: `vlsi 1-499_signed.pdf` (working as PDF)

## Option 1: Keep as PDFs (Current Setup)
- ✅ PDFs open in new tab when clicked
- ✅ Direct download functionality
- ✅ Full document viewing
- ❌ Thumbnail shows placeholder image

## Option 2: Convert to Images (Recommended)
Convert your PDFs to JPG images for better thumbnails:

### Method 1: Online Conversion
1. Go to https://pdf2go.com/pdf-to-jpg
2. Upload your PDF
3. Select "Convert entire pages"
4. Download as JPG
5. Rename to exact filenames:
   - `aws-certificate.jpg`
   - `vls-certificate.jpg`

### Method 2: Screenshot Method
1. Open PDF in browser/PDF viewer
2. Take screenshot of certificate
3. Crop to show just the certificate
4. Save as JPG with correct filename

### Method 3: Using ImageMagick (Linux/Mac)
```bash
# Convert AWS certificate
convert "AWS Job Simution.pdf[0]" certificates/aws-certificate.jpg

# Convert VLSI certificate  
convert "vlsi 1-499_signed.pdf[0]" certificates/vls-certificate.jpg
```

## File Structure After Conversion:
```
Portfolio/
├── certificates/
│   ├── aws-certificate.jpg (thumbnail image)
│   └── vls-certificate.jpg (thumbnail image)
├── AWS Job Simution.pdf (full PDF for download)
└── vlsi 1-499_signed.pdf (full PDF for download)
```

## What Happens After Conversion:
- ✅ Beautiful thumbnail previews
- ✅ Full-size image in modal
- ✅ Download links to original PDFs
- ✅ Professional appearance
