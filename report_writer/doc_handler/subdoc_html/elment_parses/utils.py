def remove_extra_spaces(text):
    lines = text.split()
    lines = [line.strip() for line in lines]
    return " ".join(lines)

