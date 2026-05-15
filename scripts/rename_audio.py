import os
import re
import shutil

dir_path = r"E:\antigravity\ILTES\public\audio\16-20"
dest_path = r"E:\antigravity\ILTES\public\audio"

for file in os.listdir(dir_path):
    if not file.endswith('.mp3'):
        continue
    
    book_m = re.search(r'ielts-(\d+)', file)
    if not book_m: 
        continue
    book = int(book_m.group(1))
    
    test_m = re.search(r'listening-(\d+)', file)
    if not test_m: 
        continue
    test = int(test_m.group(1))
    
    part_m = re.search(r'audio.*?(\d+)(?:\s*\(\d+\)|-\.)?\.mp3', file)
    if not part_m: 
        print(f"Failed part: {file}")
        continue
    part = int(part_m.group(1))
    
    new_name = f"cam{book}-test{test}-part{part}.mp3"
    old_full = os.path.join(dir_path, file)
    new_full = os.path.join(dest_path, new_name)
    
    print(f"Moving {file} -> {new_name}")
    shutil.move(old_full, new_full)
