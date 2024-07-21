import json
import xml.etree.ElementTree as ET
# from lxml import etree as ET
from PIL import Image
import os


def generate_font_xml(font_width, font_height, font_name, output_dir, file_name=None):
    if file_name is None:
        file_name = font_name
    
    # Load the image to get dimensions
    image_path = os.path.join(output_dir, f'{file_name}.png')
    image = Image.open(image_path)
    image_width, image_height = image.size

    # Load and process fontList
    data = None
    for font in font_list:
        if font["name"] == font_name:
            data = font
            break
    
    if data is None:
        raise "Font not found"
    

    # Extract letter layout and split by lines
    letter_layout_lines = data['letterLayout'].split('\n')
    xadvance = font_width

    # Create XML structure
    font = ET.Element('font')
    info = ET.SubElement(font, 'info', face=data['ttfName'], size=str(data['fontSize']), bold="0", italic="0",
                         charset="", unicode="0", stretchH="100", smooth="1", aa="1", padding="0,0,0,0", spacing="2,2")
    common = ET.SubElement(font, 'common', lineHeight=str(font_height), base="8", scaleW=str(image_width), scaleH=str(image_height), pages="1", packed="0")
    pages = ET.SubElement(font, 'pages')
    page = ET.SubElement(pages, 'page', id="0", file=f"{file_name}.png")
    chars = ET.SubElement(font, 'chars', count=str(sum(len(line) for line in letter_layout_lines)))

    # Create char elements
    y_offset = 0
    for line in letter_layout_lines:
        for x_offset, char in enumerate(line):
            ET.SubElement(chars, 'char', id=str(ord(char)), x=str(x_offset * font_width), y=str(y_offset),
                          width=str(font_width), height=str(font_height), xoffset="0", yoffset="0",
                          xadvance=str(xadvance), page="0", chnl="0", letter=char)
        y_offset += font_height

    # Convert XML tree to string
    xml_string = ET.tostring(font, encoding='unicode')

    # Pretty print XML string
    import xml.dom.minidom
    dom = xml.dom.minidom.parseString(xml_string)
    pretty_xml_as_string = dom.toprettyxml()

    # Write to file
    with open(os.path.join(output_dir, f"{file_name}.xml"), "w", encoding="utf-8") as f:
        f.write(pretty_xml_as_string)

# Example usage
with open('project.dec.json', 'r', encoding='utf-8') as file:
    data = json.load(file)
    font_list = data['fontList']
    
    generate_font_xml(6, 10, 'font6x10', '../public/assets/bitmapFonts')
    generate_font_xml(8, 8, 'font8x8', '../public/assets/bitmapFonts')
    generate_font_xml(12, 12, 'font12x12', '../public/assets/bitmapFonts')
    generate_font_xml(9, 16, 'GN', '../public/assets/bitmapFonts')
    generate_font_xml(8, 16, 'SN', '../public/assets/bitmapFonts')
    generate_font_xml(6, 10, 'a6*10', '../public/assets/bitmapFonts', 'a6x10')