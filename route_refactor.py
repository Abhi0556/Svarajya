import os
import shutil
import re

old_app = r'd:\Work\Svarajya\Svarajya\src\app'
new_app = r'd:\Work\Svarajya\Svarajyanew\Svarajya\src\app\(dashboard)'

mapping = {
    'bank': r'khate\accounts',
    'identity': r'pehchaan\records',
    'credentials': r'dwaar\portals'
}

# 1. Copy the frontend files to their new destinations
for old_dir, new_dir in mapping.items():
    src = os.path.join(old_app, old_dir)
    dst = os.path.join(new_app, new_dir)
    
    if os.path.exists(src):
        # We will clear out the existing destination first so we completely overwrite stubs
        if os.path.exists(dst):
            shutil.rmtree(dst)
        shutil.copytree(src, dst, dirs_exist_ok=True)
        print(f"Copied {old_dir} to {new_dir}")

# 2. Iterate through all .ts/.tsx files in new project and rename internal routes
new_src = r'd:\Work\Svarajya\Svarajyanew\Svarajya\src'

replace_mapping = {
    r"'/identity": "'/pehchaan/records",
    r'"/identity': '"/pehchaan/records',
    r"`/identity": "`/pehchaan/records",
    
    r"'/bank": "'/khate/accounts",
    r'"/bank': '"/khate/accounts',
    r"`/bank": "`/khate/accounts",
    
    r"'/credentials": "'/dwaar/portals",
    r'"/credentials': '"/dwaar/portals',
    r"`/credentials": "`/dwaar/portals"
}

modified_files = 0
for root, dirs, files in os.walk(new_src):
    for filename in files:
        if filename.endswith('.tsx') or filename.endswith('.ts'):
            filepath = os.path.join(root, filename)
            try:
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                original = content
                for old_val, new_val in replace_mapping.items():
                    content = content.replace(old_val, new_val)
                
                if content != original:
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(content)
                    modified_files += 1
            except Exception as e:
                pass

print(f"Replaced string mappings in {modified_files} files.")
