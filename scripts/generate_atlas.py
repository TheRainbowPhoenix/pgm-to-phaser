import json

# Define the size of each image
image_size = 256
grid_size = 3

name = "MAP_Lv1_bridge"

# Initialize the JSON structure
json_structure = {
    "frames": [],
    "meta": {
        "app": "http://www.codeandweb.com/texturepacker",
        "version": "1.0",
        "image": f"{name}.png",
        "format": "RGBA8888",
        "size": {
                "w": grid_size * image_size,
                "h": grid_size * image_size
            },
        "scale": "1",
        "smartupdate": "$TexturePacker:SmartUpdate:0bd9942c57d8ce2036df6d61b997ffee:d3b00db9bd52d2286ca490f22371e19f:7367abe05465f33555345994fbb3342e$"
    }
}

# Loop through the grid and create each frame entry
for i in range(grid_size):
    for j in range(grid_size):
        frame = {
            "filename": f"{name}_{i * grid_size + j}.png",
            "rotated": False,
            "trimmed": False,
            "sourceSize": {
                "w": image_size,
                "h": image_size
            },
            "spriteSourceSize": {
                "x": 0,
                "y": 0,
                "w": image_size,
                "h": image_size
            },
            "frame": {
                "x": j * image_size,
                "y": i * image_size,
                "w": image_size,
                "h": image_size
            }
        }
        json_structure["frames"].append(frame)

# Save the JSON structure to a file
with open(f'../public/assets/ui/map/{name}.json', 'w') as json_file:
    json.dump(json_structure, json_file, indent=4)

print(f"JSON structure generated and saved to {name}.json")
