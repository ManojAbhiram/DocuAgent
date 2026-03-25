import cv2
import numpy as np
import os
from paddleocr import PaddleOCR
from pdf2image import convert_from_path

# Initialize PaddleOCR globally so we don't reload it every request
try:
    ocr_model = PaddleOCR(use_angle_cls=True, lang="en", use_gpu=False, show_log=False)
except Exception:
    ocr_model = None


def enhance_image(image_path, output_name=None):
    image = cv2.imread(image_path)
    if image is None:
        raise FileNotFoundError(f"Image not found: {image_path}")

    # Noise reduction & contrast enhancement
    filtered = cv2.bilateralFilter(image, 10, 75, 75)
    lab = cv2.cvtColor(filtered, cv2.COLOR_BGR2LAB)
    l, a, b = cv2.split(lab)
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    cl = clahe.apply(l)
    lab_enhanced = cv2.merge((cl, a, b))
    contrast_enhanced = cv2.cvtColor(lab_enhanced, cv2.COLOR_LAB2BGR)

    # Sharpening
    kernel_sharp = np.array([[0, -1, 0], [-1, 5, -1], [0, -1, 0]])
    final = cv2.filter2D(contrast_enhanced, -1, kernel_sharp)

    temp_dir = os.path.join(os.getcwd(), "temp_ocr")
    os.makedirs(temp_dir, exist_ok=True)
    enhanced_path = output_name or os.path.join(
        temp_dir, f"enhanced_{os.path.basename(image_path)}"
    )
    cv2.imwrite(enhanced_path, final)

    return enhanced_path


def extract_table(result_lines, row_gap=20):
    rows = {}
    for item in result_lines:
        box = item[0]
        if (
            not isinstance(box, (list, tuple))
            or not box
            or not isinstance(box[0], (list, tuple))
        ):
            continue
        y_min = min(
            pt[1] for pt in box if isinstance(pt, (list, tuple)) and len(pt) > 1
        )
        x_min = min(
            pt[0] for pt in box if isinstance(pt, (list, tuple)) and len(pt) > 0
        )
        text = item[1][0] if len(item[1]) > 0 else ""
        row_key = int(y_min // row_gap)
        rows.setdefault(row_key, []).append((x_min, text))
    table = []
    for y in sorted(rows.keys()):
        row = [text for x, text in sorted(rows[y])]
        table.append(row)
    return table


def ocr_image(img_path):
    if not ocr_model:
        return "", ""
    enhanced_img = enhance_image(img_path)
    result = ocr_model.ocr(enhanced_img)
    if os.path.exists(enhanced_img):
        os.remove(enhanced_img)

    if not result or not result[0]:
        return "", ""

    lines = result[0]
    text_out = [line[1][0] for line in lines]
    table_data = extract_table(lines)
    table_str = "\n".join(["\t".join(row) for row in table_data])
    return "\n".join(text_out), table_str


def ocr_pdf(pdf_path):
    # Convert PDF to images
    pages = convert_from_path(pdf_path, dpi=300)

    temp_dir = os.path.join(os.getcwd(), "temp_ocr")
    os.makedirs(temp_dir, exist_ok=True)

    all_text = []
    all_tables = []

    for i, page in enumerate(pages, 1):
        temp_img = os.path.join(temp_dir, f"page_{i}.jpg")
        page.save(temp_img, "JPEG")
        text, table = ocr_image(temp_img)
        if os.path.exists(temp_img):
            os.remove(temp_img)
        all_text.append(text)
        all_tables.append(table)

    return "\n\n".join(all_text), "\n\n".join(all_tables)


def process_file_with_paddle(file_path: str) -> str:
    ext = os.path.splitext(file_path)[1].lower()
    if ext in [".jpg", ".jpeg", ".png"]:
        text, table = ocr_image(file_path)
        return text + "\n\n[TABLES IDENTIFIED]\n" + table
    elif ext == ".pdf":
        text, tables = ocr_pdf(file_path)
        return text + "\n\n[TABLES IDENTIFIED]\n" + tables
    else:
        # Fallback empty string if not a support format for paddle
        return ""
