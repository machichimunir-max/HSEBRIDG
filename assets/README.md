# HSE BRIDGE - Assets

This directory contains static assets used by the application.

## Fonts

The `fonts/` directory contains TTF fonts for PDF certificate generation:

- **Amiri-Regular.ttf**: Arabic-capable font for bilingual certificates (FR/AR)
  - Download from: https://github.com/aliftype/amiri/releases
  - License: SIL Open Font License
  - Used for rendering Arabic text in PDF certificates

### Installation

If `Amiri-Regular.ttf` is missing, download it:

```bash
# PowerShell
Invoke-WebRequest -Uri "https://github.com/aliftype/amiri/releases/download/1.000/Amiri-1.000.zip" -OutFile "Amiri.zip"
Expand-Archive -Path "Amiri.zip" -DestinationPath "."
Move-Item "Amiri-Regular.ttf" "assets/fonts/"
Remove-Item "Amiri.zip"
```

Or download manually from GitHub and place `Amiri-Regular.ttf` in `assets/fonts/`.

The certificate generator will automatically detect and use this font for Arabic text.
If the font is missing, certificates will still generate but Arabic text may not render properly.
