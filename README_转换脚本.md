# Docx转HTML分片转换脚本使用说明

## 功能概述

这个Python脚本可以将多个docx文件转换为可直接嵌入个人网站子页面的HTML片段，支持内容分片，防止单个HTML文件过长。

## 主要特性

- ✅ 支持多个docx文件批量转换
- ✅ 保留文档格式（标题、段落、列表、加粗、斜体、表格等）
- ✅ 自动提取并导出图片
- ✅ 智能分片，不破坏HTML标签结构
- ✅ 按板块自动合并相关文档
- ✅ 命令行参数配置
- ✅ UTF-8编码支持

## 文件映射关系

脚本会自动按以下关系处理文档：

| 板块名称 | 对应的docx文件 |
|---------|---------------|
| 揭示产品思维 | 产品需求文档.docx, 产品分析报告.docx |
| 洞察分析能力 | AI产品体验报告.docx, 市场调研报告.docx |
| 掌握工具应用 | vibe开发总结.docx |
| 沉淀学习心得 | 学习总结与心得.docx |

## 安装依赖

```bash
pip install python-docx
```

## 使用方法

### 基本用法

```bash
# 使用默认参数（当前目录作为输入，output作为输出目录）
python docx_to_html.py

# 指定输入和输出目录
python docx_to_html.py --input ./docx_files --output ./html_output

# 自定义分片大小（默认2000字符）
python docx_to_html.py --chunk-size 3000

# 使用短参数
python docx_to_html.py -i ./docx_files -o ./html_output -c 3000
```

### 参数说明

- `--input, -i`: 输入文件夹路径（包含docx文件的目录）
- `--output, -o`: 输出文件夹路径（生成的HTML文件保存位置）
- `--chunk-size, -c`: 每个分片的字符数（默认2000）

## 输出结构

```
output/
├── 揭示产品思维_part1.html
├── 揭示产品思维_part2.html
├── 洞察分析能力_part1.html
├── 洞察分析能力_part2.html
├── 掌握工具应用_part1.html
├── 沉淀学习心得_part1.html
└── images/
    ├── 产品需求文档_image_1.png
    ├── AI产品体验报告_image_1.png
    └── ...
```

## 分片逻辑

- 脚本会按纯文本字符数进行分片
- 分片时会保持HTML标签的完整性，不会破坏段落、标题等结构
- 每个分片都是合法的HTML片段，可以直接嵌入网页

## 格式保留

脚本会保留以下格式：

- **标题**: h1-h6标签，自动识别文档样式
- **段落**: p标签，保留对齐方式
- **文本格式**: 加粗(strong)、斜体(em)、下划线(u)
- **表格**: 完整的table结构，自动识别表头
- **图片**: 自动提取并生成img标签

## 使用示例

### 1. 准备文档

将需要转换的docx文件放在一个文件夹中，例如：
```
docx_files/
├── 产品需求文档.docx
├── 产品分析报告.docx
├── AI产品体验报告.docx
├── 市场调研报告.docx
├── vibe开发总结.docx
└── 学习总结与心得.docx
```

### 2. 运行转换

```bash
python docx_to_html.py --input ./docx_files --output ./website_content
```

### 3. 查看结果

转换完成后，在`website_content`目录中会生成：
- 每个板块的HTML分片文件
- `images`子目录包含所有提取的图片

### 4. 嵌入网页

将生成的HTML片段直接复制到对应子页面的内容区域：

```html
<!-- 在子页面的内容容器中 -->
<div class="content">
    <!-- 复制生成的HTML片段内容 -->
    <h2>产品需求文档</h2>
    <p>产品愿景与概述...</p>
    <!-- ... 更多内容 ... -->
</div>
```

## 注意事项

1. **文件编码**: 确保docx文件使用UTF-8编码，以正确显示中文
2. **图片路径**: 生成的HTML中的图片路径是相对路径，需要确保图片文件与HTML文件在同一目录结构下
3. **分片大小**: 根据实际需求调整分片大小，建议在1500-3000字符之间
4. **HTML兼容性**: 生成的HTML片段可以直接嵌入现代浏览器支持的HTML页面

## 故障排除

### 常见问题

1. **ImportError: No module named 'docx'**
   ```bash
   pip install python-docx
   ```

2. **图片提取失败**
   - 检查docx文件是否包含图片
   - 确保有写入权限

3. **中文显示乱码**
   - 确保docx文件使用UTF-8编码
   - 检查Python环境的编码设置

### 调试模式

如需查看详细处理过程，可以在脚本中添加更多print语句或使用Python的logging模块。

## 技术实现

- 使用`python-docx`库解析docx文件
- 正则表达式进行HTML分片
- Path对象处理文件路径
- 面向对象设计，便于扩展和维护

## 更新日志

- v1.0: 初始版本，支持基本转换和分片功能
- 支持图片提取和格式保留
- 智能分片算法，保持HTML结构完整
