import json

# Define the size of each image
image_w_size = 96
image_h_size = 96
grid_w_size = 4
grid_h_size = 4

name = "bullets"

# Initialize the JSON structure
json_structure = {
    "frames": [],
    "meta": {
        "app": "http://www.codeandweb.com/texturepacker",
        "version": "1.0",
        "image": f"{name}.png",
        "format": "RGBA8888",
        "size": {
                "w": grid_w_size * image_w_size,
                "h": grid_h_size * image_h_size
            },
        "scale": "1",
        "smartupdate": "$TexturePacker:SmartUpdate:0bd9942c57d8ce2036df6d61b997ffee:d3b00db9bd52d2286ca490f22371e19f:7367abe05465f33555345994fbb3342e$"
    }
}

# Loop through the grid and create each frame entry
for y in range(grid_h_size):
    for x in range(grid_w_size):
        frame = {
            "filename": f"{name}_{y * grid_h_size + x}.png",
            "rotated": False,
            "trimmed": False,
            "sourceSize": {
                "w": image_w_size,
                "h": image_h_size
            },
            "spriteSourceSize": {
                "x": 0,
                "y": 0,
                "w": image_w_size,
                "h": image_h_size
            },
            "frame": {
                "x": x * image_w_size,
                "y": y * image_h_size,
                "w": image_w_size,
                "h": image_h_size
            }
        }
        json_structure["frames"].append(frame)

# Save the JSON structure to a file
with open(f'../public/assets/atlas/{name}.json', 'w') as json_file:
    json.dump(json_structure, json_file, indent=4)

print(f"JSON structure generated and saved to {name}.json")
