import os
from PIL import Image

src_dir = "Gallery Project"
thumb_dir = "Gallery Project/thumbnails"

if not os.path.exists(thumb_dir):
    os.makedirs(thumb_dir)

for file in os.listdir(src_dir):
    if file.lower().endswith(".jpg"):
        src_path = os.path.join(src_dir, file)
        thumb_path = os.path.join(thumb_dir, file)
        
        if not os.path.exists(thumb_path):
            print(f"Generating thumbnail for {file}...")
            try:
                with Image.open(src_path) as img:
                    exif = img.info.get('exif')
                    img.thumbnail((800, 800))
                    if exif:
                        img.save(thumb_path, exif=exif)
                    else:
                        img.save(thumb_path)
            except Exception as e:
                print(f"Failed to process {file}: {e}")
print("Done.")
