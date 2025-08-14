#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
测试HTML分片效果的脚本
"""

import os
from pathlib import Path

def test_html_chunks():
    """测试生成的HTML分片"""
    output_dir = Path("website_content")
    
    if not output_dir.exists():
        print("输出目录不存在，请先运行 docx_to_html.py")
        return
    
    print("=== HTML分片测试结果 ===\n")
    
    # 统计每个板块的分片数量
    sections = {}
    for file_path in output_dir.glob("*.html"):
        if file_path.is_file():
            filename = file_path.name
            if "_part" in filename:
                section_name = filename.split("_part")[0]
                if section_name not in sections:
                    sections[section_name] = []
                sections[section_name].append(filename)
    
    # 显示分片统计
    for section_name, files in sections.items():
        print(f"📁 {section_name}:")
        files.sort(key=lambda x: int(x.split("part")[1].split(".")[0]))
        for file in files:
            file_path = output_dir / file
            size = file_path.stat().st_size
            print(f"   ├─ {file} ({size} bytes)")
        print()
    
    # 检查图片
    images_dir = output_dir / "images"
    if images_dir.exists():
        print("🖼️  提取的图片:")
        for img_file in images_dir.iterdir():
            if img_file.is_file():
                size = img_file.stat().st_size
                print(f"   ├─ {img_file.name} ({size} bytes)")
        print()
    
    # 验证HTML结构
    print("🔍 HTML结构验证:")
    for section_name, files in sections.items():
        print(f"\n   {section_name}:")
        for file in files[:2]:  # 只检查前两个分片
            file_path = output_dir / file
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
                
            # 检查基本HTML标签
            has_paragraphs = '<p>' in content
            has_headings = any(f'<h{i}' in content for i in range(1, 7))
            has_tables = '<table' in content
            has_images = '<img' in content
            
            print(f"     {file}:")
            print(f"       ├─ 段落: {'✅' if has_paragraphs else '❌'}")
            print(f"       ├─ 标题: {'✅' if has_headings else '❌'}")
            print(f"       ├─ 表格: {'✅' if has_tables else '❌'}")
            print(f"       └─ 图片: {'✅' if has_images else '❌'}")
    
    print(f"\n✅ 测试完成！共生成 {len(sections)} 个板块的HTML分片")

if __name__ == "__main__":
    test_html_chunks()
