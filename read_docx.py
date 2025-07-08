import docx

def read_docx(file_path):
    try:
        doc = docx.Document(file_path)
        content = []
        for paragraph in doc.paragraphs:
            if paragraph.text.strip():
                content.append(paragraph.text)
        return content
    except Exception as e:
        print(f"Error reading document: {e}")
        return []

if __name__ == "__main__":
    file_path = "ITCS-GP24-07[1].docx"
    content = read_docx(file_path)
    for i, text in enumerate(content):
        print(f"Paragraph {i+1}: {text}")
        print("-" * 50) 