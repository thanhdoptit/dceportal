# CSS Standards Guide - System Sections

## 📋 Overview

Hướng dẫn này định nghĩa các standards và conventions để sử dụng CSS trong các system sections, đảm bảo consistency và maintainability.

## 🎨 CSS Files Structure

```
src/System/shared/styles/
├── SystemLayout.css      # Layout chung cho toàn bộ system (900+ lines)
└── SystemSection.css     # Styles cho section content (200+ lines)
```

## 📂 File Import Pattern

### Trong Section Files (.jsx):
```jsx
// Import ở đầu file
import '../../shared/styles/SystemSection.css';
```

### Trong Main Content Files:
```jsx
// UPSContent.jsx, CoolingContent.jsx, etc.
import '../shared/styles/SystemSection.css';
```

## 🏗️ HTML Structure Standards

### 1. Main Section Container
```jsx
<div className="content-section">
  {/* Tất cả nội dung section */}
</div>
```

### 2. Section Title (Level 2)
```jsx
<Title level={2}>
  1. SECTION NAME
</Title>
```
**CSS Applied:**
- Color: `#1890ff`
- Border bottom: `2px solid #1890ff`
- Margin: `24px bottom, 0 top`

### 3. Subsection Container
```jsx
<div id="1.1" className="subsection">
  <Title level={3}>
    1.1. Subsection Name
  </Title>
  {/* Content */}
</div>
```
**CSS Applied:**
- Scroll margin: `20px` (for smooth navigation)
- Title color: `#1890ff`
- Border bottom: `2px solid #1890ff`

### 4. Sub-subsection Container  
```jsx
<div id="1.1.1" className="subsection">
  <Title level={4}>
    1.1.1. Sub-subsection Name
  </Title>
  {/* Content */}
</div>
```
**CSS Applied:**
- Title color: `#0072BC`
- Margin: `12px bottom, 0 top`

### 5. Deep Nested Subsection
```jsx
<Title level={5}>
  Deep Section Title
</Title>
```
**CSS Applied:**
- Title color: `#0072BC`
- Margin: `8px bottom, 0 top`

## 🎯 ClassName Usage Guide

### Core Classes

| ClassName | Usage | Purpose |
|-----------|--------|---------|
| `content-section` | Main container | Root container cho tất cả content |
| `subsection` | Section containers | Container cho sections với navigation ID |
| `section-footer` | Footer text | Text ở cuối section (center, gray, 12px) |

### Auto-Applied Styling

Các elements sau **KHÔNG CẦN** className vì đã được style tự động:

- `.content-section .ant-typography h2` → Section titles
- `.subsection .ant-typography h3` → Subsection titles  
- `.subsection .ant-typography h4` → Sub-subsection titles
- `.content-section .ant-card` → Cards
- `.content-section .ant-alert` → Alerts
- `.content-section .ant-table-wrapper` → Tables

## ✅ DO - Best Practices

### ✅ Correct Structure:
```jsx
<div className="content-section">
  <Title level={2}>1. MAIN SECTION</Title>
  
  <div id="1.1" className="subsection">
    <Title level={3}>1.1. Subsection</Title>
    
    <Card title="Content Card">
      <div id="1.1.1" className="subsection">
        <Title level={4}>1.1.1. Sub-subsection</Title>
        <Title level={5}>Deep Section</Title>
        {/* Content */}
      </div>
    </Card>
  </div>
  
  <Paragraph className="section-footer">
    Footer text here
  </Paragraph>
</div>
```

### ✅ Auto-spacing Cards:
```jsx
{/* Cards tự động có margin-bottom: 20px */}
<Card title="Auto Spaced">
  <Card size="small" title="Nested Card">
    {/* Nested cards có margin-bottom: 16px */}
  </Card>
</Card>
```

### ✅ Navigation IDs:
```jsx
{/* IDs cho navigation menu */}
<div id="1.1" className="subsection">     {/* ✅ */}
<div id="2.3.1" className="subsection">   {/* ✅ */}
<div id="5.2.4" className="subsection">   {/* ✅ */}
```

## ❌ DON'T - Anti-patterns

### ❌ Inline Styles (Removed):
```jsx
{/* ❌ DON'T - These are now handled by CSS */}
<Title level={3} style={{ color: '#1890ff', marginTop: '32px' }}>
<div className="subsection" style={{ scrollMarginTop: '20px' }}>
<Title level={4} style={{ color: '#0072BC', marginBottom: '12px' }}>
```

### ❌ Manual Spacing:
```jsx
{/* ❌ DON'T - CSS handles spacing automatically */}
<Card style={{ marginBottom: '20px' }}>
<Alert style={{ marginBottom: '16px' }}>
```

### ❌ Missing Structure:
```jsx
{/* ❌ DON'T - Missing main container */}
<Title level={2}>Section</Title>

{/* ❌ DON'T - Missing subsection class */}
<div id="1.1">
  <Title level={3}>Subsection</Title>
</div>
```

## 🔧 Migration Pattern

### From Old Style:
```jsx
<div id="2.1" className="subsection" style={{ scrollMarginTop: '20px' }}>
  <Title level={3} style={{ color: '#1890ff', marginTop: '32px', marginBottom: '16px' }}>
    2.1. Section Name
  </Title>
</div>
```

### To New Standard:
```jsx
<div id="2.1" className="subsection">
  <Title level={3}>
    2.1. Section Name
  </Title>
</div>
```

## 📱 Responsive Behavior

CSS tự động responsive theo breakpoints:

### Mobile (≤768px):
- Title font sizes giảm
- Card margins giảm xuống 16px
- Divider margins giảm xuống 16px

### Desktop (>768px):
- Full spacing và font sizes
- Optimal margins và padding

## 🎨 Color Standards

| Element | Color Code | Usage |
|---------|------------|-------|
| Section Titles (h2, h3) | `#1890ff` | Main sections |
| Sub-section Titles (h4, h5) | `#0072BC` | Sub-sections |
| Strong Text | `#1890ff` | Emphasized text |
| Footer Text | `#666` | Section footers |

## 🚀 Performance Benefits

### Before (Inline Styles):
- Many inline style objects created
- No CSS caching
- Larger bundle size
- Runtime style calculations

### After (CSS Classes):
- Single CSS file cached
- Smaller bundle size  
- Better browser optimization
- Consistent rendering

## 💡 Tips & Best Practices

1. **Always import CSS**: `import '../../shared/styles/SystemSection.css';`

2. **Use semantic structure**: content-section → subsection → content

3. **Trust auto-spacing**: Let CSS handle margins/padding

4. **Consistent IDs**: Follow "section.subsection.sub" pattern

5. **Clean markup**: Remove all inline style attributes

6. **Section footer**: Use `className="section-footer"` for consistent styling

7. **Test responsive**: Check mobile/tablet layouts

## 🔍 Debugging

### Check Applied Styles:
```css
/* These should work automatically */
.content-section .ant-typography h2 { color: #1890ff; }
.subsection .ant-typography h3 { color: #1890ff; }
.subsection .ant-typography h4 { color: #0072BC; }
```

### Common Issues:
- **Missing CSS import** → Colors not applied
- **Wrong container class** → Spacing issues  
- **Inline styles override** → Inconsistent appearance
- **Missing subsection class** → No scroll behavior

## 📋 Checklist

✅ Import CSS file in section  
✅ Use `content-section` as root container  
✅ Use `subsection` for navigation containers  
✅ Remove all inline margin/color styles  
✅ Use semantic title levels (2→3→4→5)  
✅ Add proper navigation IDs  
✅ Use `section-footer` class for footers  
✅ Test responsive behavior  

---

*Last updated: December 2024*  
*Version: 2.0 - Post CSS Standardization*