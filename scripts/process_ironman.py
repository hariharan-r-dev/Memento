import os
import numpy as np
from PIL import Image, ImageFilter
from collections import deque

src_path = r"C:\Users\HarisH\.gemini\antigravity-ide\brain\1d1a3417-f2f6-4c12-9b5f-c49d0c8315c6\iron_man_charm_1790411882029.jpg"
out_png = r"D:\Hariharan R\Lucky charm\src\assets\charms\ironMan.png"
out_master = r"D:\Hariharan R\Lucky charm\src\assets\charms\ironMan_master.jpg"

print(f"Reading source: {src_path} (exists: {os.path.exists(src_path)})")
img = Image.open(src_path).convert("RGB")
img.save(out_master, quality=98)
print(f"Saved master JPG to {out_master}")

arr = np.array(img, dtype=np.int32)
h, w, _ = arr.shape

# BFS Flood Fill from outer border for transparent background
visited = np.zeros((h, w), dtype=bool)
bg_mask = np.zeros((h, w), dtype=bool)
queue = deque()

# Check edges
for y in range(h):
    for x in [0, w - 1]:
        # Background color is light/whiteish (> 225)
        if np.all(arr[y, x] > 220):
            queue.append((y, x))
            visited[y, x] = True
            bg_mask[y, x] = True

for x in range(w):
    for y in [0, h - 1]:
        if not visited[y, x] and np.all(arr[y, x] > 220):
            queue.append((y, x))
            visited[y, x] = True
            bg_mask[y, x] = True

while queue:
    cy, cx = queue.popleft()
    for dy, dx in [(-1, 0), (1, 0), (0, -1), (0, 1), (-1, -1), (-1, 1), (1, -1), (1, 1)]:
        ny, nx = cy + dy, cx + dx
        if 0 <= ny < h and 0 <= nx < w and not visited[ny, nx]:
            visited[ny, nx] = True
            # Check if this pixel is background (near white and close to surrounding background)
            # Threshold > 230 or very close to pure white
            if np.all(arr[ny, nx] > 230):
                bg_mask[ny, nx] = True
                queue.append((ny, nx))
            elif np.all(arr[ny, nx] > 215) and np.max(np.abs(arr[ny, nx] - arr[cy, cx])) < 20:
                bg_mask[ny, nx] = True
                queue.append((ny, nx))

alpha = np.ones((h, w), dtype=np.uint8) * 255
alpha[bg_mask] = 0

# Convert to PIL and save
alpha_img = Image.fromarray(alpha, mode="L")
result = img.convert("RGBA")
result.putalpha(alpha_img)

# Crop closely with a modest 10px margin
non_zero = np.argwhere(alpha > 10)
min_y, min_x = non_zero.min(axis=0)
max_y, max_x = non_zero.max(axis=0)

margin = 12
min_x = max(0, min_x - margin)
min_y = max(0, min_y - margin)
max_x = min(w - 1, max_x + margin)
max_y = min(h - 1, max_y + margin)

cropped_result = result.crop((min_x, min_y, max_x + 1, max_y + 1))
print(f"Cropped size: {cropped_result.size}")

cropped_result.save(out_png, "PNG")
print(f"Successfully saved {out_png}")
