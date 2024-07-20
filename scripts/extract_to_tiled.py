import json
import xml.etree.ElementTree as ET
# from lxml import etree as ET

# Constants
TILE_WIDTH = 16
TILE_HEIGHT = 16

# Load JSON data
with open('project.dec.json', 'r', encoding='utf-8') as file:
    data = json.load(file)

# ---------------------------------------------------------------
# Tiles Sets
# Print tileset value


# Load and process tilesetList
tileset_list = data['tilesetList']
tileset_details = {}
firstgid = 1

# Fake layer used for collision
# tilesets.append(9999)
# tileset_list.append({
#     'id': 9999,
#     'name': "block_moves",
#     'horzTileCount': 3,
#     'vertTileCount': 4,
#     'wallSetting': [
#         15, 0, 0,
#         0, 0, 0,
#         0, 0, 0,
#         0, 0, 0
#     ]
# })

for tileset in tileset_list:
    tileset_id = tileset['id']
    tileset_name = tileset['name']
    horz_tile_count = tileset['horzTileCount']
    vert_tile_count = tileset['vertTileCount']
    tilecount = horz_tile_count * vert_tile_count
    tile_map_width = horz_tile_count * TILE_WIDTH
    tile_map_height = vert_tile_count * TILE_HEIGHT
    wall_setting = tileset['wallSetting']

    tileset_details[tileset_id] = {
        'name': tileset_name,
        'width': tile_map_width,
        'height': tile_map_height,
        'tilecount': tilecount,
        'columns': horz_tile_count,
        'firstgid': firstgid
    }

    firstgid += tilecount

    # Create XML structure for the tileset
    tileset_element = ET.Element('tileset', {
        'version': '1.9',
        'tiledversion': '1.9.2',
        'name': tileset_name,
        'tilewidth': str(TILE_WIDTH),
        'tileheight': str(TILE_HEIGHT),
        'tilecount': str(tilecount),
        'columns': str(horz_tile_count)
    })

    image_element = ET.SubElement(tileset_element, 'image', {
        'source': f"{tileset_name}.png",
        'width': str(tile_map_width),
        'height': str(tile_map_height)
    })

    # Add collision data
    for tile_id, collision in enumerate(wall_setting):
        if collision != 0:
            tile_element = ET.SubElement(
                tileset_element, 'tile', {'id': str(tile_id)})
            objectgroup_element = ET.SubElement(tile_element, 'objectgroup', {
                                                'draworder': 'index', 'id': '2'})
            ET.SubElement(objectgroup_element, 'object', {
                'id': '1',
                'x': '0',
                'y': '0',
                'width': str(TILE_WIDTH),
                'height': str(TILE_HEIGHT)
            })

     # Save the tileset XML to a file
    tree = ET.ElementTree(tileset_element)
    ET.indent(tree, space=" ", level=0)  # For pretty-printing
    tileset_filename = f"tilesets/{tileset_name}.tsx"
    tree.write(tileset_filename, encoding="UTF-8", xml_declaration=True)
    print(f"Tileset XML has been generated as '{tileset_filename}'.")



# ---------------------------------------------------------------


# Function to convert layer data to tiled format


def convert_layer_to_tiled(layer_data, width, height):
    tiled_format = [[0] * width for _ in range(height)]

    for key, value in layer_data['tile'].items():
        x, y = map(int, key.split(','))
        tileset_id = value['tilesetId']
        tile_x = value['x']
        tile_y = value['y']

        # Calculate the tile index
        tileset_info = tileset_details[tileset_id]
        tile_index = tileset_info['firstgid'] + (tile_y * tileset_info['columns'] + tile_x)
        tiled_format[y][x] = tile_index

    return tiled_format

# ----------------------------------------------------------
# Scenes

# Find the object with name "Bridge0" in sceneList
scene_name = 'unknown'
bridge_object = None
for obj in data['sceneList']:
    scene_name = obj.get('name')
    bridge_object = obj

    if scene_name in ["menu scene", "title", "gameover", "end1", "end2"]:
        print(f'Ignoring {scene_name} ...')
        continue
    # if obj.get('name') == 'Bridge0':
    #     bridge_object = obj
    #     break

    # if not bridge_object:
    #     raise ValueError('Object with name "Bridge0" not found.')

    # Get limitAreaWidth and limitAreaHeight
    limit_area_width = bridge_object['limitAreaWidth']
    limit_area_height = bridge_object['limitAreaHeight']

    # Calculate width and height in terms of tiles
    map_width = (limit_area_width // TILE_WIDTH) + 1
    map_height = (limit_area_height // TILE_HEIGHT) + 1

    tilesets = bridge_object['tileset']


    # Convert and print each layer
    layers = {k: v for k, v in bridge_object.items() if k.startswith(
        'layer') and not k.startswith('layerMove')}
    converted_layers = {}

    for layer_name, layer_data in layers.items():
        # print(f"{layer_name} in Tiled format:")
        converted_layers[layer_name] = convert_layer_to_tiled(
            layer_data, map_width, map_height)

    # Create XML structure
    map_element = ET.Element('map', {
        'version': '1.9',
        'tiledversion': '1.9.2',
        'orientation': 'orthogonal',
        'renderorder': 'right-down',
        'width': str(map_width),
        'height': str(map_height),
        'tilewidth': str(TILE_WIDTH),
        'tileheight': str(TILE_HEIGHT),
        'infinite': '0',
        'nextlayerid': str(len(converted_layers) + 1),
        'nextobjectid': '1'
    })

    for tileset_id in tilesets:
        tileset_info = tileset_details[int(tileset_id)]
        tileset_element = ET.SubElement(map_element, 'tileset', {
            'firstgid': str(tileset_info['firstgid']),
            'source': f'tilesets/{tileset_info["name"]}.tsx'
        })

    layer_id = 1
    for layer_name, tiled_layer in reversed(converted_layers.items()):
        layer_element = ET.SubElement(map_element, 'layer', {
            'id': str(layer_id),
            'name': layer_name,
            'width': str(map_width),
            'height': str(map_height)
        })
        data_element = ET.SubElement(layer_element, 'data', {
            'encoding': 'csv'
        })

        # Flatten the tiled_layer list and join as a CSV string
        flattened_data = ','.join(str(tile) for row in tiled_layer for tile in row)
        data_element.text = flattened_data

        layer_id += 1


    # Generate the XML string
    tree = ET.ElementTree(map_element)
    ET.indent(tree, space=" ", level=0)  # For pretty-printing
    tree.write(f"scenes/{scene_name}.tmx", encoding="UTF-8", xml_declaration=True)

    print(f"TMX file has been generated as '{scene_name}.tmx'.")
