# Assets Placeholder

This folder should contain the following image assets:

- **icon.png** (1024x1024): App icon
- **splash.png** (2048x2048): Splash screen
- **adaptive-icon.png** (1024x1024): Android adaptive icon foreground
- **notification-icon.png** (96x96): Notification icon

## Generating Assets

You can create simple placeholder icons using any image editor or generate them online.

For quick testing, you can use Expo's default assets or create solid color images with the dimensions above.

### Example using ImageMagick:

```bash
# Create icon (blue circle)
convert -size 1024x1024 xc:'#3B82F6' -fill white -draw "circle 512,512 512,256" icon.png

# Create splash (gradient)
convert -size 2048x2048 gradient:'#3B82F6'-'#8B5CF6' splash.png

# Create adaptive icon
convert -size 1024x1024 xc:'#3B82F6' -fill white -draw "circle 512,512 512,256" adaptive-icon.png

# Create notification icon (simple white circle)
convert -size 96x96 xc:none -fill white -draw "circle 48,48 48,12" notification-icon.png
```

For production apps, use professional tools like Figma, Sketch, or Adobe Illustrator to create polished icons.
